import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

import { addPluginToEslintConfig } from './add-plugin-to-eslint-config.js';
import { addRecommendedRulesToEslintConfig } from './add-recommended-rules-to-eslint-config.js';
import { logSchematicSummary } from './log-schematic.js';
import { updateLintScriptsInPackageJson } from './update-lint-scripts-in-package-json.js';

const SUPPORTED_CONFIGS = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
];

const LEGACY_CONFIGS = [
  '.eslintrc.json',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc',
];

function findFlatConfig(tree: Tree): string | null {
  for (const config of SUPPORTED_CONFIGS) {
    if (tree.exists(config)) {
      return config;
    }
  }
  return null;
}

function findLegacyEslintConfig(tree: Tree): string | null {
  for (const config of LEGACY_CONFIGS) {
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

    const legacyConfigFile = findLegacyEslintConfig(tree);
    const existingFlatConfigFile = findFlatConfig(tree);
    const newFlatConfigFile = 'eslint.config.mjs';

    if (legacyConfigFile) {

      context.logger.error(
        `Legacy ESLint config file found: ${legacyConfigFile}. This schematic only supports flat config files.\n` +
        `Please migrate to a flat config before proceeding. See: https://eslint.org/docs/latest/extend/plugin-migration-flat-config\n` +
        `Once migrated, re-run this schematic.`
      );

      return tree;
    }

    if (configFile) {
      context.logger.info(`ESLint config file found: ${configFile}. No changes made.`);

    if (!existingFlatConfigFile && !legacyConfigFile) {
      context.logger.info(
        'No ESLint flat config file found. This schematic will create a basic config.'
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

    logSchematicSummary(context, legacyConfigFile, existingFlatConfigFile,  newFlatConfigFile);

    return tree;
  };
}
