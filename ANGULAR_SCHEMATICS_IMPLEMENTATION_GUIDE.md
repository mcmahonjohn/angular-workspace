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

## Identifying Target Projects

### Determining if a Project Needs Schematics

Before implementing schematics, identify which project in your Angular workspace should contain them:

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

**AI Agent Prompt**: If implementing via AI agent, include this question in your prompt:
> "Which project in this Angular workspace should contain the schematics? Look for projects with `ng-package.json` files under the `projects/` directory, as these are typically publishable libraries that benefit from schematics."

### Project Structure Validation

Your target library project should have this structure:
```
projects/
└── your-lib/
    ├── ng-package.json          # ✓ Required - indicates publishable library
    ├── package.json             # ✓ Required - library-specific dependencies
    ├── src/
    │   ├── lib/                 # ✓ Required - library source code
    │   └── public-api.ts        # ✓ Required - public API exports
    └── schematics/              # ← This is what we'll create
```

# Step-by-Step Implementation Guide

## Step 1: Environment Setup and Project Structure

### 1.1 Navigate to Your Library Project
```bash
cd projects/your-lib
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

> **Tip:** Check your Angular version with `ng version` and update the above commands accordingly to ensure compatibility.

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
      "description": "Create a new Angular workspace with your-lib optimizations.",
      "factory": "./ng-new/index#default",
      "schema": "./ng-new/schema.json"
    },
    "update-2-0-0": {
      "version": "2.0.0",
      "description": "Update imports from 'your-lib' to 'new-name' in TS files.",
      "factory": "./update-2-0-0/index#updateToV2",
      "schema": "./update-2-0-0/schema.json"
    },
    "update-3-0-0": {
      "version": "3.0.0",
      "description": "Migration for your-lib v3.0.0 breaking changes.",
      "factory": "./update-3-0-0/index#updateToV3",
      "schema": "./update-3-0-0/schema.json"
    },
    "update-4-0-0": {
      "version": "4.0.0",
      "description": "Migration for your-lib v4.0.0 breaking changes.",
      "factory": "./update-4-0-0/index#updateToV4",
      "schema": "./update-4-0-0/schema.json"
    },
    "update-5-0-0": {
      "version": "5.0.0",
      "description": "Migration for your-lib v5.0.0 breaking changes.",
      "factory": "./update-5-0-0/index#updateToV5",
      "schema": "./update-5-0-0/schema.json"
    },
    "update-6-0-0": {
      "version": "6.0.0",
      "description": "Migration for your-lib v6.0.0 breaking changes.",
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
  "$id": "SchematicsYourLibNgNew",
  "title": "Your Lib Ng New Options Schema",
  "type": "object",
  "description": "Creates a new Angular workspace with your-lib specific configurations.",
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
  return (tree: Tree, context: SchematicContext) => {
    const targetPath = options.directory || '.';
    
    // Create karma configuration template
    const karmaConfig = `
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-headless'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: true,
        seed: '4321'
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
`;

    tree.create(`${targetPath}/karma.conf.js`, karmaConfig);
    return tree;
  };
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
  "$id": "SchematicsYourLibUpdate200",
  "title": "Update to 2.0.0",
  "type": "object",
  "description": "Updates imports from 'your-lib' to 'new-lib-name'."
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
  // Replace 'your-lib' with 'new-lib-name' in import statements
  return source.replace(/(['"])your-lib\1/g, '$1new-lib-name$1');
}

export function updateImports(tree: Tree, context: SchematicContext): void {
  tree.visit(filePath => {
    if (filePath.endsWith('.ts')) {
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
    it('should update import statements from your-lib to new-lib-name', () => {
      const sourceContent = `
import { SomeService } from 'your-lib';
import { AnotherService } from "your-lib";
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
      expect(updatedContent).toContain(`import { SomeService } from 'new-lib-name';`);
      expect(updatedContent).toContain(`import { AnotherService } from "new-lib-name";`);
      expect(updatedContent).toContain(`import { ThirdService } from 'other-lib';`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in test.ts');
    });

    it('should not modify files without your-lib imports', () => {
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
      mockTree.create('test.js', `import { Service } from 'your-lib';`);
      mockTree.create('test.html', `<div>your-lib content</div>`);
      mockTree.create('test.ts', `import { Service } from 'your-lib';`);
      
      const mockContext = {
        logger: {
          info: jasmine.createSpy('info')
        }
      };

      updateImports(mockTree, mockContext as any);

      expect(mockTree.readContent('test.js')).toContain('your-lib');
      expect(mockTree.readContent('test.html')).toContain('your-lib');
      expect(mockTree.readContent('test.ts')).toContain('new-lib-name');
      expect(mockContext.logger.info).toHaveBeenCalledTimes(1);
    });
  });
});
```

### 5.3 Create Integration Tests
Create `schematics/ng-new/test-ng-new-schematic.js`:
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

# Build schematics script for your-lib
# This script compiles TypeScript and copies necessary files

set -e  # Exit on any error

SCHEMATICS_DIR="projects/your-lib/schematics"
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

# Test schematics script for your-lib
# This script runs all schematic tests with coverage

set -e  # Exit on any error

SCHEMATICS_DIR="projects/your-lib/schematics"
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
if [ -f "$DIST_DIR/ng-new/test-ng-new-schematic.js" ]; then
    node "$DIST_DIR/ng-new/test-ng-new-schematic.js"
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
Update `projects/your-lib/package.json`:
```json
{
  "name": "your-lib",
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
    "build:lib:schematics": "npm run build:schematics --prefix projects/your-lib",
    "test:lib:schematics": "npm run test:schematics --prefix projects/your-lib"
  }
}
```

## Step 8: Documentation and Best Practices

### 8.1 Create Schematic Documentation
Create `schematics/README.md`:
```markdown
# Your-Lib Schematics

This directory contains Angular Schematics for your-lib.

## Available Schematics

### ng-new
Creates a new Angular workspace optimized for your-lib usage.

Usage:
```bash
ng new my-workspace --collection=your-lib
```

### Update Migrations
Automatic migrations for breaking changes between versions.

- `update-2-0-0`: Updates import statements
- `update-3-0-0`: Migrates method signatures
- `update-4-0-0`: Updates configuration files
- `update-5-0-0`: Modernizes code patterns
- `update-6-0-0`: Latest breaking changes

## Development

### Building
```bash
npm run build:schematics
```

### Testing
```bash
npm run test:schematics
```

### Testing with Watch Mode
```bash
npm run test:schematics:watch
```

## Testing Philosophy

We use Jasmine (not Jest) for testing schematics because:
- Better integration with Angular DevKit testing utilities
- Consistent with Angular CLI's testing approach
- More mature schematic testing patterns
- Better error reporting for file tree manipulations
```

### 8.2 Multi-Project Workspace Best Practices

**Directory Organization**:
```
projects/
├── your-lib/
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

## Step 9: Testing and Validation

### 9.1 Run Build Process
```bash
cd projects/your-lib
npm run build:schematics
```

### 9.2 Run Tests
```bash
npm run test:schematics
```

### 9.3 Manual Testing
```bash
# Test ng-new schematic
npx @angular-devkit/schematics-cli projects/your-lib/schematics/collection.json:ng-new test-workspace

# Test update schematic
npx @angular-devkit/schematics-cli projects/your-lib/schematics/collection.json:update-2-0-0 --dry-run
```

### 9.4 Integration with Angular CLI
After publishing your library, users can:
```bash
# Use your ng-new schematic
ng new my-workspace --collection=your-lib

# Run migrations
ng update your-lib --from=1.0.0 --to=2.0.0
```

## Troubleshooting

### Common Issues

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

1. **Publish Your Library**: Include the built schematics in your npm package
2. **Document Usage**: Create user-facing documentation for your schematics
3. **Continuous Integration**: Add schematic testing to your CI pipeline
4. **Version Management**: Align schematic versions with library releases
5. **Community Feedback**: Gather feedback and iterate on schematic functionality

## Additional Resources

- [Angular Schematics Official Guide](https://angular.io/guide/schematics)
- [Angular DevKit Schematics API](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics)
- [JSON Schema Documentation](https://json-schema.org/)
- [Jasmine Testing Framework](https://jasmine.github.io/)
- [Example Angular Library with Schematics](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular)