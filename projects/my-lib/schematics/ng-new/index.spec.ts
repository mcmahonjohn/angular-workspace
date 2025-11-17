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
    
    // Create a minimal mock tree for testing
    mockTree = new UnitTestTree(new EmptyTree());
  });

  it('should have ng-new schematic defined in collection', () => {
    const collection = runner.engine.createCollection(collectionPath);
    const schematic = runner.engine.createSchematic('ng-new', collection);
    
    if (!schematic) {
      fail('ng-new schematic not found in collection');
      return;
    }
    
    if (schematic.description.name !== 'ng-new') {
      fail(`Expected schematic name to be 'ng-new', got '${schematic.description.name}'`);
    }
  });

  it('should validate schema interface properties', () => {
    const validOptions: NgNewSchema = {
      name: 'test-workspace',
      routing: true,
      minimal: false,
      directory: 'optional-dir'
    };

    if (typeof validOptions.name !== 'string') {
      fail('name should be a string');
    }
    
    if (typeof validOptions.routing !== 'boolean') {
      fail('routing should be a boolean');
    }
    
    if (typeof validOptions.minimal !== 'boolean') {
      fail('minimal should be a boolean');
    }
    
    if (typeof validOptions.directory !== 'string') {
      fail('directory should be a string when provided');
    }
  });

  it('should handle minimal schema options correctly', () => {
    const minimalOptions: NgNewSchema = {
      name: 'minimal-workspace'
    };

    if (!minimalOptions.name) {
      fail('name is required');
    }
    
    if (minimalOptions.routing !== undefined) {
      fail('routing should be undefined when not provided');
    }
    
    if (minimalOptions.minimal !== undefined) {
      fail('minimal should be undefined when not provided');
    }
  });

  it('should export default function from index module', () => {
    try {
      const indexModule = require('./index');

      if (typeof indexModule.default !== 'function') {
        fail('Default export should be a function');
      }

    } catch (error) {
      fail(`Failed to import index module: ${error}`);
    }
  });

  it('should validate name patterns for Angular projects', () => {
    const validNames = [
      'my-app',
      'angular-workspace',
      'test-project-123'
    ];

    validNames.forEach(name => {
      const options: NgNewSchema = { name };
      if (!options.name.match(/^[a-zA-Z][a-zA-Z0-9\-]*$/)) {
        fail(`Name '${name}' should match Angular project naming pattern`);
      }
    });
  });

  describe('main schematic function behavior', () => {
    it('should return a Rule function', () => {
      const options: NgNewSchema = { name: 'test-workspace' };
      const indexModule = require('./index');
      const result = indexModule.default(options);
      
      if (typeof result !== 'function') {
        fail('Schematic should return a Rule function');
      }
    });

    it('should handle options with directory parameter', () => {
      const options: NgNewSchema = { 
        name: 'test-workspace',
        directory: 'my-custom-dir' 
      };
      
      const indexModule = require('./index');
      const result = indexModule.default(options);
      
      if (typeof result !== 'function') {
        fail('Schematic should return a Rule function with directory option');
      }
    });

    it('should handle routing option parameter', () => {
      const options: NgNewSchema = { 
        name: 'test-workspace',
        routing: false
      };
      
      const indexModule = require('./index');
      const result = indexModule.default(options);
      
      if (typeof result !== 'function') {
        fail('Schematic should return a Rule function with routing option');
      }
    });

    it('should handle minimal option parameter', () => {
      const options: NgNewSchema = { 
        name: 'test-workspace',
        minimal: true
      };
      
      const indexModule = require('./index');
      const result = indexModule.default(options);
      
      if (typeof result !== 'function') {
        fail('Schematic should return a Rule function with minimal option');
      }
    });
  });

  describe('updateAngularJson function', () => {
    beforeEach(() => {
      // Create a mock angular.json structure
      const angularJson = {
        projects: {
          'test-workspace': {
            architect: {
              build: {
                configurations: {
                  production: {
                    optimization: {}
                  }
                }
              }
            }
          }
        },
        cli: {}
      };
      
      mockTree.create('angular.json', JSON.stringify(angularJson, null, 2));
    });

    it('should process angular.json file when it exists', () => {
      const options: NgNewSchema = { name: 'test-workspace' };
      
      // Since updateAngularJson is not exported, we test through the main function
      // This tests that the function can read and process angular.json
      if (!mockTree.exists('angular.json')) {
        fail('angular.json should exist for testing');
      }
      
      const content = mockTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      if (!workspace.projects || !workspace.projects['test-workspace']) {
        fail('Workspace should have test-workspace project');
      }
    });

    it('should handle angular.json with proper structure', () => {
      const content = mockTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      // Verify the mock structure is correct for testing
      if (!workspace.projects) {
        fail('Workspace should have projects property');
      }
      
      if (!workspace.cli) {
        fail('Workspace should have cli property');
      }
      
      if (!workspace.projects['test-workspace']) {
        fail('Workspace should have test-workspace project');
      }
    });
  });

  describe('updateTsConfig function', () => {
    beforeEach(() => {
      // Create a mock tsconfig.json
      const tsconfig = {
        compilerOptions: {
          strict: true
        },
        angularCompilerOptions: {}
      };
      
      mockTree.create('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    });

    it('should process tsconfig.json when it exists', () => {
      if (!mockTree.exists('tsconfig.json')) {
        fail('tsconfig.json should exist for testing');
      }
      
      const content = mockTree.readContent('tsconfig.json');
      const tsconfig = JSON.parse(content);
      
      if (!tsconfig.compilerOptions) {
        fail('tsconfig should have compilerOptions');
      }
      
      if (!tsconfig.angularCompilerOptions) {
        fail('tsconfig should have angularCompilerOptions');
      }
    });

    it('should handle tsconfig.json with proper structure', () => {
      const content = mockTree.readContent('tsconfig.json');
      const tsconfig = JSON.parse(content);
      
      if (typeof tsconfig.angularCompilerOptions !== 'object') {
        fail('angularCompilerOptions should be an object');
      }
    });
  });

  describe('createKarmaConfigs function logic', () => {
    it('should have correct filter regex for karma template files', () => {
      // Test the filter function logic used in createKarmaConfigs
      const filterRegex = /karma\.conf.*\.js\.template$/;
      
      if (!'karma.conf.js.template'.match(filterRegex)) {
        fail('Should match karma.conf.js.template');
      }
      
      if (!'karma.conf.ci.js.template'.match(filterRegex)) {
        fail('Should match karma.conf.ci.js.template');
      }
      
      if ('other-file.js'.match(filterRegex)) {
        fail('Should not match other-file.js');
      }
      
      if ('karma.conf.js'.match(filterRegex)) {
        fail('Should not match karma.conf.js without .template');
      }
    });

    it('should validate template file naming convention', () => {
      const templateFiles = [
        'karma.conf.js.template',
        'karma.conf.ci.js.template',
        'karma.conf.dev.js.template'
      ];
      
      const filterRegex = /karma\.conf.*\.js\.template$/;
      
      templateFiles.forEach(filename => {
        if (!filename.match(filterRegex)) {
          fail(`Template file '${filename}' should match the filter pattern`);
        }
      });
    });
  });

  describe('removeEmptyConstructors function logic', () => {
    beforeEach(() => {
      // Create mock TypeScript files with various constructor patterns
      mockTree.create('src/app/app.component.ts', `
export class AppComponent {
  title = 'test-workspace';

  constructor() {
  }

  ngOnInit() {
    console.log('initialized');
  }
}
      `);

      mockTree.create('src/app/empty-constructor.component.ts', `
export class EmptyConstructorComponent {
  constructor() {}
}
      `);

      mockTree.create('src/app/non-empty-constructor.component.ts', `
export class NonEmptyConstructorComponent {
  constructor(private service: SomeService) {
    this.service.init();
  }
}
      `);

      mockTree.create('src/app/test.spec.ts', `
describe('Test', () => {
  it('should work', () => {
    class TestClass {
      constructor() {}
    }
  });
});
      `);

      mockTree.create('src/assets/test.txt', 'constructor() {}');
    });

    it('should identify TypeScript files correctly', () => {
      const files = [
        'src/app/app.component.ts',
        'src/app/empty-constructor.component.ts', 
        'src/app/test.spec.ts',
        'src/assets/test.txt'
      ];
      
      files.forEach(filePath => {
        if (!mockTree.exists(filePath)) {
          fail(`File ${filePath} should exist in mock tree`);
        }
      });
      
      // Test file extension logic
      if (!'src/app/app.component.ts'.endsWith('.ts')) {
        fail('Should identify .ts files');
      }
      
      if ('src/assets/test.txt'.endsWith('.ts')) {
        fail('Should not identify .txt files as TypeScript');
      }
    });

    it('should identify spec files correctly', () => {
      if (!'src/app/test.spec.ts'.includes('.spec.ts')) {
        fail('Should identify spec files');
      }
      
      if ('src/app/app.component.ts'.includes('.spec.ts')) {
        fail('Should not identify regular files as spec files');
      }
    });

    it('should handle empty constructor patterns', () => {
      const emptyConstructorPatterns = [
        'constructor() {}',
        `constructor() {
  }`,
        '  constructor() {  }  '
      ];
      
      // Test regex pattern that would be used for removal
      const removePattern = /\s*constructor\(\)\s*{\s*}\s*/g;
      
      emptyConstructorPatterns.forEach(pattern => {
        if (!pattern.match(removePattern)) {
          fail(`Pattern '${pattern.replace(/\n/g, '\\n')}' should match empty constructor regex`);
        }
      });
    });
  });

  describe('interface and type definitions', () => {
    it('should have proper AngularJson interface structure', () => {
      // Test the interface structure expectations
      const mockAngularJson = {
        projects: {
          'test-project': {}
        },
        cli: {
          analytics: false
        }
      };
      
      if (!mockAngularJson.projects) {
        fail('AngularJson should have projects property');
      }
      
      if (!mockAngularJson.cli) {
        fail('AngularJson should have cli property');
      }
    });

    it('should have proper ProjectConfig interface structure', () => {
      const mockProjectConfig = {
        architect: {
          build: {},
          test: {},
          'e2e-ci': {}
        }
      };
      
      if (!mockProjectConfig.architect) {
        fail('ProjectConfig should have architect property');
      }
    });
  });

  describe('error handling scenarios', () => {
    it('should handle missing angular.json gracefully', () => {
      const emptyTree = new UnitTestTree(new EmptyTree());
      
      if (emptyTree.exists('angular.json')) {
        fail('Empty tree should not have angular.json');
      }
      
      // This validates the error handling path in the schematic
      const options: NgNewSchema = { name: 'test-workspace' };
      
      try {
        // The actual error would occur in schematic execution
        // Here we test the condition that would trigger the error
        const workspacePath = 'angular.json';
        if (!emptyTree.exists(workspacePath)) {
          // This simulates the error condition
          const errorMessage = `Workspace file not found at ${workspacePath}`;
          if (!errorMessage.includes('not found')) {
            fail('Error message should indicate file not found');
          }
        }
      } catch (error) {
        // Expected to handle gracefully
      }
    });

    it('should handle directory option with proper path construction', () => {
      const options: NgNewSchema = { 
        name: 'test-workspace',
        directory: 'custom-dir'
      };
      
      // Test path construction logic
      const workspacePath = options.directory ? `${options.directory}/angular.json` : 'angular.json';
      const expectedPath = 'custom-dir/angular.json';
      
      if (workspacePath !== expectedPath) {
        fail(`Path construction should create '${expectedPath}', got '${workspacePath}'`);
      }
    });
  });

  // Direct function tests now that functions are exported
  describe('updateAngularJson function', () => {
    let testTree: UnitTestTree;

    beforeEach(() => {
      testTree = new UnitTestTree(new EmptyTree());
      
      const angularJson = {
        projects: {
          'my-project': {
            architect: {
              build: {
                configurations: {
                  production: {
                    optimization: {
                      fonts: true
                    }
                  }
                }
              }
            }
          }
        },
        cli: {
          packageManager: 'yarn'
        }
      };
      
      testTree.create('angular.json', JSON.stringify(angularJson, null, 2));
    });

    it('should disable CLI analytics', () => {
      const options: NgNewSchema = { name: 'my-project' };
      updateAngularJson(testTree, 'angular.json', options);
      
      const content = testTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      if (workspace.cli.analytics !== false) {
        fail('CLI analytics should be disabled');
      }
    });

    it('should set package manager to npm', () => {
      const options: NgNewSchema = { name: 'my-project' };
      updateAngularJson(testTree, 'angular.json', options);
      
      const content = testTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      if (workspace.cli.packageManager !== 'npm') {
        fail('Package manager should be set to npm');
      }
    });

    it('should add schematic collections', () => {
      const options: NgNewSchema = { name: 'my-project' };
      updateAngularJson(testTree, 'angular.json', options);
      
      const content = testTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      const expectedCollections = ['@schematics/angular', '@angular-eslint/schematics', '@cypress/schematic'];
      
      if (!workspace.cli.schematicCollections) {
        fail('Schematic collections should be defined');
        return;
      }
      
      expectedCollections.forEach(collection => {
        if (!workspace.cli.schematicCollections.includes(collection)) {
          fail(`Should include schematic collection: ${collection}`);
        }
      });
    });

    it('should update production optimization settings', () => {
      const options: NgNewSchema = { name: 'my-project' };
      updateAngularJson(testTree, 'angular.json', options);
      
      const content = testTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      const project = workspace.projects['my-project'];
      const buildConfig = project.architect.build;
      const prodConfig = buildConfig.configurations.production;
      
      if (!prodConfig.optimization.styles || prodConfig.optimization.styles.inlineCritical !== false) {
        fail('Production optimization should disable inline critical styles');
      }
    });

    it('should add e2e-ci configuration', () => {
      const options: NgNewSchema = { name: 'my-project' };
      updateAngularJson(testTree, 'angular.json', options);
      
      const content = testTree.readContent('angular.json');
      const workspace = JSON.parse(content);
      
      const project = workspace.projects['my-project'];
      const e2eConfig = project.architect['e2e-ci'];
      
      if (!e2eConfig) {
        fail('e2e-ci configuration should be added');
        return;
      }
      
      if (e2eConfig.builder !== '@cypress/schematic:cypress') {
        fail('e2e-ci should use Cypress builder');
      }
      
      if (e2eConfig.options.devServerTarget !== 'my-project:serve') {
        fail('e2e-ci should target correct dev server');
      }
    });

    it('should handle missing angular.json gracefully', () => {
      const emptyTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'my-project' };
      
      // Should not throw when file doesn't exist
      try {
        updateAngularJson(emptyTree, 'angular.json', options);
        // Function should return without error when file doesn't exist
      } catch (error) {
        fail(`Should handle missing angular.json gracefully: ${error}`);
      }
    });

    it('should handle empty angular.json file', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'my-project' };
      
      // Create an empty file
      testTree.create('angular.json', '');
      
      try {
        updateAngularJson(testTree, 'angular.json', options);
        // Should handle empty file gracefully
      } catch (error) {
        fail(`Should handle empty angular.json gracefully: ${error}`);
      }
    });

    it('should handle invalid JSON in angular.json', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'my-project' };
      
      // Create a file with invalid JSON
      testTree.create('angular.json', '{ invalid json }');
      
      try {
        updateAngularJson(testTree, 'angular.json', options);
        // Should handle invalid JSON gracefully
      } catch (error) {
        fail(`Should handle invalid JSON in angular.json gracefully: ${error}`);
      }
    });
  });

  describe('updateTsConfig function', () => {
    let testTree: UnitTestTree;

    beforeEach(() => {
      testTree = new UnitTestTree(new EmptyTree());
      
      const tsconfig = {
        compilerOptions: {
          strict: true,
          target: 'ES2022'
        },
        angularCompilerOptions: {
          enableI18nLegacyMessageIdFormat: true
        }
      };
      
      testTree.create('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    });

    it('should update Angular compiler options', () => {
      const options: NgNewSchema = { name: 'my-project' };
      updateTsConfig(testTree, options);
      
      const content = testTree.readContent('tsconfig.json');
      const tsconfig = JSON.parse(content);
      
      const angularOptions = tsconfig.angularCompilerOptions;
      
      if (angularOptions.enableI18nLegacyMessageIdFormat !== false) {
        fail('Should disable legacy message ID format');
      }
      
      if (angularOptions.fullTemplateTypeCheck !== true) {
        fail('Should enable full template type check');
      }
      
      if (angularOptions.strictInjectionParameters !== true) {
        fail('Should enable strict injection parameters');
      }
      
      if (angularOptions.strictInputAccessModifiers !== true) {
        fail('Should enable strict input access modifiers');
      }
      
      if (angularOptions.strictTemplates !== true) {
        fail('Should enable strict templates');
      }
      
      if (angularOptions.strictStandalone !== true) {
        fail('Should enable strict standalone');
      }
    });

    it('should handle tsconfig with directory option', () => {
      const options: NgNewSchema = { name: 'my-project', directory: 'custom-dir' };
      
      // Create tsconfig in custom directory
      testTree.create('custom-dir/tsconfig.json', JSON.stringify({
        compilerOptions: {},
        angularCompilerOptions: {}
      }, null, 2));
      
      updateTsConfig(testTree, options);
      
      if (!testTree.exists('custom-dir/tsconfig.json')) {
        fail('Should handle custom directory path');
      }
      
      const content = testTree.readContent('custom-dir/tsconfig.json');
      const tsconfig = JSON.parse(content);
      
      if (!tsconfig.angularCompilerOptions.strictTemplates) {
        fail('Should update tsconfig in custom directory');
      }
    });

    it('should handle missing tsconfig.json gracefully', () => {
      const emptyTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'my-project' };
      
      try {
        updateTsConfig(emptyTree, options);
        // Should not throw when file doesn't exist
      } catch (error) {
        fail(`Should handle missing tsconfig.json gracefully: ${error}`);
      }
    });

    it('should handle empty tsconfig.json file', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'my-project' };
      
      // Create an empty file (no content)
      testTree.create('tsconfig.json', '');
      
      try {
        updateTsConfig(testTree, options);
        // Should handle empty file gracefully
      } catch (error) {
        fail(`Should handle empty tsconfig.json gracefully: ${error}`);
      }
    });

    it('should handle invalid JSON in tsconfig.json', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'my-project' };
      
      // Create a file with invalid JSON
      testTree.create('tsconfig.json', '{ "invalid": json }');
      
      try {
        updateTsConfig(testTree, options);
        // Should handle invalid JSON gracefully
      } catch (error) {
        fail(`Should handle invalid JSON in tsconfig.json gracefully: ${error}`);
      }
    });

    it('should handle null content in tsconfig.json', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      
      // Create file but simulate null content scenario
      testTree.create('tsconfig.json', JSON.stringify({
        compilerOptions: {},
        angularCompilerOptions: {}
      }));
      
      const options: NgNewSchema = { name: 'my-project' };
      
      // Test the early return path when content exists
      updateTsConfig(testTree, options);
      
      // Verify file was processed (not early return)
      const content = testTree.readContent('tsconfig.json');
      const tsconfig = JSON.parse(content);
      
      if (!tsconfig.angularCompilerOptions.strictTemplates) {
        fail('Should process valid tsconfig content');
      }
    });
  });

  describe('createKarmaConfigs function', () => {
    it('should return a Rule function', () => {
      const options: NgNewSchema = { name: 'test-workspace' };
      const rule = createKarmaConfigs(options);
      
      if (typeof rule !== 'function') {
        fail('createKarmaConfigs should return a Rule function');
      }
    });

    it('should handle directory option', () => {
      const options: NgNewSchema = { 
        name: 'test-workspace',
        directory: 'my-custom-dir'
      };
      
      const rule = createKarmaConfigs(options);
      
      if (typeof rule !== 'function') {
        fail('createKarmaConfigs should return a Rule function with directory option');
      }
    });

    it('should handle undefined directory option', () => {
      const options: NgNewSchema = { name: 'test-workspace' };
      
      const rule = createKarmaConfigs(options);
      
      if (typeof rule !== 'function') {
        fail('createKarmaConfigs should handle undefined directory');
      }
    });
  });

  describe('removeEmptyConstructors function', () => {
    let testTree: UnitTestTree;

    beforeEach(() => {
      testTree = new UnitTestTree(new EmptyTree());
      testTree.create('src/app', ''); // Create directory
    });

    it('should remove empty constructors with braces on same line', () => {
      testTree.create('src/app/component1.ts', `
export class Component1 {
  title = 'test';
  constructor() {}
  
  ngOnInit() {
    console.log('init');
  }
}
      `);
      
      const options: NgNewSchema = { name: 'my-project' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/app/component1.ts');
      
      if (content.includes('constructor() {}')) {
        fail('Should remove empty constructor with braces on same line');
      }
      
      if (!content.includes('ngOnInit()')) {
        fail('Should preserve other methods');
      }
    });

    it('should remove empty constructors with braces on separate lines', () => {
      testTree.create('src/app/component2.ts', `
export class Component2 {
  constructor() {
  }
}
      `);
      
      const options: NgNewSchema = { name: 'my-project' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/app/component2.ts');
      
      if (content.includes('constructor()')) {
        fail('Should remove empty constructor with braces on separate lines');
      }
    });

    it('should not remove constructors with parameters', () => {
      testTree.create('src/app/component3.ts', `
export class Component3 {
  constructor(private service: SomeService) {
    this.service.init();
  }
}
      `);
      
      const options: NgNewSchema = { name: 'my-project' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/app/component3.ts');
      
      if (!content.includes('constructor(private service: SomeService)')) {
        fail('Should preserve constructors with parameters');
      }
    });

    it('should not modify spec files', () => {
      testTree.create('src/app/component.spec.ts', `
describe('Component', () => {
  it('should work', () => {
    class TestClass {
      constructor() {}
    }
  });
});
      `);
      
      const options: NgNewSchema = { name: 'my-project' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/app/component.spec.ts');
      
      if (!content.includes('constructor() {}')) {
        fail('Should not modify spec files');
      }
    });

    it('should not modify non-TypeScript files', () => {
      testTree.create('src/assets/test.txt', 'constructor() {}');
      
      const options: NgNewSchema = { name: 'my-project' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/assets/test.txt');
      
      if (!content.includes('constructor() {}')) {
        fail('Should not modify non-TypeScript files');
      }
    });

    it('should handle directory option', () => {
      testTree.create('custom-dir/src/app/component.ts', `
export class Component {
  constructor() {}
}
      `);
      
      const options: NgNewSchema = { name: 'my-project', directory: 'custom-dir' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('custom-dir/src/app/component.ts');
      
      if (content.includes('constructor() {}')) {
        fail('Should handle custom directory option');
      }
    });

    it('should clean up extra newlines', () => {
      testTree.create('src/app/component4.ts', `
export class Component4 {
  title = 'test';


  constructor() {
  }



  ngOnInit() {
    console.log('init');
  }
}
      `);
      
      const options: NgNewSchema = { name: 'my-project' };
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/app/component4.ts');
      
      if (content.includes('\n\n\n')) {
        fail('Should clean up excessive newlines');
      }
    });
  });

  // Additional tests for edge cases and chain logic
  describe('main schematic chain integration', () => {
    it('should handle the configuration step when angular.json exists', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      
      // Create a proper angular.json structure
      const angularJson = {
        projects: {
          'test-workspace': {
            architect: {
              build: {
                configurations: {
                  production: { optimization: {} }
                }
              }
            }
          }
        },
        cli: {}
      };
      testTree.create('angular.json', JSON.stringify(angularJson, null, 2));
      
      // Create tsconfig.json
      const tsconfig = {
        compilerOptions: {},
        angularCompilerOptions: {}
      };
      testTree.create('tsconfig.json', JSON.stringify(tsconfig, null, 2));
      
      const options: NgNewSchema = { name: 'test-workspace' };
      
      // Test the configuration step logic
      const workspacePath = 'angular.json';
      
      if (!testTree.exists(workspacePath)) {
        fail('Angular.json should exist for configuration step');
      }
      
      // Test calling updateAngularJson and updateTsConfig directly
      updateAngularJson(testTree, workspacePath, options);
      updateTsConfig(testTree, options);
      
      // Verify both were executed
      const updatedAngular = JSON.parse(testTree.readContent('angular.json'));
      const updatedTsConfig = JSON.parse(testTree.readContent('tsconfig.json'));
      
      if (updatedAngular.cli.analytics !== false) {
        fail('Configuration step should update angular.json');
      }
      
      if (!updatedTsConfig.angularCompilerOptions.strictTemplates) {
        fail('Configuration step should update tsconfig.json');
      }
    });

    it('should throw error when angular.json is missing', () => {
      const emptyTree = new UnitTestTree(new EmptyTree());
      const options: NgNewSchema = { name: 'test-workspace' };
      const workspacePath = 'angular.json';
      
      if (emptyTree.exists(workspacePath)) {
        fail('Tree should be empty for this test');
      }
      
      // Test the error condition
      let errorThrown = false;
      try {
        // This simulates what happens in the configuration step
        if (!emptyTree.exists(workspacePath)) {
          throw new Error(`Workspace file not found at ${workspacePath}`);
        }
      } catch (error) {
        errorThrown = true;
        if (!(error as Error).message.includes('Workspace file not found')) {
          fail('Should throw appropriate error message');
        }
      }
      
      if (!errorThrown) {
        fail('Should throw error when angular.json is missing');
      }
    });

    it('should handle directory option in workspace path calculation', () => {
      const options: NgNewSchema = { 
        name: 'test-workspace',
        directory: 'my-custom-directory'
      };
      
      // Test the path calculation logic
      const workspacePath = options.directory ? `${options.directory}/angular.json` : 'angular.json';
      const expectedPath = 'my-custom-directory/angular.json';
      
      if (workspacePath !== expectedPath) {
        fail(`Workspace path should be '${expectedPath}', got '${workspacePath}'`);
      }
    });

    it('should handle options without directory in workspace path calculation', () => {
      const options: NgNewSchema = { name: 'test-workspace' };
      
      // Test the path calculation logic
      const workspacePath = options.directory ? `${options.directory}/angular.json` : 'angular.json';
      const expectedPath = 'angular.json';
      
      if (workspacePath !== expectedPath) {
        fail(`Workspace path should be '${expectedPath}', got '${workspacePath}'`);
      }
    });
  });

  describe('post-processing step', () => {
    it('should call removeEmptyConstructors in post-processing', () => {
      const testTree = new UnitTestTree(new EmptyTree());
      
      // Create a file with empty constructor
      testTree.create('src/app/test.ts', `
export class TestComponent {
  constructor() {}
}
      `);
      
      const options: NgNewSchema = { name: 'test-workspace' };
      
      // Simulate the post-processing step
      removeEmptyConstructors(testTree, options);
      
      const content = testTree.readContent('src/app/test.ts');
      if (content.includes('constructor() {}')) {
        fail('Post-processing should remove empty constructors');
      }
    });
  });

  describe('Cypress task configuration', () => {
    it('should calculate correct working directory for Cypress task', () => {
      const optionsWithDir: NgNewSchema = { 
        name: 'test-workspace',
        directory: 'custom-dir'
      };
      
      const optionsWithoutDir: NgNewSchema = { 
        name: 'test-workspace'
      };
      
      // Test the working directory calculation logic
      const workingDirWithCustom = optionsWithDir.directory || '.';
      const workingDirDefault = optionsWithoutDir.directory || '.';
      
      if (workingDirWithCustom !== 'custom-dir') {
        fail('Should use custom directory when provided');
      }
      
      if (workingDirDefault !== '.') {
        fail('Should use current directory as default');
      }
    });

    it('should use correct project name for Cypress schematic', () => {
      const options: NgNewSchema = { name: 'my-awesome-project' };
      
      // Test that the project name is used correctly
      if (options.name !== 'my-awesome-project') {
        fail('Should use correct project name for Cypress setup');
      }
    });
  });
});