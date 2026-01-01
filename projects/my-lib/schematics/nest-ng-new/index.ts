import {
  Rule,
  chain,
  externalSchematic,
  apply,
  url,
  template,
  move,
  mergeWith,
} from '@angular-devkit/schematics';

import { Schema as NestNgNewOptions } from './schema';

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
    // Add Dockerfile and dev.Dockerfile if docker option is true
    (tree, context) => {
      if (options.docker) {
        const targetPath = options.name || '.';
        return mergeWith(
          apply(url('./templates'), [
            template({}),
            move(targetPath),
          ])
        )(tree, context);
      }
      return tree;
    },
  ]);
}
