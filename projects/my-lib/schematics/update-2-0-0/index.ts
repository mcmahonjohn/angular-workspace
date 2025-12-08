import { Tree, SchematicContext } from '@angular-devkit/schematics';

import { updateImports } from './update-imports';
import { updateFontAwesomeDeps } from './update-fontawesome-deps';

export function updateToV2(): (_tree: Tree, context: SchematicContext) => Tree {
  return (tree: Tree, context: SchematicContext) => {
    updateImports(tree, context);
    updateFontAwesomeDeps(tree, context);
    return tree;
  };
}
