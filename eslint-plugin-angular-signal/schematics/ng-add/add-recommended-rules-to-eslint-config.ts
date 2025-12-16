import { Tree, SchematicContext, Rule } from '@angular-devkit/schematics';

/**
 * Adds recommended rules to the ESLint config for the section for ts file extensions.
 * Only works for flat config (ESLint v9+).
 */
export function addRecommendedRulesToEslintConfig(eslintConfigPath: string, recommendedRules: Record<string, any>): Rule {
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

    // Naive approach: look for files: ['**/*.ts'] and insert rules
    const filesSectionRegex = /(files\s*:\s*\[\s*['\"]\*\*\/*.ts['\"]\s*\][^}]*rules\s*:\s*{)([^}]*)}/m;

    if (filesSectionRegex.test(content)) {
      content = content.replace(filesSectionRegex, (match, start, rulesBlock) => {

        let newRules = '';

        for (const [rule, value] of Object.entries(recommendedRules)) {
          if (!rulesBlock.includes(rule)) {
            newRules += `\n    '${rule}': ${JSON.stringify(value)},`;
          }
        }
        return `${start}${rulesBlock}${newRules}\n  }`;
      });

      tree.overwrite(eslintConfigPath, content);
      context.logger.info(`Added recommended rules to '**/*.ts' section in ${eslintConfigPath}.`);

    } else {
      context.logger.warn(`No '**/*.ts' files section found in ${eslintConfigPath}. Please add recommended rules manually.`);
    }
    return tree;
  };
}
