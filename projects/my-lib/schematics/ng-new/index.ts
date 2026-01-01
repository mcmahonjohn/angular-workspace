import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  externalSchematic,
  filter,
  mergeWith,
  move,
  template,
  url,
} from '@angular-devkit/schematics';
import { addDockerfilesIfRequested } from '../common/dockerfiles';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { JsonObject, JsonValue } from '@angular-devkit/core';

import { Schema as NgNewSchema } from './schema';

interface AngularJson {
  projects?: Record<string, JsonValue>;
  cli?: Record<string, JsonValue>;
  [key: string]: JsonValue | undefined;
}

interface ProjectConfig {
  architect?: Record<string, JsonValue>;
  [key: string]: JsonValue | undefined;
}

interface ArchitectConfig {
  [key: string]: JsonValue;
}

export default function (options: NgNewSchema): Rule {
  if (options.dryRun === undefined) {
    options.dryRun = true;
  }

  return async (tree: Tree, context: SchematicContext) => {

    return chain([
      // Create the workspace with Angular's ng-new schematic
      externalSchematic('@schematics/angular', 'ng-new', {
        dryRun: options.dryRun,
        name: options.name,
        directory: options.directory,
        commit: false,
        createApplication: true,
        inlineStyle: false,
        inlineTemplate: false,
        interactive: true,
        packageManager: 'npm',
        prefix: 'app',
        skipGit: true,
        ssr: false,
        standalone: true,
        strict: true,
        style: 'scss',
        viewEncapsulation: 'Emulated',
        zoneless: false,
        routing: options.routing ?? true,
        minimal: options.minimal ?? false,
      }),

      // Configure the workspace
      (tree: Tree, context: SchematicContext) => {
        const workspacePath = options.directory ? `${options.directory}/angular.json` : 'angular.json';

        if (!tree.exists(workspacePath)) {
          throw new Error(`Workspace file not found at ${workspacePath}`);
        }

        // Update angular.json
        updateAngularJson(tree, workspacePath, options);

        // Update tsconfig.json
        updateTsConfig(tree, options);

        return tree;
      },

      // Create karma config files from templates
      createKarmaConfigs(options),

      (tree: Tree, context: SchematicContext) => {
        // Schedule Cypress installation
        const installCypressTask = context.addTask(new NodePackageInstallTask({
          packageName: '@cypress/schematic',
          workingDirectory: options.directory || '.',
        }));

        // Schedule Cypress setup
        context.addTask(new RunSchematicTask('@cypress/schematic', 'cypress', {
          project: options.name,
        }), [installCypressTask]);

        return tree;
      },

      // Dockerfile creation if user consents
      addDockerfilesIfRequested(
        options.docker,
        options.directory || '.',
        './templates'
      ),

      // Post-processing
      (tree: Tree) => {
        // Remove empty constructors
        removeEmptyConstructors(tree, options);

        return tree;
      },
    ]);
  }
}

export function updateAngularJson(tree: Tree, workspacePath: string, options: NgNewSchema): void {
  const workspaceContent = tree.read(workspacePath);

  if (!workspaceContent) {
    return;
  }

  let workspace: AngularJson;

  try {
    workspace = JSON.parse(workspaceContent.toString()) as AngularJson;

  } catch (_error) {
    // Invalid JSON, skip processing
    return;
  }

  // Disable CLI analytics
  workspace.cli = {
    ...workspace.cli,
    analytics: false,
    packageManager: 'npm',
    schematicCollections: [
      '@schematics/angular',
      '@angular-eslint/schematics',
      '@cypress/schematic'
    ]
  };

  // Update project configuration
  if (workspace.projects && workspace.projects[options.name]) {
    const project = workspace.projects[options.name] as ProjectConfig;

    if (project.architect) {
      const architect = project.architect as ArchitectConfig;

      // Update build configuration for production
      if (architect['build'] && architect['build']) {
        const buildTarget = architect['build'] as JsonObject;

        if (buildTarget['configurations']) {
          const buildConfigs = buildTarget['configurations'] as JsonObject;

          if (buildConfigs['production']) {
            const prodConfig = buildConfigs['production'] as JsonObject;
            prodConfig['optimization'] = {
              ...prodConfig['optimization'] as JsonObject,
              styles: {
                inlineCritical: false
              }
            };
          }
        }
      }

      // Add e2e-ci configuration (will be added after Cypress setup)
      architect['e2e-ci'] = {
        builder: '@cypress/schematic:cypress',
        options: {
          devServerTarget: `${options.name}:serve`,
          watch: false,
          headless: true,
          configFile: 'cypress.config.ts'
        },
        configurations: {
          production: {
            devServerTarget: `${options.name}:serve:production`
          }
        }
      };
    }
  }

  tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
}

export function updateTsConfig(tree: Tree, options: NgNewSchema): void {
  const tsconfigPath = options.directory ? `${options.directory}/tsconfig.json` : 'tsconfig.json';

  if (!tree.exists(tsconfigPath)) {
    return;
  }

  const tsconfigContent = tree.read(tsconfigPath);

  if (!tsconfigContent) {
    return;
  }

  let tsconfig: JsonObject;
  try {
    tsconfig = JSON.parse(tsconfigContent.toString()) as JsonObject;
  } catch (_error) {
    // Invalid JSON, skip processing
    return;
  }

  // Update Angular compiler options
  tsconfig['angularCompilerOptions'] = {
    ...tsconfig['angularCompilerOptions'] as JsonObject,
    enableI18nLegacyMessageIdFormat: false,
    fullTemplateTypeCheck: true,
    strictInjectionParameters: true,
    strictInputAccessModifiers: true,
    strictTemplates: true,
    strictStandalone: true
  };

  tree.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

export function createKarmaConfigs(options: NgNewSchema): Rule {
  const targetPath = options.directory || '.';

  return mergeWith(
    apply(url('./templates'), [
      filter((path) => !!path.match(/karma\.conf.*\.js\.template$/)),
      template({
        name: options.name,
      }),
      move(targetPath),
    ])
  );
}

export function removeEmptyConstructors(tree: Tree, options: NgNewSchema): void {
  const basePath = options.directory || '.';
  const srcPath = `${basePath}/src`;

  // Remove empty constructors from generated files
  tree.getDir(srcPath).visit((filePath) => {
    if (filePath.endsWith('.ts') && !filePath.includes('.spec.ts')) {
      const content = tree.read(filePath);
      if (content) {
        const updatedContent = content
          .toString()
          .replace(/\s*constructor\(\)\s*{\s*}\s*/g, '')
          .replace(/\n\n\n+/g, '\n\n'); // Clean up extra newlines

        if (content.toString() !== updatedContent) {
          tree.overwrite(filePath, updatedContent);
        }
      }
    }
  });
}
