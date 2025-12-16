import testing from '@angular-devkit/schematics/testing/index.js';
const { SchematicTestRunner, UnitTestTree } = testing;
import { Tree } from '@angular-devkit/schematics';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('angular-signal', collectionPath);
    appTree = new UnitTestTree(Tree.empty());
  });

  it('should detect an existing ESLint config and not create a new one', async () => {
    appTree.create('eslint.config.js', '// existing config');
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    expect(tree.exists('eslint.config.js')).toBe(true);
    expect(tree.readContent('eslint.config.js')).toContain('// existing config');
  });

  it('should create a basic ESLint config if none exists', async () => {
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    expect(tree.exists('eslint.config.js')).toBe(true);
    expect(tree.readContent('eslint.config.js')).toContain('plugins: [\'angular-signal\']');
  });

  it('should not overwrite other supported config files', async () => {
    appTree.create('.eslintrc.json', '{ "root": true }');
    const tree = await runner.runSchematic('ng-add', {}, appTree);
    expect(tree.exists('.eslintrc.json')).toBe(true);
    expect(tree.readContent('.eslintrc.json')).toContain('"root": true');
    expect(tree.exists('eslint.config.js')).toBe(false);
  });
});
