import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

/**
 * Adds 'eslint-plugin-angular-signal' to devDependencies in package.json if not present.
 */
export function addPluginToDevDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const pkgPath = '/package.json';

    if (!tree.exists(pkgPath)) {
      context.logger.warn('No package.json found at root. Skipping devDependency addition.');
      return tree;
    }

    const pkgBuffer = tree.read(pkgPath);

    if (!pkgBuffer) {
      context.logger.warn('Could not read package.json. Skipping devDependency addition.');
      return tree;
    }

    const pkgJson = JSON.parse(pkgBuffer.toString('utf-8'));
    const devDeps = pkgJson.devDependencies || {};

    if (!devDeps['eslint-plugin-angular-signal']) {
    // Read the plugin's own package.json to get the version
    const pluginPkgPath = 'node_modules/eslint-plugin-angular-signal/package.json';
    let pluginVersion = '^1.0.0';

    if (tree.exists(pluginPkgPath)) {
      const pluginPkgBuffer = tree.read(pluginPkgPath);

      if (pluginPkgBuffer) {
        const pluginPkgJson = JSON.parse(pluginPkgBuffer.toString('utf-8'));

        if (pluginPkgJson.version) {
        pluginVersion = `^${pluginPkgJson.version}`;
        }
      }
    }
    devDeps['eslint-plugin-angular-signal'] = pluginVersion;
      pkgJson.devDependencies = devDeps;
      tree.overwrite(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
      context.logger.info("Added 'eslint-plugin-angular-signal' to devDependencies in package.json.");

    } else {
      context.logger.info("'eslint-plugin-angular-signal' already present in devDependencies.");
    }

    return tree;
  };
}