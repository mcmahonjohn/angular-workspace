import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

/**
 * Updates lint scripts in package.json for ng lint and ng lint --fix.
 * Warns if other lint-related scripts are found but not the expected ones.
 */
export function updateLintScriptsInPackageJson(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const pkgPath = '/package.json';

    if (!tree.exists(pkgPath)) {
      context.logger.warn('No package.json found at root. Skipping lint script update.');
      return tree;
    }

    const pkgBuffer = tree.read(pkgPath);

    if (!pkgBuffer) {
      context.logger.warn('Could not read package.json. Skipping lint script update.');
      return tree;
    }
    const pkgJson = JSON.parse(pkgBuffer.toString('utf-8'));
    const scripts = pkgJson.scripts || {};
    let changed = false;

    // Track found scripts
    let foundLint = false;
    let foundLintFix = false;
    let foundLintFixAlt = false;
    const otherLintScripts: string[] = [];

    for (const [key, value] of Object.entries(scripts)) {
      if (key === 'lint') {
        foundLint = true;

        if (value !== 'ng lint') {
          scripts['lint'] = 'ng lint';
          changed = true;
        }
      } else if (key === 'lint:fix') {
        foundLintFix = true;

        if (value !== 'ng lint --fix') {
          scripts['lint:fix'] = 'ng lint --fix';
          changed = true;
        }
      } else if (key === 'lint-fix') {
        foundLintFixAlt = true;
        // Rename lint-fix to lint:fix and update value
        delete scripts['lint-fix'];
        scripts['lint:fix'] = 'ng lint --fix';
        changed = true;

    } else if (key.includes('lint')) {
        otherLintScripts.push(key);
      }
    }

    if (!foundLint) {
      context.logger.warn('No "lint" script found in package.json.');
    }

    if (!foundLintFix && !foundLintFixAlt) {
      context.logger.warn('No "lint:fix" or "lint-fix" script found in package.json.');
    }

    if (otherLintScripts.length > 0) {
      context.logger.warn(`Other lint-related scripts found: ${otherLintScripts.join(', ')}. Please review them for any necessary updates.`);
    }

    if (changed) {
      pkgJson.scripts = scripts;
      tree.overwrite(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
      context.logger.info('Updated lint scripts in package.json.');
    }

    return tree;
  };
}
