import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema as NestNgNewOptions } from './schema';
import { execSync } from 'child_process';

export function nestNgNew(options: NestNgNewOptions): Rule {
  if (options.dryRun === undefined) {
    options.dryRun = true;
  }
  return (tree: Tree, _context: SchematicContext) => {
    const {
      name,
      version = 'latest',
      strict = true,
      skipGit = true,
      packageManager = 'npm',
      language = 'typescript',
      schematicCollections = [
        '@nestjs/swagger',
        '@nestjs/terminus',
        '@nestjsx/crud',
        '@nestjs/schematics',
      ],
    } = options;

    // Build the nest CLI command
    let cmd = `npx -p @nestjs/cli@${version} nest new ${name}`;
    cmd += ` --strict${strict ? '' : '=false'}`;
    cmd += ` --skip-git=${skipGit}`;
    cmd += ` --package-manager=${packageManager}`;
    cmd += ` --language=${language}`;
    if (options.dryRun) {
      cmd += ' --dry-run';
    }
    if (schematicCollections && schematicCollections.length > 0) {
      cmd += ' --collection ' + schematicCollections.join(' --collection ');
    }

    _context.logger.info(`Running: ${cmd}`);
    try {
      execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
      _context.logger.error(`Nest CLI failed: ${err}`);
      throw err;
    }
    return tree;
  };
}
