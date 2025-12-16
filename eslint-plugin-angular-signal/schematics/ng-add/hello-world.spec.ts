import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import path from 'path';

const collectionPath = path.resolve(__dirname, '../collection.json');
const runner = new SchematicTestRunner('eslint-plugin-angular-signal', collectionPath);

describe('hello-world schematic', () => {
    let appTree: Tree;

    beforeEach(() => {
        appTree = Tree.empty();
    });

    it('should create a file', async () => {
        const tree = await runner.runSchematic('ng-add', {}, appTree);
        expect(tree.files).toContain('/some-file.txt');
    });

    it('should update the configuration', async () => {
        const tree = await runner.runSchematic('ng-add', {}, appTree);
        const config = tree.readContent('/angular.json');
        expect(config).toContain('new-config');
    });
});