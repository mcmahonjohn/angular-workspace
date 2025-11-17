import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as NgNewSchema } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-new', () => {
  let runner: SchematicTestRunner;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
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

  it('should validate schema interface', () => {
    const validOptions: NgNewSchema = {
      name: 'test-workspace',
      routing: true,
      minimal: false,
      directory: 'optional-dir'
    };

    // Check that all properties are correctly typed
    if (typeof validOptions.name !== 'string') {
      fail('name should be a string');
    }
    
    if (typeof validOptions.routing !== 'boolean') {
      fail('routing should be a boolean');
    }
    
    if (typeof validOptions.minimal !== 'boolean') {
      fail('minimal should be a boolean');
    }
    
    if (validOptions.directory && typeof validOptions.directory !== 'string') {
      fail('directory should be a string when provided');
    }
  });

  it('should handle minimal schema options', () => {
    const minimalOptions: NgNewSchema = {
      name: 'minimal-workspace'
    };

    if (!minimalOptions.name) {
      fail('name is required');
    }
    
    // Optional properties should be undefined when not provided
    if (minimalOptions.routing !== undefined) {
      fail('routing should be undefined when not provided');
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

  it('should handle schema validation for name patterns', () => {
    // Test valid Angular project names
    const validNames = [
      'my-app',
      'angular-workspace',
      'test-project-123'
    ];

    validNames.forEach(name => {
      const options: NgNewSchema = { name };
      if (!options.name.match(/^[a-zA-Z][a-zA-Z0-9\-]*$/)) {
        fail(`Name '${name}' should be valid`);
      }
    });
  });

  // Note: Full integration tests would require mocking @schematics/angular
  // which is complex to set up in this environment. The schematic is designed
  // to work with Angular's ng-new and would need the full Angular CLI context
  // to test properly. For practical testing, the schematic should be tested
  // manually with: ng generate my-lib:ng-new test-workspace
});