import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

import { addPluginToEslintConfig } from './add-plugin-to-eslint-config.js';
import { addRecommendedRulesToEslintConfig } from './add-recommended-rules-to-eslint-config.js';
import { updateLintScriptsInPackageJson } from './update-lint-scripts-in-package-json.js';

const SUPPORTED_CONFIGS = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
];

function findEslintConfig(tree: Tree): string | null {
  for (const config of SUPPORTED_CONFIGS) {
    if (tree.exists(config)) {
      return config;
    }
  }
  return null;
}

function createBasicEslintConfig(): string {
  return `// Basic ESLint config for Angular
export default {
  root: true,
  plugins: ['angular-signal'],
  extends: [],
  rules: {},
};
`;
}

export default function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const configFile = findEslintConfig(tree);

    if (configFile) {
      context.logger.info(`ESLint config file found: ${configFile}. No changes made.`);

    } else {
      context.logger.info(
        'No ESLint config file found. You can initialize one with "ng generate @angular-eslint/schematics:eslint-config" or let this schematic create a basic config.'
      );

      // Optionally, create a basic config file
      const newConfig = createBasicEslintConfig();
      tree.create('eslint.config.mjs', newConfig);
      context.logger.info('Created basic eslint.config.mjs. Please customize as needed.');
    }

    // Always try to add the plugin and recommended rules if config exists or was just created
    const configPath = configFile || 'eslint.config.mjs';
    // Add 'angular-signal' to plugins array
    addPluginToEslintConfig(configPath)(tree, context);
    // Add recommended rules to '**/*.ts' section
    addRecommendedRulesToEslintConfig(configPath, {
      'angular-signal/some-rule': 'error',
      // Add more recommended rules here
    })(tree, context);

    // Update lint scripts in package.json
    updateLintScriptsInPackageJson()(tree, context);
    return tree;
  };
}
