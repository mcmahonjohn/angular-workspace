# Angular Schematics Implementation Guide

## Background Information

This guide provides comprehensive step-by-step instructions for implementing Angular Schematics in your Angular library project. Angular Schematics are powerful tools for code generation, project setup, and automated migrations that help maintain consistency across Angular projects and provide smooth upgrade paths for breaking changes.

## Context

The implementation demonstrated here includes:
- **Collection Schema**: Central registry of all available schematics (`collection.json`)
- **ng-new Schematic**: Complex workspace creation with custom configurations
- **Update Migration Schematics**: Version-specific migration tools (2.0.0 through 6.0.0)
- **Comprehensive Testing**: Both unit tests and integration tests using Jasmine
- **Build System**: Automated TypeScript compilation and file copying

Angular Schematics use the Angular DevKit to manipulate file trees, run external commands, and orchestrate complex transformations. This implementation follows Angular's best practices for schematic development and includes proper error handling, testing, and documentation.

## Prerequisites

- Angular CLI (latest version)
- Node.js 18+
- TypeScript knowledge
- Understanding of Angular project structure
- Familiarity with JSON Schema
- Basic shell scripting knowledge
- Git version control

## Variable Placeholders

Throughout this guide, you'll see placeholder variables that should be replaced with your actual values:

- `${LIBRARY_NAME}` - Replace with your actual library name (e.g., `my-awesome-lib`)
- `${NEW_LIBRARY_NAME}` - Replace with the new library name for migration scenarios (e.g., `awesome-lib-v2`)

These placeholders will be identified and replaced after completing the "Identifying Target Projects" section below.

## Identifying Target Projects

### Determining if a Project Needs Schematics

Before implementing schematics, identify which project in your Angular workspace should contain them. Once identified, you'll use that library name to replace the `${LIBRARY_NAME}` placeholder throughout this guide:

1. **Check for Angular Library Structure**:
   ```bash
   # Look for ng-package.json - indicates a publishable Angular library
   find . -name "ng-package.json" -type f
   ```

2. **Verify Project Type in angular.json**:
   ```bash
   # Projects with "projectType": "library" are candidates
   cat angular.json | grep -A 5 -B 5 "projectType.*library"
   ```

3. **Check for Existing Schematics**:
   ```bash
   # Look for existing schematics directories
   find . -path "*/schematics/collection.json" -type f
   ```

**💡 AI Agent Guidance**: If implementing via AI agent, include this question in your prompt:
> "Which project in this Angular workspace should contain the schematics? Look for projects with `ng-package.json` files under the `projects/` directory, as these are typically publishable libraries that benefit from schematics. Once identified, replace all instances of `${LIBRARY_NAME}` in this guide with the actual library name."

### Project Structure Validation

Your target library project should have this structure:
```
projects/
└── ${LIBRARY_NAME}/
    ├── ng-package.json          # ✓ Required - indicates publishable library
    ├── package.json             # ✓ Required - library-specific dependencies
    ├── src/
    │   ├── lib/                 # ✓ Required - library source code
    │   └── public-api.ts        # ✓ Required - public API exports
    └── schematics/              # ← This is what we'll create
```


## Listing Schematics from a Local Collection

To list all schematics from a local collection, use the following command (note the `./` to flag the collection name as a local path):

```bash
npx @angular-devkit/schematics-cli ./projects/${LIBRARY_NAME}/dist/${LIBRARY_NAME}/schematics/collection.json: --list-schematics
```

Or, to run a schematic from your local collection:

```bash
npx @angular-devkit/schematics-cli ./projects/${LIBRARY_NAME}/dist/${LIBRARY_NAME}/schematics/collection.json:nest-ng-new --name=my-nest-app
```

# Step-by-Step Implementation Guide

## Step 1: Environment Setup and Project Structure

### 1.1 Navigate to Your Library Project
```bash
cd projects/${LIBRARY_NAME}
```

### 1.2 Create Schematics Directory Structure
```bash
mkdir -p schematics/{ng-new,update-2-0-0,update-3-0-0,update-4-0-0,update-5-0-0,update-6-0-0}
mkdir -p schematics/ng-new/templates
```

### 1.3 Install Schematic Dependencies
Install the required schematic dependencies using npm. Adjust the version numbers to match your Angular version (replace `17.0.0` with your project's Angular major version if different):

```bash
npm install --save-dev \
  @angular-devkit/schematics@^17.0.0 \
  @angular-devkit/schematics-cli@^17.0.0 \
  @schematics/angular@^17.0.0 \
  @types/jasmine@^5.0.0 \
  jasmine@^5.0.0 \
  nyc@^15.1.0
```

> **💡 Tip:** Check your Angular version with `ng version` and update the above commands accordingly to ensure compatibility.

### 1.4 Create TypeScript Configuration

Create a file named `tsconfig.schematics.json` inside your library's schematics directory (`projects/${LIBRARY_NAME}/schematics/tsconfig.schematics.json`). This configuration should:

- Extend your root `tsconfig.json` (typically using a relative path such as `../../tsconfig.json`).
- Set the output directory (`outDir`) to a dedicated schematics build folder (e.g., `dist/schematics`).
- Specify the root directory (`rootDir`) as the schematics directory itself.
- Enable declaration file generation and use CommonJS as the module format.
- Target a modern ECMAScript version (such as ES2018 or later).
- Use Node module resolution and enable interoperability with ES modules.
- Include type definitions for Node.js and Jasmine.
- Include all TypeScript files in the schematics directory and exclude build output and `node_modules`.

This configuration ensures that your schematics code is compiled separately from your main library and that all relevant source and test files are included in the build process. Adjust the `extends` path and other options as needed to match your workspace structure.

## Step 2: Create Collection Schema

### 2.1 Create Collection Definition
Create `schematics/collection.json`:
```json
{
  "$schema": "http://json.schemastore.org/schematics",
  "schematics": {
    "ng-new": {
      "description": "Create a new Angular workspace with ${LIBRARY_NAME} optimizations.",
      "factory": "./ng-new/index#default",
      "schema": "./ng-new/schema.json"
    },
    "update-2-0-0": {
      "version": "2.0.0",
      "description": "Update imports from '${LIBRARY_NAME}' to '${NEW_LIBRARY_NAME}' in TS files.",
      "factory": "./update-2-0-0/index#updateToV2",
      "schema": "./update-2-0-0/schema.json"
    },
    "update-3-0-0": {
      "version": "3.0.0",
      "description": "Migration for ${LIBRARY_NAME} v3.0.0 breaking changes.",
      "factory": "./update-3-0-0/index#updateToV3",
      "schema": "./update-3-0-0/schema.json"
    },
    "update-4-0-0": {
      "version": "4.0.0",
      "description": "Migration for ${LIBRARY_NAME} v4.0.0 breaking changes.",
      "factory": "./update-4-0-0/index#updateToV4",
      "schema": "./update-4-0-0/schema.json"
    },
    "update-5-0-0": {
      "version": "5.0.0",
      "description": "Migration for ${LIBRARY_NAME} v5.0.0 breaking changes.",
      "factory": "./update-5-0-0/index#updateToV5",
      "schema": "./update-5-0-0/schema.json"
    },
    "update-6-0-0": {
      "version": "6.0.0",
      "description": "Migration for ${LIBRARY_NAME} v6.0.0 breaking changes.",
      "factory": "./update-6-0-0/index#updateToV6",
      "schema": "./update-6-0-0/schema.json"
    }
  }
}
```

## Step 3: Implement ng-new Schematic

### 3.1 Create Schema Definition
Create `schematics/ng-new/schema.json`:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "Schematics${LIBRARY_NAME//-/( )=>{return $&.toUpperCase().replace(/-(\w)/g,(_,c)=>c.toUpperCase()).replace(/^(\w)/,(_,c)=>c.toUpperCase())}}NgNew",
  "title": "${LIBRARY_NAME} Ng New Options Schema",
  "type": "object",
  "description": "Creates a new Angular workspace with ${LIBRARY_NAME} specific configurations.",
  "additionalProperties": false,
  "properties": {
    "name": {
      "description": "The name of the workspace and initial project.",
      "type": "string",
      "$default": {
        "$source": "argv",
        "index": 0
      },
      "x-prompt": "What name would you like to use for the workspace?"
    },
    "directory": {
      "description": "The directory name to create the workspace in.",
      "type": "string"
    },
    "version": {
      "description": "The version of the Angular CLI to use.",
      "type": "string",
      "visible": false
    },
    "minimal": {
      "description": "Create a workspace without any testing frameworks.",
      "type": "boolean",
      "default": false
    },
    "routing": {
      "description": "Generate a routing module for the initial project.",
      "type": "boolean",
      "default": true,
      "x-prompt": "Would you like to add Angular routing?"
    }
  },
  "required": ["name"]
}
```

### 3.2 Create TypeScript Interface
Create `schematics/ng-new/schema.ts`:
```typescript
export interface Schema {
  name: string;
  directory?: string;
  version?: string;
  minimal?: boolean;
  routing?: boolean;
}
```

### 3.3 Create Templates Directory and Karma Configuration Templates
Create the templates directory and add Karma configuration files:

```bash
mkdir -p schematics/ng-new/templates
```

Create `schematics/ng-new/templates/karma.conf.js.template`:
```javascript
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution order
        // random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/<%= name %>'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};
```

Create `schematics/ng-new/templates/karma.conf.ci.js.template`:
```javascript
// Karma configuration file for CI/headless testing
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution order
        // random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/<%= name %>'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--headless',
          '--remote-debugging-port=9222'
        ]
      }
    },
    singleRun: true,
    restartOnFileChange: false
  });
};
```

### 3.4 Implement ng-new Schematic
Create `schematics/ng-new/index.ts`:
```typescript
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
  return chain([
    // Create the workspace with Angular's ng-new schematic
    externalSchematic('@schematics/angular', 'ng-new', {
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

      // Update angular.json with custom configurations
      updateAngularJson(tree, workspacePath, options);

      // Update tsconfig.json with custom settings
      updateTsConfig(tree, options);

      return tree;
    },

    // Create karma config files from templates
    createKarmaConfigs(options),

    (tree: Tree, context: SchematicContext) => {
      // Schedule package installation tasks
      const installTask = context.addTask(new NodePackageInstallTask({
        packageName: '@cypress/schematic',
        workingDirectory: options.directory || '.',
      }));

      // Schedule additional schematic execution
      context.addTask(new RunSchematicTask('@cypress/schematic', 'cypress', {
        project: options.name,
      }), [installTask]);

      return tree;
    },

    // Post-processing cleanup
    (tree: Tree) => {
      removeEmptyConstructors(tree, options);
      return tree;
    },
  ]);
}

export function updateAngularJson(tree: Tree, workspacePath: string, options: NgNewSchema): void {
  const buffer = tree.read(workspacePath);
  if (!buffer) {
    throw new Error(`Could not read ${workspacePath}`);
  }

  const workspace = JSON.parse(buffer.toString()) as AngularJson;
  
  // Add custom configurations to angular.json
  if (workspace.projects && typeof workspace.projects === 'object') {
    const project = workspace.projects[options.name] as ProjectConfig;
    if (project && project.architect && typeof project.architect === 'object') {
      const architect = project.architect as Record<string, ArchitectConfig>;
      
      // Customize build configuration
      if (architect.build && typeof architect.build === 'object') {
        const buildConfig = architect.build as ArchitectConfig;
        if (buildConfig.options && typeof buildConfig.options === 'object') {
          const buildOptions = buildConfig.options as Record<string, JsonValue>;
          buildOptions.preserveSymlinks = true;
          buildOptions.optimization = true;
        }
      }
    }
  }

  tree.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
}

export function updateTsConfig(tree: Tree, options: NgNewSchema): void {
  const tsConfigPath = options.directory ? `${options.directory}/tsconfig.json` : 'tsconfig.json';
  const buffer = tree.read(tsConfigPath);
  if (!buffer) {
    return;
  }

  const tsConfig = JSON.parse(buffer.toString());
  
  // Add custom TypeScript configurations
  if (!tsConfig.compilerOptions) {
    tsConfig.compilerOptions = {};
  }
  
  tsConfig.compilerOptions.skipLibCheck = true;
  tsConfig.compilerOptions.allowSyntheticDefaultImports = true;

  tree.overwrite(tsConfigPath, JSON.stringify(tsConfig, null, 2));
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
  const targetPath = options.directory || '.';
  
  tree.visit(filePath => {
    if (filePath.endsWith('.ts') && filePath.includes(targetPath)) {
      const buffer = tree.read(filePath);
      if (!buffer) return;

      const content = buffer.toString();
      const updatedContent = content.replace(
        /constructor\(\s*\)\s*{\s*}/g,
        ''
      );

      if (updatedContent !== content) {
        tree.overwrite(filePath, updatedContent);
      }
    }
  });
}
```

## Step 4: Implement Update Migration Schematics

### 4.1 Create Simple Update Schematic (2.0.0)
Create `schematics/update-2-0-0/schema.json`:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "Schematics${LIBRARY_NAME.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^([a-z])/g, (_, c) => c.toUpperCase())}Update200",
  "title": "Update to 2.0.0",
  "type": "object",
  "description": "Updates imports from '${LIBRARY_NAME}' to '${NEW_LIBRARY_NAME}'."
}
```

Create `schematics/update-2-0-0/index.ts`:
```typescript
import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { updateImports } from './update-imports';

export function updateToV2(): (tree: Tree, context: SchematicContext) => Tree {
  return (tree: Tree, context: SchematicContext) => {
    updateImports(tree, context);
    return tree;
  };
}
```

Create `schematics/update-2-0-0/update-imports.ts`:
```typescript
import { Tree, SchematicContext } from '@angular-devkit/schematics';

function replaceImportPath(source: string): string {
  // Replace '${LIBRARY_NAME}' with '${NEW_LIBRARY_NAME}' in import statements
  return source.replace(/(['"])${LIBRARY_NAME}\1/g, (match, quote) => {
    // Always use single quotes for the replacement
    return `'${NEW_LIBRARY_NAME}'`;
  });
}

export function updateImports(tree: Tree, context: SchematicContext): void {
  tree.visit(filePath => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.scss')) {
      const buffer = tree.read(filePath);

      if (!buffer) {
        return;
      }

      const content = buffer.toString('utf-8');
      const updated = replaceImportPath(content);

      if (updated !== content) {
        tree.overwrite(filePath, updated);
        context.logger.info(`Updated imports in ${filePath}`);
      }
    }
  });
}
```

### 4.2 Create Advanced Update Schematics (3.0.0+)
For versions 3.0.0 through 6.0.0, create similar structures but with more complex transformations:

Create `schematics/update-3-0-0/index.ts`:
```typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updateToV3(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Implement breaking changes for v3.0.0
    context.logger.info('Applying v3.0.0 migrations...');
    
    // Example: Update method signatures
    updateMethodSignatures(tree, context);
    
    // Example: Update configuration files
    updateConfigFiles(tree, context);
    
    return tree;
  };
}

function updateMethodSignatures(tree: Tree, context: SchematicContext): void {
  tree.visit(filePath => {
    if (filePath.endsWith('.ts')) {
      const buffer = tree.read(filePath);
      if (!buffer) return;

      let content = buffer.toString();
      
      // Replace old method signatures with new ones
      const oldPattern = /oldMethodName\(\s*([^)]*)\s*\)/g;
      const newPattern = 'newMethodName($1, additionalParam)';
      
      const updated = content.replace(oldPattern, newPattern);
      
      if (updated !== content) {
        tree.overwrite(filePath, updated);
        context.logger.info(`Updated method signatures in ${filePath}`);
      }
    }
  });
}

function updateConfigFiles(tree: Tree, context: SchematicContext): void {
  // Update angular.json, package.json, etc.
  const angularJsonPath = 'angular.json';
  if (tree.exists(angularJsonPath)) {
    const buffer = tree.read(angularJsonPath);
    if (buffer) {
      const config = JSON.parse(buffer.toString());
      
      // Apply configuration changes for v3.0.0
      // ... configuration updates
      
      tree.overwrite(angularJsonPath, JSON.stringify(config, null, 2));
      context.logger.info('Updated angular.json for v3.0.0');
    }
  }
}
```

Repeat similar patterns for update-4-0-0, update-5-0-0, and update-6-0-0 directories.

## Step 5: Testing Implementation

### 5.1 Create Unit Tests for ng-new Schematic
Create `schematics/ng-new/index.spec.ts`:
```typescript
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { EmptyTree } from '@angular-devkit/schematics';
import * as path from 'path';
import { Schema as NgNewSchema } from './schema';
import { 
  updateAngularJson, 
  updateTsConfig, 
  createKarmaConfigs, 
  removeEmptyConstructors 
} from './index';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-new', () => {
  let runner: SchematicTestRunner;
  let mockTree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    mockTree = new UnitTestTree(new EmptyTree());
  });

  it('should have ng-new schematic defined in collection', () => {
    const collection = runner.engine.createCollection(collectionPath);
    const schematic = runner.engine.createSchematic('ng-new', collection);
    
    expect(schematic).toBeTruthy();
    expect(schematic.description.name).toBe('ng-new');
  });

  it('should validate schema interface properties', () => {
    const validOptions: NgNewSchema = {
      name: 'test-workspace',
      routing: true,
      minimal: false,
      directory: 'optional-dir'
    };

    expect(typeof validOptions.name).toBe('string');
    expect(typeof validOptions.routing).toBe('boolean');
    expect(typeof validOptions.minimal).toBe('boolean');
  });

  describe('updateAngularJson', () => {
    it('should update angular.json with custom configurations', () => {
      const mockAngularJson = {
        version: 1,
        projects: {
          'test-app': {
            architect: {
              build: {
                options: {}
              }
            }
          }
        }
      };

      mockTree.create('angular.json', JSON.stringify(mockAngularJson));
      
      const options: NgNewSchema = { name: 'test-app' };
      updateAngularJson(mockTree, 'angular.json', options);

      const updatedContent = mockTree.readContent('angular.json');
      const updatedConfig = JSON.parse(updatedContent);
      
      expect(updatedConfig.projects['test-app'].architect.build.options.preserveSymlinks).toBe(true);
      expect(updatedConfig.projects['test-app'].architect.build.options.optimization).toBe(true);
    });
  });

  describe('updateTsConfig', () => {
    it('should update tsconfig.json with custom settings', () => {
      const mockTsConfig = {
        compilerOptions: {
          target: 'es2020'
        }
      };

      mockTree.create('tsconfig.json', JSON.stringify(mockTsConfig));
      
      const options: NgNewSchema = { name: 'test-app' };
      updateTsConfig(mockTree, options);

      const updatedContent = mockTree.readContent('tsconfig.json');
      const updatedConfig = JSON.parse(updatedContent);
      
      expect(updatedConfig.compilerOptions.skipLibCheck).toBe(true);
      expect(updatedConfig.compilerOptions.allowSyntheticDefaultImports).toBe(true);
    });
  });

  describe('createKarmaConfigs', () => {
    it('should create karma.conf.js file', () => {
      const options: NgNewSchema = { name: 'test-app' };
      const rule = createKarmaConfigs(options);
      
      const resultTree = rule(mockTree, {} as any);
      
      expect(resultTree.exists('karma.conf.js')).toBe(true);
      
      const karmaContent = resultTree.readContent('karma.conf.js');
      expect(karmaContent).toContain('module.exports = function (config)');
      expect(karmaContent).toContain('frameworks: [\'jasmine\', \'@angular-devkit/build-angular\']');
    });
  });

  describe('removeEmptyConstructors', () => {
    it('should remove empty constructors from TypeScript files', () => {
      const fileContent = `
export class TestClass {
  constructor() {
  }
  
  method() {
    return 'test';
  }
}`;

      mockTree.create('test.ts', fileContent);
      
      const options: NgNewSchema = { name: 'test-app' };
      removeEmptyConstructors(mockTree, options);

      const updatedContent = mockTree.readContent('test.ts');
      expect(updatedContent).not.toContain('constructor() {');
      expect(updatedContent).toContain('method()');
    });
  });
});
```

### 5.2 Create Unit Tests for Update Schematics
Create `schematics/update-2-0-0/update-imports.spec.ts`:
```typescript
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { EmptyTree } from '@angular-devkit/schematics';
import * as path from 'path';
import { updateImports } from './update-imports';

const collectionPath = path.join(__dirname, '../collection.json');

describe('update-2-0-0', () => {
  let runner: SchematicTestRunner;
  let mockTree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    mockTree = new UnitTestTree(new EmptyTree());
  });

  describe('updateImports', () => {
    it('should update import statements from ${LIBRARY_NAME} to ${NEW_LIBRARY_NAME}', () => {
      const sourceContent = `
import { SomeService } from '${LIBRARY_NAME}';
import { AnotherService } from "${LIBRARY_NAME}";
import { ThirdService } from 'other-lib';
`;

      mockTree.create('test.ts', sourceContent);
      
      const mockContext = {
        logger: {
          info: jasmine.createSpy('info')
        }
      };

      updateImports(mockTree, mockContext as any);

      const updatedContent = mockTree.readContent('test.ts');
      expect(updatedContent).toContain(`import { SomeService } from '${NEW_LIBRARY_NAME}';`);
      expect(updatedContent).toContain(`import { AnotherService } from "${NEW_LIBRARY_NAME}";`);
      expect(updatedContent).toContain(`import { ThirdService } from 'other-lib';`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in test.ts');
    });

    it('should not modify files without ${LIBRARY_NAME} imports', () => {
      const sourceContent = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
`;

      mockTree.create('unchanged.ts', sourceContent);
      
      const mockContext = {
        logger: {
          info: jasmine.createSpy('info')
        }
      };

      updateImports(mockTree, mockContext as any);

      const updatedContent = mockTree.readContent('unchanged.ts');
      expect(updatedContent).toBe(sourceContent);
      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it('should only process TypeScript files', () => {
      mockTree.create('test.js', `import { Service } from '${LIBRARY_NAME}';`);
      mockTree.create('test.html', `<div>${LIBRARY_NAME} content</div>`);
      mockTree.create('test.ts', `import { Service } from '${LIBRARY_NAME}';`);
      
      const mockContext = {
        logger: {
          info: jasmine.createSpy('info')
        }
      };

      updateImports(mockTree, mockContext as any);

      expect(mockTree.readContent('test.js')).toContain('${LIBRARY_NAME}');
      expect(mockTree.readContent('test.html')).toContain('${LIBRARY_NAME}');
      expect(mockTree.readContent('test.ts')).toContain('${NEW_LIBRARY_NAME}');
      expect(mockContext.logger.info).toHaveBeenCalledTimes(1);
    });
  });
});
```

### 5.3 Create Integration Tests
Create `schematics/ng-new/ng-new-schematic.spec.js`:
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('ng-new Schematic Integration Tests', () => {
  const testWorkspaceName = 'test-integration-workspace';
  const testDir = path.join(__dirname, '../../test-output');

  beforeAll(() => {
    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Change to test directory
    process.chdir(testDir);
  });

  afterAll(() => {
    // Cleanup test workspace
    if (fs.existsSync(testWorkspaceName)) {
      execSync(`rm -rf ${testWorkspaceName}`, { stdio: 'inherit' });
    }
  });

  it('should create a new workspace with ng-new schematic', () => {
    // Run the schematic
    const schematicPath = path.join(__dirname, '../collection.json');
    const command = `npx @angular-devkit/schematics-cli ${schematicPath}:ng-new ${testWorkspaceName} --routing=true --minimal=false`;
    
    execSync(command, { stdio: 'inherit' });

    // Verify workspace was created
    expect(fs.existsSync(testWorkspaceName)).toBe(true);
    expect(fs.existsSync(path.join(testWorkspaceName, 'angular.json'))).toBe(true);
    expect(fs.existsSync(path.join(testWorkspaceName, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(testWorkspaceName, 'karma.conf.js'))).toBe(true);
  });

  it('should have correct angular.json configuration', () => {
    const angularJsonPath = path.join(testWorkspaceName, 'angular.json');
    const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));

    expect(angularJson.projects[testWorkspaceName]).toBeDefined();
    
    const buildOptions = angularJson.projects[testWorkspaceName].architect.build.options;
    expect(buildOptions.preserveSymlinks).toBe(true);
    expect(buildOptions.optimization).toBe(true);
  });

  it('should have correct tsconfig.json configuration', () => {
    const tsConfigPath = path.join(testWorkspaceName, 'tsconfig.json');
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

    expect(tsConfig.compilerOptions.skipLibCheck).toBe(true);
    expect(tsConfig.compilerOptions.allowSyntheticDefaultImports).toBe(true);
  });
});
```

## Step 6: Build System Implementation

### 6.1 Create Build Script
Create `schematics/build.sh`:
```bash
#!/bin/bash

# Build schematics script for ${LIBRARY_NAME}
# This script compiles TypeScript and copies necessary files

set -e  # Exit on any error

SCHEMATICS_DIR="projects/${LIBRARY_NAME}/schematics"
DIST_DIR="$SCHEMATICS_DIR/dist/schematics"

echo "Building schematics..."

# Clean previous build
if [ -d "$DIST_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$DIST_DIR"
fi

# Compile TypeScript
echo "Compiling TypeScript..."
npx tsc -p "$SCHEMATICS_DIR/tsconfig.schematics.json"

# Copy collection.json
echo "Copying collection.json..."
cp "$SCHEMATICS_DIR/collection.json" "$DIST_DIR/collection.json"

# Create necessary directories
echo "Creating directories..."
mkdir -p "$DIST_DIR/ng-new/templates" \
         "$DIST_DIR/update-2-0-0" \
         "$DIST_DIR/update-3-0-0" \
         "$DIST_DIR/update-4-0-0" \
         "$DIST_DIR/update-5-0-0" \
         "$DIST_DIR/update-6-0-0"

# Copy schema files and templates
echo "Copying schema files and templates..."

# ng-new schematic
cp "$SCHEMATICS_DIR/ng-new/schema.json" "$DIST_DIR/ng-new/schema.json"
if [ -d "$SCHEMATICS_DIR/ng-new/templates" ] && [ "$(ls -A $SCHEMATICS_DIR/ng-new/templates)" ]; then
    cp -r "$SCHEMATICS_DIR/ng-new/templates/"* "$DIST_DIR/ng-new/templates/"
fi

# Update schematics
for version in 2-0-0 3-0-0 4-0-0 5-0-0 6-0-0; do
    if [ -f "$SCHEMATICS_DIR/update-$version/schema.json" ]; then
        cp "$SCHEMATICS_DIR/update-$version/schema.json" "$DIST_DIR/update-$version/schema.json"
    fi
done

echo "Schematics build completed successfully!"
```

### 6.2 Create Test Script
Create `schematics/test.sh`:
```bash
#!/bin/bash

# Test schematics script for ${LIBRARY_NAME}
# This script runs all schematic tests with coverage

set -e  # Exit on any error

SCHEMATICS_DIR="projects/${LIBRARY_NAME}/schematics"
DIST_DIR="$SCHEMATICS_DIR/dist/schematics"

echo "Running schematics tests..."

# Check if schematics are built
if [ ! -d "$DIST_DIR" ]; then
    echo "Error: Schematics not built. Run build script first."
    echo "Running build script..."
    bash "$SCHEMATICS_DIR/build.sh"
fi

# Run unit tests with nyc coverage
echo "Running unit tests with coverage..."
npx nyc --reporter=lcov --reporter=text --exclude='**/*.spec.js' \
    npx jasmine "$DIST_DIR/**/*.spec.js"

# Run integration tests
echo "Running integration tests..."
if [ -f "$DIST_DIR/ng-new/ng-new-schematic.spec.js" ]; then
    node "$DIST_DIR/ng-new/ng-new-schematic.spec.js"
fi

echo "Schematics tests completed successfully!"

# Generate coverage report
if [ -d "coverage" ]; then
    echo "Coverage report available in ./coverage/lcov-report/index.html"
fi
```

### 6.3 Make Scripts Executable
```bash
chmod +x schematics/build.sh
chmod +x schematics/test.sh
```

## Step 7: Package.json Integration

### 7.1 Add Scripts to Library Package.json
Update `projects/${LIBRARY_NAME}/package.json`:
```json
{
  "name": "${LIBRARY_NAME}",
  "version": "1.0.0",
  "scripts": {
    "build:schematics": "bash schematics/build.sh",
    "test:schematics": "bash schematics/test.sh",
    "test:schematics:watch": "npm run build:schematics && npx jasmine schematics/dist/schematics/**/*.spec.js --watch"
  },
  "schematics": "./schematics/collection.json",
  "ng-update": {
    "migrations": "./schematics/collection.json"
  }
}
```

### 7.2 Add Scripts to Root Package.json
Update root `package.json`:
```json
{
  "scripts": {
    "build:lib:schematics": "npm run build:schematics --prefix projects/${LIBRARY_NAME}",
    "test:lib:schematics": "npm run test:schematics --prefix projects/${LIBRARY_NAME}"
  }
}
```

## Step 8: Documentation and Best Practices

This guide covers best practices for Angular migration schematics used in the `ng update` process, including:
- Version bumping (handled by Angular CLI, not by your schematic)
- Idempotency (safe to run multiple times)
- Logging (use `context.logger.info/warn/error` for user visibility)
- Migration of APIs/config (update code, config, dependencies)
- Testing (unit and integration tests)
- Documentation (manual steps, migration guides)
- Error handling (log warnings, handle missing files)
- Use of Angular Devkit utilities

### Best Practices for ng update Schematics

1. **Version Bumping**: The CLI updates the package version in `package.json` automatically. Your schematic should not manually change the version.
2. **Idempotency**: Schematics should be safe to run multiple times.
3. **Logging**: Use `context.logger` to inform users of changes.
4. **Migration of APIs/Config**: Update code/config as needed for the new version.
5. **Testing**: Provide unit and integration tests for migration logic.
6. **Documentation**: Document manual steps users may need to take after migration.
7. **Error Handling**: Handle missing files and unexpected formats gracefully.
8. **Use Angular Devkit Utilities**: Use helpers from `@angular-devkit/schematics` and `@schematics/angular/utility`.

### References & Further Reading

- [Angular CLI: Schematics for Libraries](https://angular.dev/tools/cli/schematics-for-libraries#providing-generation-support)
- [Angular CLI: Migration Schematics](https://angular.dev/tools/cli/schematics-for-libraries#migration-schematics)
- [Angular CLI Source: Migration Schematics](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/migrations)
- [Angular Material Migrations](https://github.com/angular/components/tree/main/src/material/schematics/ng-update)
- [TypeScript AST Manipulation (ts-morph)](https://ts-morph.com/)
- [Angular Schematics Official Docs](https://angular.dev/tools/cli/schematics)

---

### 8.1 Create Schematic Documentation
Create `schematics/README.md`:

```markdown
# ${LIBRARY_NAME} Schematics

This directory contains Angular Schematics for `${LIBRARY_NAME}` library, providing automated code generation and migration capabilities.

## Structure


schematics/
├── build.sh              # Build script for schematics
├── test.sh               # Test script for schematics  
├── collection.json       # Schematic collection definition
├── tsconfig.schematics.json  # TypeScript config for schematics
├── dist/                 # Built schematics (generated)
├── ng-new/               # ng-new schematic
│   ├── index.ts
│   ├── schema.json
│   ├── schema.ts
│   ├── templates/        # Template files
│   │   ├── karma.conf.js.template
│   │   └── karma.conf.ci.js.template
│   ├── ng-new-schematic.md
│   └── ng-new-schematic.spec.js
└── update-X-X-X/         # Migration schematics for each version
    ├── index.ts
    ├── schema.json
    └── *.spec.ts

## Migration Schematics

The following migration schematics are available to handle breaking changes between major versions:

### Available Migrations

| Version        | Status  | Description |
|----------------|---------|-------------|
| `update-2-0-0` | ✅ **Implemented**    | Updates imports from '${LIBRARY_NAME}' to '${NEW_LIBRARY_NAME}' in TypeScript files |
| `update-3-0-0` | 📋 **Template Ready** | Migration for v3.0.0 breaking changes* |
| `update-4-0-0` | 📋 **Template Ready** | Migration for v4.0.0 breaking changes* |
| `update-5-0-0` | 📋 **Template Ready** | Migration for v5.0.0 breaking changes* |
| `update-6-0-0` | 📋 **Template Ready** | Migration for v6.0.0 breaking changes* |

**Migration templates are pre-created for versions 3.0.0 through 6.0.0 and ready for implementation when breaking changes are introduced.*

### Usage

Migrations are automatically triggered when updating the library via `ng update`:

# Update to specific version (triggers appropriate migration)
`ng update ${LIBRARY_NAME}@3.0.0`
`ng update ${LIBRARY_NAME}@4.0.0`
`ng update ${LIBRARY_NAME}@5.0.0`
`ng update ${LIBRARY_NAME}@6.0.0`

# Alternative: Update to latest in major version range
`ng update ${LIBRARY_NAME}@3`    # Updates to latest 3.x version (e.g., 3.2.1)
`ng update ${LIBRARY_NAME}@4`    # Updates to latest 4.x version (e.g., 4.1.0)

# Dry run to preview changes
`ng update ${LIBRARY_NAME}@3.0.0 --dry-run`
`ng update ${LIBRARY_NAME}@3 --dry-run`

### Template Structure

Each migration schematic includes:

- **`index.ts`** - Main migration logic with TODO placeholders
- **`schema.json`** - Configuration schema with standard options:
  - `skipConfirmation`: Skip migration confirmation prompts
  - `dryRun`: Show changes without applying them
- **`index.spec.ts`** - Test suite template with example test cases

### Implementation Guidelines

When implementing migration logic for a specific version:

1. **Update Import Statements**: Use AST transformations to update import paths
2. **Migrate Configurations**: Update configuration file formats and structures
3. **Update API Usage**: Replace deprecated API calls with new equivalents
4. **Handle Type Changes**: Update TypeScript interfaces and type definitions
5. **Theme/Style Updates**: Migrate styling configurations and theme structures
6. **Dependency Updates**: Handle peer dependency and build configuration changes

### Development Workflow

1. **Identify Breaking Changes**: Document what needs to be migrated
2. **Implement Migration Logic**: Replace TODO comments with actual transformation code
3. **Add Helper Functions**: Create utility functions for common transformations
4. **Write Comprehensive Tests**: Ensure migration handles edge cases gracefully
5. **Test Migration**: Validate against real projects before release
6. **Document Changes**: Update migration logs and user-facing documentation

### Helpful Resources

- [Migration Guide][migration-guide] - Official Angular migration schematic guide
- [AST Transformations][ts-morph] - TypeScript AST manipulation library
- [Angular Migrations][angular-migrations] - Reference implementations from Angular CLI
- [Material Migrations][material-migrations] - Production examples from Angular Material

## Available Scripts

### Building Schematics

`npm run build:schematics`
# or directly:
`./projects/${LIBRARY_NAME}/schematics/build.sh`

This script:
- Compiles TypeScript files
- Copies collection.json and schema.json files
- Creates necessary directory structure
- Copies template files to the dist directory

### Testing Schematics

#### Testing Philosophy

We use Jasmine (not Jest) for testing schematics because:
- Better integration with Angular DevKit testing utilities
- Consistent with Angular CLI's testing approach
- More mature schematic testing patterns
- Better error reporting for file tree manipulations

#### Unit Testing Schematics

`npm run test:schematics`
# or directly:
`./projects/${LIBRARY_NAME}/schematics/test.sh`

This script:
- Runs all schematic unit tests with coverage
- Uses nyc for coverage reporting
- Excludes spec files from coverage

#### Integration Testing

`npm run test:ng-new`

Runs comprehensive integration tests for the ng-new schematic.

## Template System

Template files use Angular Schematics conventions:
- Files end with `.template` suffix
- Use `<%= variable %>` syntax for template variables
- Processed by Angular Schematics template engine during execution

## Adding New Schematics

When adding new schematics:

1. Create a new directory under `schematics/`
2. Add the schematic to `collection.json`
3. Update `build.sh` to copy any schema files or templates
4. Template files should use the `.template` suffix (Angular convention)
5. Run `npm run build:schematics` to build
6. Run `npm run test:schematics` to test

## Maintenance

The build and test scripts are designed to scale as new schematics are added:

- **build.sh**: Automatically handles new update schematics following the `update-X-X-X` pattern
- **test.sh**: Runs all tests in the dist directory
- Template copying is handled generically for any schematic with a `templates/` directory

---

[migration-guide]: https://angular.dev/tools/cli/schematics-for-libraries#providing-generation-support
[ts-morph]: https://ts-morph.com/
[angular-migrations]: https://github.com/angular/angular-cli/tree/main/packages/schematics/angular/migrations
[material-migrations]: https://github.com/angular/components/tree/main/src/material/schematics/ng-update
```

### 8.2 Multi-Project Workspace Best Practices

**Directory Organization**:
```
projects/
├── ${LIBRARY_NAME}/
│   ├── schematics/           # ✓ Keep schematics with the library
│   │   ├── build.sh         # ✓ Library-specific build script
│   │   ├── test.sh          # ✓ Library-specific test script
│   │   └── collection.json  # ✓ Schematics definition
│   └── package.json         # ✓ Include schematics reference
├── another-lib/
│   └── schematics/          # ✓ Each library has own schematics
└── shared-lib/
    └── no-schematics/       # ✓ Not all libraries need schematics
```

**Best Practices**:
1. **One Schematics Collection Per Library**: Each publishable library should have its own schematics
2. **Consistent Naming**: Use `collection.json` and standard directory structure
3. **Build Scripts**: Keep build and test scripts with each schematics collection
4. **Version Alignment**: Migration schematics should match library version numbers
5. **Testing Strategy**: Both unit and integration tests for complex schematics

### 8.3 🔧 ESLint Configuration for Schematics

When working with schematics in your workspace, you need to configure ESLint to properly handle the generated build files and maintain code quality.

#### Update ESLint Configuration

Add the schematics dist directory to your ESLint ignore patterns. In your `eslint.ignore.js` or `eslint.config.*` file:

```javascript
export default [
  // ... other configurations
  {
    ignores: [
      '.angular/**',
      '.github/**',
      '.git/**',
      '.vscode/**',
      'dist/**',
      'node_modules/**',
      'projects/${LIBRARY_NAME}/schematics/dist/**', // ← Add this line
      'angular.json',
      'package.json',
      'package-lock.json',
      'tsconfig.json'
    ],
  },
];
```

#### Package.json Scripts

Add targeted linting scripts for your schematics development:

```json
{
  "scripts": {
    "lint:lib": "eslint projects/${LIBRARY_NAME}",
    "lint:lib:fix": "eslint projects/${LIBRARY_NAME} --fix"
  }
}
```

#### Why Ignore schematics/dist?

- **Generated Code**: The `dist/schematics` directory contains compiled JavaScript from TypeScript sources
- **Build Artifacts**: These files are automatically generated and shouldn't be linted
- **Performance**: Excluding build directories improves ESLint performance
- **Source of Truth**: Lint the TypeScript source files, not the compiled output

#### Advanced ESLint Configuration for Schematics

Schematics require special ESLint handling due to their unique patterns and testing requirements. Add these configurations to your `eslint.config.mjs`:

```javascript
import globals from 'globals';

export default [
  // ... other configurations
  
  // Schematics test files need Node.js globals and dynamic imports
  {
    files: ['projects/*/schematics/**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        jasmine: 'readonly',
        spyOn: 'readonly',
        fail: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  },
  
  // Schematic implementation files often have required but unused parameters
  {
    files: ['projects/*/schematics/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_|^context$|^error$',
        varsIgnorePattern: '^_'
      }],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_|^context$|^error$',
        varsIgnorePattern: '^_'
      }]
    }
  },
  
  // Integration test scripts are Node.js files
  {
    files: ['projects/*/schematics/**/*.js'],
    languageOptions: {
      globals: globals.node
    }
  }
];
```

#### ESLint Best Practices for Schematics

1. **Environment-Specific Rules**: Configure different rules for test files vs implementation files
2. **Node.js Globals**: Schematics tests need `require`, `__dirname`, and other Node.js globals
3. **Parameter Patterns**: Use `argsIgnorePattern` for required but unused Angular Schematics API parameters
4. **Lint Source Files**: Always lint the TypeScript source files in `schematics/`
5. **Ignore Build Output**: Exclude `schematics/dist/` and other build artifacts
6. **Separate Scripts**: Use `lint:lib` for library-specific linting
7. **Pre-commit Hooks**: Consider adding ESLint to your pre-commit workflow
8. **IDE Integration**: Configure your IDE to use the workspace ESLint configuration

#### Common ESLint Issues in Schematics and Solutions

**Issue**: `__dirname is not defined`, `require is not defined` in test files
- **Cause**: Test files use Node.js CommonJS patterns for dynamic imports
- **Solution**: Add Node.js globals to schematics test file configuration

**Issue**: `'context' is defined but never used`, `'error' is defined but never used`
- **Cause**: Angular Schematics API requires these parameters but they're often unused
- **Solution**: Use `argsIgnorePattern: '^_|^context$|^error$'` to allow these patterns

**Issue**: Unused variables in test scenarios
- **Cause**: Test setup often creates variables for completeness but doesn't use them
- **Solution**: Use underscore prefix (`_options`) or `varsIgnorePattern: '^_'`

**Issue**: Integration test scripts failing ESLint
- **Cause**: Node.js scripts treated as browser/ES module code
- **Solution**: Add separate configuration for `**/*.js` files with Node.js globals

**Issue**: Dynamic `require()` calls in TypeScript
- **Cause**: Schematics testing requires loading compiled modules dynamically
- **Solution**: Add `require: 'readonly'` to test file globals

#### Advanced Patterns

**Prefix Unused Variables**: For variables that must exist but aren't used:
```typescript
// Instead of: const options: NgNewSchema = { name: 'test' };
const _options: NgNewSchema = { name: 'test' }; // ✓ ESLint ignores
```

**Handle Required API Parameters**: For Angular Schematics API compliance:
```typescript
export default function(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => { // ✓ _context ignored
    // Implementation doesn't need context
    return tree;
  };
}
```

### 8.4 📋 Create ng-new Schematic Documentation

Create `schematics/ng-new/README.md`:

```markdown
# ng-new Schematic

This schematic extends Angular's built-in `ng new` command to create a workspace with additional optimizations and configurations specifically tailored for projects using `${LIBRARY_NAME}`.

## Features

The ng-new schematic creates a new Angular workspace with the following enhancements:

### 🚀 Performance Optimizations
- **Analytics disabled** - CLI analytics are disabled by default for privacy
- **Production build optimization** - Inline critical CSS is disabled for better performance
- **Strict TypeScript configuration** - Enhanced type checking and compiler options

### 🧪 Testing Infrastructure
- **Cypress E2E testing** - Pre-configured Cypress setup with CI-ready configuration
- **Dual Karma configurations** - Separate configs for development and CI environments
- **ChromeHeadless support** - Optimized for Codespaces and CI environments

### 🛠 Development Experience
- **Enhanced tsconfig** - Strict Angular compiler options for better development experience
- **ESLint integration** - Pre-configured with Angular ESLint rules
- **Schematic collections** - Ready to use Angular, ESLint, and Cypress schematics
- **Empty constructor cleanup** - Automatically removes boilerplate empty constructors

## Usage

### Basic Usage

ng generate ${LIBRARY_NAME}:ng-new my-awesome-app`

### With Options

`ng generate ${LIBRARY_NAME}:ng-new my-awesome-app --routing=true --minimal=false`

### In a Subdirectory

`ng generate ${LIBRARY_NAME}:ng-new my-awesome-app --directory=projects/frontend`

## Schema Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | - | The name of the workspace (required) |
| `routing` | `boolean` | `true` | Whether to include Angular Router |
| `minimal` | `boolean` | `false` | Create a minimal workspace |
| `directory` | `string` | - | The directory name to create the workspace in |

## Generated Configuration

### Angular.json Enhancements
- **CLI configuration**: Analytics disabled, npm package manager, schematic collections
- **E2E CI target**: `e2e-ci` architect target for headless Cypress testing
- **Production optimizations**: Inline critical CSS disabled

### TypeScript Configuration
Enhanced `tsconfig.json` with strict Angular compiler options:

{
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "fullTemplateTypeCheck": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "strictStandalone": true
  }
}

### Karma Configurations
Two separate Karma configuration files are created:

1. **karma.conf.js** - Development testing with Chrome browser
2. **karma.conf.ci.js** - CI testing with ChromeHeadless

### Cypress Integration
The schematic automatically:
1. Installs `@cypress/schematic`
2. Configures Cypress for the project
3. Sets up E2E testing targets

## Post-Generation Steps

After running the schematic, you'll have:

1. **A complete Angular workspace** with all standard files
2. **Enhanced configurations** for better development experience
3. **Testing infrastructure** ready for both unit and E2E tests
4. **CI-ready setup** with headless browser configurations

To start developing:

`cd your-workspace-name`
`npm install`
`npm start`

To run tests:

# Unit tests (development)
`ng test --karma-config=karma.conf.js`

# Unit tests (CI)
`ng test --karma-config=karma.conf.ci.js`

# E2E tests
`ng e2e`

# E2E tests (CI)
`ng run your-app:e2e-ci`

## Technical Implementation

The schematic uses Angular's `externalSchematic` to leverage the official `@schematics/angular:ng-new` schematic, then applies additional customizations:

1. **Workspace Creation**: Uses Angular's standard ng-new schematic
2. **Configuration Updates**: Modifies `angular.json` and `tsconfig.json`
3. **File Generation**: Creates Karma configuration files
4. **Task Scheduling**: Schedules Cypress installation and setup
5. **Code Cleanup**: Removes empty constructors from generated files

This approach ensures compatibility with Angular's standard workspace structure while adding project-specific optimizations.

## Compatibility

- **Angular**: 18.x
- **Node.js**: 18.x or higher
- **Package Manager**: npm (configured by default)
- **Browsers**: Chrome/Chromium (for testing)

## Related Schematics

This schematic works alongside other migration schematics in this package:
- `update-2-0-0` through `update-6-0-0` - Version migration schematics
- Standard Angular schematics - Component, service, etc. generators

## Troubleshooting

### Common Issues

**External schematic not found**: Ensure `@schematics/angular` is installed

`npm install @schematics/angular --save-dev`

**Cypress installation fails**: The schematic schedules Cypress installation as a task. If it fails, manually install:

`ng add @cypress/schematic`

**Test configuration issues**: Ensure Chrome/Chromium is available in your environment for testing.
```

### 8.5 📋 Create ng-new Schematic Technical Documentation
Create `schematics/ng-new/ng-new-schematic.md`:
```markdown
# ng-new Schematic Technical Documentation

## Overview

The ng-new schematic for `${LIBRARY_NAME}` extends Angular's built-in workspace creation process with library-specific optimizations and configurations. This document provides technical details for developers working on the schematic implementation.

## Architecture

### Schematic Flow

1. externalSchematic('@schematics/angular:ng-new')
   ↓
2. updateAngularJson() - Add CLI config, e2e-ci target
   ↓
3. updateTsConfig() - Add strict compiler options
   ↓
4. createKarmaConfigs() - Generate dual Karma configs
   ↓
5. Schedule Tasks:
   - NodePackageInstallTask (npm install)
   - RunSchematicTask (@cypress/schematic)
   ↓
6. removeEmptyConstructors() - Clean generated code

### Key Functions

#### `updateAngularJson(tree: Tree, workspacePath: string, options: NgNewSchema)`

**Purpose**: Modifies the generated `angular.json` to add ${LIBRARY_NAME}-specific configurations

**Modifications**:
- Sets CLI analytics to `false`
- Configures npm as the package manager
- Adds schematic collections: `@angular-eslint/schematics`, `@cypress/schematic`
- Adds `e2e-ci` architect target for headless testing
- Disables `inlineCriticalCss` for production builds

**Implementation Notes**:
- Uses safe JSON parsing with error handling
- Preserves existing workspace structure
- Adds configurations without overwriting user customizations

#### `updateTsConfig(tree: Tree, options: NgNewSchema)`

**Purpose**: Enhances TypeScript configuration with strict Angular compiler options

**Added Options**:

"angularCompilerOptions": {
  "enableI18nLegacyMessageIdFormat": false,
  "fullTemplateTypeCheck": true,
  "strictInjectionParameters": true,
  "strictInputAccessModifiers": true,
  "strictTemplates": true,
  "strictStandalone": true
}

**Benefits**:
- Enhanced type safety
- Better development experience
- Early detection of template errors
- Future-proof configuration

#### `createKarmaConfigs(options: NgNewSchema)`

**Purpose**: Generates dual Karma configuration files for different testing environments

**Files Created**:
1. `karma.conf.js` - Development testing with Chrome
2. `karma.conf.ci.js` - CI testing with ChromeHeadless

**Template Variables**:
- Uses Angular Schematics template engine
- Processes `.template` files with variable substitution
- Handles directory-based workspace creation

#### `removeEmptyConstructors(tree: Tree, options: NgNewSchema)`

**Purpose**: Cleans up generated TypeScript files by removing empty constructors

**Processing Logic**:
- Visits all `.ts` files in the workspace
- Uses regex pattern matching to identify empty constructors
- Preserves constructors with parameters or body content
- Maintains proper code formatting

**Pattern Matching**:

`const emptyConstructorPattern = /constructor\(\)\s*\{\s*\}/g;`

## Schema Validation

### Required Properties
- `name`: Workspace name (string, required)

### Optional Properties
- `routing`: Enable Angular Router (boolean, default: true)
- `minimal`: Create minimal workspace (boolean, default: false)
- `directory`: Subdirectory for workspace (string, optional)

### JSON Schema Features
- Draft-07 schema specification
- Comprehensive property descriptions
- Type validation
- Default value specification

## Template System

### Template Files
- `karma.conf.js.template`
- `karma.conf.ci.js.template`

### Variable Substitution
Templates use Angular Schematics template engine with:
- `<%= variable %>` syntax for dynamic content
- Path resolution based on workspace structure
- Conditional logic for different configurations

### Template Processing
- Files are processed during schematic execution
- Variables are resolved from schema options
- Output files lose the `.template` suffix

## Task Scheduling

### NodePackageInstallTask
- Scheduled after file generation
- Installs npm dependencies
- Runs automatically after schematic completion

### RunSchematicTask
- Executes `@cypress/schematic` installation
- Configures E2E testing setup
- Scheduled after package installation

## Error Handling

### File System Operations
- Checks for file existence before reading
- Handles JSON parsing errors gracefully
- Provides meaningful error messages

### Schema Validation
- Validates required properties
- Type checking for all options
- Default value assignment

### External Dependencies
- Graceful handling of missing schematics
- Fallback behavior for optional features
- Clear error messages for missing dependencies

## Testing Strategy

### Unit Tests
- Individual function testing
- Mock file tree operations
- Schema validation testing
- Template processing verification

### Integration Tests
- End-to-end schematic execution
- File system validation
- Configuration verification
- Task execution testing

## Performance Considerations

### File Tree Operations
- Minimal file reads/writes
- Efficient tree traversal
- Lazy loading of file contents

### Memory Usage
- Stream-based file processing where possible
- Cleanup of temporary objects
- Efficient string operations

## Maintenance Guidelines

### Version Compatibility
- Keep Angular CLI version alignment
- Update schema definitions as needed
- Maintain backward compatibility

### Template Updates
- Test template changes thoroughly
- Validate variable substitution
- Ensure cross-platform compatibility

### Dependency Management
- Monitor external schematic changes
- Update task scheduling as needed
- Maintain compatibility with Angular updates

## Debugging

### Common Issues
1. **Template processing failures**: Check variable names and syntax
2. **Task execution errors**: Verify external schematic availability
3. **File tree corruption**: Ensure proper error handling in file operations
4. **Schema validation failures**: Validate JSON schema syntax

### Debug Techniques
- Use `--dry-run` flag for testing
- Enable debug logging with `DEBUG=*`
- Check intermediate file states
- Validate schema definitions

## Future Improvements

### Planned Features
- Additional template customization options
- Enhanced error reporting
- More flexible configuration options
- Extended testing configurations

### Maintenance Tasks
- Regular dependency updates
- Performance optimization
- Documentation updates
- Community feedback integration
```

## Step 9: Testing and Validation

### 9.1 Run Build Process
```bash
cd projects/${LIBRARY_NAME}
npm run build:schematics
```

### 9.2 Run Tests
```bash
npm run test:schematics
```

### 9.3 Manual Testing
```bash
# Test ng-new schematic
npx @angular-devkit/schematics-cli projects/${LIBRARY_NAME}/schematics/collection.json:ng-new test-workspace

# Test update schematic
npx @angular-devkit/schematics-cli projects/${LIBRARY_NAME}/schematics/collection.json:update-2-0-0 --dry-run
```

### 9.4 Integration with Angular CLI
After publishing your library, users can:
```bash
# Use your ng-new schematic
ng new my-workspace --collection=${LIBRARY_NAME}

# Run migrations
ng update ${LIBRARY_NAME} --from=1.0.0 --to=2.0.0
```

## Troubleshooting

### ⚠️ Common Issues

1. **TypeScript Compilation Errors**:
   - Ensure `tsconfig.schematics.json` extends the correct base configuration
   - Check that all imports are correctly typed
   - Verify `@angular-devkit/schematics` is in devDependencies

2. **Schema Validation Failures**:
   - Validate JSON schema syntax
   - Ensure required properties are properly defined
   - Check that schema files are copied to dist directory

3. **Test Failures**:
   - Make sure Jasmine is configured correctly
   - Verify test files are included in build output
   - Check that mock objects implement required interfaces

4. **File Not Found Errors**:
   - Ensure build script copies all necessary files
   - Check relative paths in collection.json
   - Verify directory structure matches expectations

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run test:schematics
```

### Dry Run Testing
Test schematics without making changes:
```bash
npx @angular-devkit/schematics-cli your-collection:schematic-name --dry-run
```

## Next Steps

1. **Document Usage**: Create user-facing documentation for your schematics
2. **Continuous Integration**: Add schematic testing to your CI pipeline
3. **Version Management**: Align schematic versions with library releases
4. **Team Feedback**: Gather feedback and iterate on schematic functionality

## Additional Resources

- [Angular Schematics Official Guide](https://angular.io/guide/schematics)
- [Angular DevKit Schematics API](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics)
- [JSON Schema Documentation](https://json-schema.org/)
- [Jasmine Testing Framework](https://jasmine.github.io/)
- [Example Angular Library with Schematics](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular)