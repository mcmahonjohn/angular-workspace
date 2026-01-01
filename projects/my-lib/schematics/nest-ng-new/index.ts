import {
  Rule,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';

import { addDockerfilesIfRequested } from '../common/dockerfiles';

import { NestNgNewOptions } from './schema';

export default function (options: NestNgNewOptions): Rule {
  if (options.dryRun === undefined) {
    options.dryRun = true;
  }
  if (!options.schematicCollections) {
    options.schematicCollections = [
      '@nestjs/swagger',
      '@nestjs/terminus',
      '@nestjsx/crud',
      '@nestjs/schematics',
    ];
  }
  return chain([
    externalSchematic(
      '@nestjs/schematics',
      'ng-new',
      {
        name: options.name,
        version: options.version,
        strict: options.strict,
        skipGit: options.skipGit,
        packageManager: options.packageManager,
        language: options.language,
        dryRun: options.dryRun,
        schematicCollections: options.schematicCollections,
      }
    ),
    addDockerfilesIfRequested(
      options.docker,
      options.directory || '.',
      './templates'
    ),
  ]);
}
