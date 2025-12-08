import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { updateImports } from './update-imports';


function updateFontAwesomeDeps(tree: Tree, context: SchematicContext) {
  const pkgPath = '/package.json';
  if (!tree.exists(pkgPath)) return;
  const buffer = tree.read(pkgPath);
  if (!buffer) return;
  const pkg = JSON.parse(buffer.toString('utf-8'));
  let changed = false;
  const deps = [
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ];
  const upgradeMap = {
    '@fortawesome/angular-fontawesome': '^0.15.0',
    '@fortawesome/fontawesome-svg-core': '^6.5.2',
    '@fortawesome/free-brands-svg-icons': '^6.5.2',
    '@fortawesome/free-regular-svg-icons': '^6.5.2',
    '@fortawesome/free-solid-svg-icons': '^6.5.2',
  };
  for (const depType of deps) {
    if (pkg[depType]) {
      for (const dep in upgradeMap) {
        if (pkg[depType][dep] && !pkg[depType][dep].startsWith('^0.15.')) {
          pkg[depType][dep] = upgradeMap[dep];
          context.logger.info(`Upgraded ${dep} to ${upgradeMap[dep]} in ${depType}`);
          changed = true;
        }
      }
    }
  }
  if (changed) {
    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
}

export function updateToV2(): (_tree: Tree, context: SchematicContext) => Tree {
  return (tree: Tree, context: SchematicContext) => {
    updateImports(tree, context);
    updateFontAwesomeDeps(tree, context);
    return tree;
  };
}
