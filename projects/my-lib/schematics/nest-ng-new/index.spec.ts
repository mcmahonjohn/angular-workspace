import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { EmptyTree } from '@angular-devkit/schematics';
import * as path from 'path';

import nestNgNewSchematic from './index';
import { NestNgNewOptions } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('nest-ng-new', () => {
  let runner: SchematicTestRunner;
  let mockTree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    mockTree = new UnitTestTree(new EmptyTree());
  });

  it('should have nest-ng-new schematic defined in collection', () => {
    const collection = runner.engine.createCollection(collectionPath);
    const schematic = runner.engine.createSchematic('nest-ng-new', collection);
    expect(schematic).toBeDefined();
    expect(schematic.description.name).toBe('nest-ng-new');
  });

  it('should export default function from index module', () => {
    const indexModule = require('./index');
    expect(typeof indexModule.default).toBe('function');
  });

  it('should return a Rule function', () => {
    const options: NestNgNewOptions = { name: 'test-nest-app' };
    const rule = nestNgNewSchematic(options);
    expect(typeof rule).toBe('function');
  });

  it('should handle options with docker parameter', () => {
    const options: NestNgNewOptions = { name: 'test-nest-app', docker: true };
    const rule = nestNgNewSchematic(options);
    expect(typeof rule).toBe('function');
  });

  it('should handle options with skipGit', () => {
    const options: NestNgNewOptions = { name: 'test-nest-app', skipGit: true };
    const rule = nestNgNewSchematic(options);
    expect(typeof rule).toBe('function');
  });

  it('should handle missing schematicCollections', () => {
    const options: NestNgNewOptions = { name: 'test-nest-app' };
    const rule = nestNgNewSchematic(options);
    expect(typeof rule).toBe('function');
  });

  it('should handle custom schematicCollections', () => {
    const options: NestNgNewOptions = { name: 'test-nest-app', schematicCollections: ['@nestjs/schematics'] };
    const rule = nestNgNewSchematic(options);
    expect(typeof rule).toBe('function');
  });
});
