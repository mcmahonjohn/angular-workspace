import { Tree, SchematicContext } from '@angular-devkit/schematics';

function replaceImportPath(source: string): string {
  return source.replace(/(['"])my-lib\1/g, '$1library$1');
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
