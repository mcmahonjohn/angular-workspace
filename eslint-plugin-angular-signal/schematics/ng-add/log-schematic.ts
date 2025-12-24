import { SchematicContext, Tree } from "@angular-devkit/schematics";

export function logSchematicSummary(context: SchematicContext, legacyConfig: string | null): void {

    // Log actionable feedback
    context.logger.info('--- ESLint Angular Signal Plugin Schematic Summary ---');

    if (legacyConfig) {
      context.logger.info(`Legacy config detected: ${legacyConfig}. Migration required.`);

    // } else if (updatedConfigs.length > 0) {
    //   context.logger.info(`Updated configs: ${updatedConfigs.join(', ')}`);

    } else {
      context.logger.info('No changes made to ESLint config files.');
    }

    context.logger.info('Next steps:');
    context.logger.info('- Review your ESLint config for correctness.');
    context.logger.info('- Run "npm run lint" to verify setup.');
    context.logger.info('- Run "npm run lint:fix" to verify the auto-fix setup.');
    context.logger.info('- See https://eslint.org/docs/latest/use/configure/ for more info.');
}