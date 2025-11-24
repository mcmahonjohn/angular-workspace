import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { updateImports } from './update-imports';

export function updateToV2(): (_tree: Tree, context: SchematicContext) => Tree {
  return (tree: Tree, context: SchematicContext) => {
    updateImports(tree, context);
    return tree;
  };
}
