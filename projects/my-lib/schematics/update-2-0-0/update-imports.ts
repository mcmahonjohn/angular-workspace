import { Tree, SchematicContext } from '@angular-devkit/schematics';

function replaceImportPath(source: string): string {
  // Replace TypeScript import paths: import ... from 'my-lib';
  source = source.replace(
    /import\s+[^'"]+['"]my-lib['"]/g,
    match => match.replace(/(['"])my-lib\1/, '$1library$1')
  );

  // Replace SCSS @import paths: @import 'my-lib';
  source = source.replace(
    /@import\s+(['"])my-lib\1/g,
    '@import $1library$1'
  );

  return source;
}

export function updateImports(tree: Tree, context: SchematicContext): void {
  tree.visit(filePath => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.scss')) {
      const buffer = tree.read(filePath);

      if (!buffer) {
        return;
      }

      const content = buffer.toString('utf-8');
      const updated = replaceImportPath(content);

      if (updated !== content) {
        tree.overwrite(filePath, updated);
        context.logger.info(`Updated imports in ${filePath}`);
      }
    }
  });
}
