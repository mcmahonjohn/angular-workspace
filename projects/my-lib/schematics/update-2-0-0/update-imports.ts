import { Tree, SchematicContext } from '@angular-devkit/schematics';

export function replaceImportPath(source: string): string {
  // Replace TypeScript import paths: import ... from '@car';
  source = source.replace(
    /import\s+[^'"]+['"]@car['"]/g,
    match => match.replace(/(['"])@car\1/, '$1@door$1')
  );

  // Replace SCSS @import paths: @import '@car';
  source = source.replace(
    /@import\s+(['"])@car\1/g,
    '@import $1@door$1'
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
