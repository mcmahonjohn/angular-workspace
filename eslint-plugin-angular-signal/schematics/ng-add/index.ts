import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

const SUPPORTED_CONFIGS = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yaml',
  '.eslintrc.yml',
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
module.exports = {
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
      tree.create('eslint.config.js', newConfig);
      context.logger.info('Created basic eslint.config.js. Please customize as needed.');
    }
    return tree;
  };
}
