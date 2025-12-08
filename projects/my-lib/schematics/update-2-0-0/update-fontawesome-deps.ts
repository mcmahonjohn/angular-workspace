import { Tree, SchematicContext } from '@angular-devkit/schematics';

export function updateFontAwesomeDeps(tree: Tree, context: SchematicContext) {
  const pkgPath = '/package.json';

  if (!tree.exists(pkgPath)) {
    return;
  }

  const buffer = tree.read(pkgPath);

  if (!buffer) {
    return;
  }

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
  } as const;

  type FontAwesomeDep = keyof typeof upgradeMap;

  for (const depType of deps) {

    if (pkg[depType]) {

      for (const dep in upgradeMap) {

        if (
          Object.prototype.hasOwnProperty.call(pkg[depType], dep) &&
          typeof pkg[depType][dep] === 'string' &&
          pkg[depType][dep] !== upgradeMap[dep as FontAwesomeDep]
        ) {
          pkg[depType][dep] = upgradeMap[dep as FontAwesomeDep];
          context.logger.info(`Upgraded ${dep} to ${upgradeMap[dep as FontAwesomeDep]} in ${depType}`);
          changed = true;
        }
      }
    }
  }

  if (changed) {
    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
}