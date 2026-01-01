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
        dryRun: options.dryRun,
        language: options.language,
        name: options.name,
        packageManager: 'npm',
        schematicCollections: options.schematicCollections,
        skipGit: options.skipGit,
        strict: true,
        version: options.version,
      }
    ),
    addDockerfilesIfRequested(
      options.docker,
      options.directory || '.',
      './templates'
    ),
  ]);
}
