import { SchematicContext } from "@angular-devkit/schematics";

export function logSchematicSummary(
  context: SchematicContext,
  legacyConfig: string | null,
  configFile: string | null,
  newFlatConfigFile: string | null,
): void {

    // Log actionable feedback
    context.logger.info('--- ESLint Angular Signal Plugin Schematic Summary ---');

    if (legacyConfig) {
      context.logger.info(`Legacy config detected: ${legacyConfig}. Migration required.`);

    } else if (configFile) {
      context.logger.info(`Updated config: ${configFile}`);
      context.logger.info('Updated package.json');

    } else {
      context.logger.info('No ESLint config files found.');
      context.logger.info(`Created new flat config file: ${newFlatConfigFile}`);
      context.logger.info('Updated package.json');
    }

    context.logger.info('Next steps:');
    context.logger.info('- Review your ESLint config for correctness.');
    context.logger.info('- Run "npm run lint" to verify setup.');
    context.logger.info('- Run "npm run lint:fix" to verify the auto-fix setup.');
    context.logger.info('- See https://eslint.org/docs/latest/use/configure/ for more info.');
}