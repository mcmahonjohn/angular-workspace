import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as path from 'path';
import { JsonObject } from '@angular-devkit/core';

interface Replacement {
  from: string;
  to: string;
  regex?: boolean;
}

interface ChangeSet {
  description?: string;
  filePatterns: string[];
  replacements: Replacement[];
}

interface ApiChanges {
  components?: ChangeSet[];
  directives?: ChangeSet[];
  services?: ChangeSet[];
  pipes?: ChangeSet[];
  modules?: ChangeSet[];
  other?: ChangeSet[];
  [key: string]: ChangeSet[] | undefined;
}

function applyChangeSet(tree: Tree, ctx: SchematicContext, changes: ChangeSet): void {
  const mm = require('minimatch');
  const matchFn = typeof mm === 'function' ? mm : mm.minimatch;

  // Expand file patterns to support old and new filename separators
  const knownSegments = ['component', 'directive', 'service', 'pipe', 'module'];
  const expandPattern = (pattern: string) => {
    const variants = new Set<string>();
    variants.add(pattern);

    knownSegments.forEach((seg) => {
      const dotSegment = `.${seg}.`;
      const dashSegment = `-${seg}.`;

      if (pattern.indexOf(dotSegment) !== -1) {
        variants.add(pattern.split(dotSegment).join(dashSegment));
      }

    });
    return Array.from(variants);
  };

  const expandedPatterns = changes.filePatterns.flatMap((p) => expandPattern(p));

  tree.visit((filePath) => {
    // check whether filePath matches any of the expanded patterns
    const matchesPattern = expandedPatterns.some((pattern) => matchFn(filePath, pattern));
    if (!matchesPattern) return;

    const buffer = tree.read(filePath);
    if (!buffer) return;
    let content = buffer.toString('utf-8');

    changes.replacements.forEach((rep) => {
      if (rep.regex) {
        const re = new RegExp(rep.from, 'g');
        content = content.replace(re, rep.to);
      } else {
        content = content.split(rep.from).join(rep.to);
      }
    });

    tree.overwrite(filePath, content);
    ctx.logger.info(`Applied API changes to ${filePath}`);
  });
}

export default function (_options: JsonObject): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Load api-changes.json from schematic folder
    const changesPath = path.join(__dirname, 'api-changes.json');
    let raw: Buffer | null = null;
    try {
      raw = tree.read(changesPath) || null;
    } catch (e) {
      raw = null;
    }

    // If not present in the virtual tree, try reading from disk (dist)
    if (!raw) {
      try {
        const fs = require('fs');
        raw = fs.readFileSync(changesPath);
      } catch (e) {
        raw = null;
      }
    }

    if (!raw) {
      context.logger.info('No api-changes.json found; skipping update-api');
      return tree;
    }

    let apiChanges: ApiChanges;
    try {
      apiChanges = JSON.parse(raw.toString('utf-8')) as ApiChanges;
    } catch (e) {
      context.logger.error('Invalid api-changes.json');
      return tree;
    }

    // For each category apply change sets
    Object.keys(apiChanges).forEach((category) => {
      const sets = apiChanges[category];
      if (!sets) return;
      sets.forEach((set) => applyChangeSet(tree, context, set));
    });

    return tree;
  };
}

export { applyChangeSet };
