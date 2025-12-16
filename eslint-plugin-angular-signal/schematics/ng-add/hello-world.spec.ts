const { SchematicTestRunner } = require('@angular-devkit/schematics/testing');
const { Tree } = require('@angular-devkit/core');
const { createTreeWithEmptyWorkspace } = require('@angular-devkit/core/testing');

const runner = new SchematicTestRunner('eslint-plugin-angular-signal', require.resolve('../collection.json'));

describe('hello-world schematic', () => {
    let appTree;

    beforeEach(() => {
        appTree = createTreeWithEmptyWorkspace();
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