import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

/**
 * Adds 'angular-signal' to the plugins array in the ESLint config if not already present.
 * Supports flat config (ESLint v9+).
 */
export function addPluginToEslintConfig(eslintConfigPath: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists(eslintConfigPath)) {
      context.logger.warn(`ESLint config file not found: ${eslintConfigPath}`);
      return tree;
    }

    const buffer = tree.read(eslintConfigPath);

    if (!buffer) {
      context.logger.warn(`Could not read ESLint config: ${eslintConfigPath}`);
      return tree;
    }

    let content = buffer.toString('utf-8');

    // Naive check for plugins array and 'angular-signal' entry
    if (/plugins\s*:\s*\[([^\]]*)\]/.test(content)) {

      if (content.includes("'angular-signal'")) {
        context.logger.info(`'angular-signal' already present in plugins array.`);
        return tree;
      }

      // Insert 'angular-signal' into plugins array
      content = content.replace(/plugins\s*:\s*\[/, "plugins: ['angular-signal', ");
      tree.overwrite(eslintConfigPath, content);
      context.logger.info(`Added 'angular-signal' to plugins array in ${eslintConfigPath}.`);

    } else {
      context.logger.warn(`No plugins array found in ${eslintConfigPath}. Please add 'angular-signal' manually.`);
    }
    return tree;
  };
}
