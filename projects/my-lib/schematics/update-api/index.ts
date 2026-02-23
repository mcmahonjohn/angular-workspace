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
  htmlReplacements?: Replacement[];
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

  const allowedScopes = ['src/app/', 'src/lib/'];

  const inAllowedScope = (p: string) => allowedScopes.some((s) => p.startsWith(s));

  tree.visit((filePath) => {
    if (!inAllowedScope(filePath)) return; // restrict to src/app and src/lib

    // check whether filePath matches any of the expanded patterns
    const matchesPattern = expandedPatterns.some((pattern) => matchFn(filePath, pattern));
    if (!matchesPattern) return;

    const buffer = tree.read(filePath);
    if (!buffer) return;
    let content = buffer.toString('utf-8');

    const isTs = filePath.endsWith('.ts');
    const isHtml = filePath.endsWith('.html');

    // If HTML and there are htmlReplacements, apply them (components only typically)
    if (isHtml && changes.htmlReplacements && changes.htmlReplacements.length) {
      changes.htmlReplacements.forEach((rep) => {
        if (rep.regex) {
          const re = new RegExp(rep.from, 'g');
          content = content.replace(re, rep.to);
        } else {
          // whole-word replacement for HTML when non-regex
          const re = new RegExp(`\\b${escapeRegExp(rep.from)}\\b`, 'g');
          content = content.replace(re, rep.to);
        }
      });
      tree.overwrite(filePath, content);
      ctx.logger.info(`Applied HTML API changes to ${filePath}`);
      return;
    }

    // For TypeScript files, prefer AST-based identifier renames plus comment updates
    if (isTs) {
      const ts = require('typescript');
      const sourceText = content;
      const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);

      const edits: Array<{ start: number; end: number; text: string }> = [];

      // identifier-based (non-regex) replacements using AST
      changes.replacements.forEach((rep) => {
        if (rep.regex) {
          // fallback to regex replacement across the file (includes comments)
          const re = new RegExp(rep.from, 'g');
          content = content.replace(re, rep.to);
          return;
        }

        // treat non-regex replacements as identifier renames (whole-word, case-sensitive)
        if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(rep.from)) {
          const from = rep.from;
          const to = rep.to;

          const visit = (node: any) => {
            if (node && node.kind === ts.SyntaxKind.Identifier) {
              const name = node.getText(sourceFile);
              if (name === from) {
                edits.push({ start: node.getStart(sourceFile), end: node.getEnd(sourceFile), text: to });
              }
            }
            ts.forEachChild(node, visit);
          };

          visit(sourceFile);

          // also update occurrences inside comments (both // and /* */)
          const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g;
          let match: RegExpExecArray | null;
          while ((match = commentRegex.exec(sourceText))) {
            const commentText = match[0];
            const wordRe = new RegExp(`\\b${escapeRegExp(from)}\\b`, 'g');
            if (wordRe.test(commentText)) {
              // compute replacement text
              const replaced = commentText.replace(wordRe, to);
              edits.push({ start: match.index, end: match.index + commentText.length, text: replaced });
            }
          }
        } else {
          // fallback: simple literal whole-word replacement
          const re = new RegExp(`\\b${escapeRegExp(rep.from)}\\b`, 'g');
          content = content.replace(re, rep.to);
        }
      });

      if (edits.length) {
        // apply edits in reverse order
        edits.sort((a, b) => b.start - a.start);
        let updated = sourceText;
        edits.forEach((e) => {
          updated = updated.slice(0, e.start) + e.text + updated.slice(e.end);
        });
        content = updated;
      }

      tree.overwrite(filePath, content);
      ctx.logger.info(`Applied TS API changes to ${filePath}`);
      return;
    }

    // Fallback: apply replacements as before for other file types
    changes.replacements.forEach((rep) => {
      if (rep.regex) {
        const re = new RegExp(rep.from, 'g');
        content = content.replace(re, rep.to);
      } else {
        const re = new RegExp(`\\b${escapeRegExp(rep.from)}\\b`, 'g');
        content = content.replace(re, rep.to);
      }
    });

    tree.overwrite(filePath, content);
    ctx.logger.info(`Applied API changes to ${filePath}`);
  });
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
