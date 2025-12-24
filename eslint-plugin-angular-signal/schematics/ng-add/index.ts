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

function applyAngularSignalPluginAndRules(configFile: string, tree: Tree, context: SchematicContext) {
  addPluginToEslintConfig(configFile)(tree, context);

  addRecommendedRulesToEslintConfig(configFile, {
    'angular-signal/some-rule': 'error',
  })(tree, context);
}

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

    if (existingFlatConfigFile) {
      applyAngularSignalPluginAndRules(existingFlatConfigFile, tree, context);
    }

    if (!existingFlatConfigFile && !legacyConfigFile) {
      context.logger.info(
        'No ESLint flat config file found. This schematic will create a basic config.'
      );

      // Optionally, create a basic config file
      const newConfigContent = createBasicEslintConfig();

      tree.create(newFlatConfigFile, newConfigContent);
      context.logger.info(`Created basic ${newFlatConfigFile}. Please customize as needed.`);

      applyAngularSignalPluginAndRules(newFlatConfigFile, tree, context);
    }

    // Update lint scripts in package.json
    updateLintScriptsInPackageJson()(tree, context);

    logSchematicSummary(context, legacyConfigFile, existingFlatConfigFile,  newFlatConfigFile);

    return tree;
  };
}
