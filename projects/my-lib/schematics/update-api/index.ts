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

  // Expand file patterns to support old (.component.ts), new (-component.ts)
  // and "no-segment" styles (e.g. `foo.ts`) for certain types.
  const knownSegments = ['component', 'directive', 'service', 'pipe', 'module', 'model', 'interface'];

  // For these segments, also generate a pattern that removes the segment entirely
  // to support new style that omits the type (e.g. `foo.ts`).
  const segmentsAllowRemoval = new Set(['component', 'directive', 'service', 'model', 'interface']);

  const expandPattern = (pattern: string) => {
    const variants = new Set<string>();
    variants.add(pattern);

    knownSegments.forEach((seg) => {
      const dotSegment = `.${seg}.`;
      const dashSegment = `-${seg}.`;

      if (pattern.indexOf(dotSegment) !== -1) {
        // dot -> dash variant
        variants.add(pattern.split(dotSegment).join(dashSegment));

        // dot -> removed-segment variant (e.g. `*.component.ts` -> `*.ts`)
        if (segmentsAllowRemoval.has(seg)) {
          variants.add(pattern.split(dotSegment).join('.'));
        }
      }

      if (pattern.indexOf(dashSegment) !== -1) {
        // dash -> dot variant
        variants.add(pattern.split(dashSegment).join(dotSegment));

        // dash -> removed-segment variant (e.g. `*-component.ts` -> `*.ts`)
        if (segmentsAllowRemoval.has(seg)) {
          variants.add(pattern.split(dashSegment).join('-').replace(new RegExp(`-${seg}(?=\.)`), ''));
          // also try replacing the dash-segment with just '.' for patterns like `name-component.html` -> `name.html`
          variants.add(pattern.split(dashSegment).join('.'));
        }
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
