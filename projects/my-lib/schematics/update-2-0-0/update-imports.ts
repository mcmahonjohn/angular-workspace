import { Tree, SchematicContext } from '@angular-devkit/schematics';

export function replaceImportPath(source: string): string {
  // Replace TypeScript import paths: import ... from '@car/core' or "@car/core"
  source = source.replace(/(import\s+[^;]*from\s+)(['"])@car\/core\2/g, '$1$2@door/core$2');

  // Replace SCSS @import paths: @import '@car/core' or "@car/core"
  source = source.replace(/(@import\s+)(['"])@car\/core\2/g, '$1$2@door/core$2');

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
