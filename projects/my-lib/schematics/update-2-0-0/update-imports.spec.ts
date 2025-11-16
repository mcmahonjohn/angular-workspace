// @ts-nocheck

const { SchematicTestRunner, UnitTestTree } = require('@angular-devkit/schematics/testing');
const path = require('path');

describe('update-imports schematic', () => {
  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicName = 'update-2-0-0';
  let runner;
  let appTree;

  beforeEach(() => {
      runner = new SchematicTestRunner('my-lib', collectionPath);
      const { EmptyTree } = require('@angular-devkit/schematics');
      appTree = new UnitTestTree(new EmptyTree());
      appTree.create('src/app/example.ts', `import { Foo } from 'my-lib';\nconst x = 1;`);
  });

  it('should update imports from "my-lib" to "library"', async () => {
    const tree = await runner.runSchematic(schematicName, {}, appTree);
    const content = tree.readContent('src/app/example.ts');
    expect(content).toContain(`import { Foo } from 'library';`);
    expect(content).not.toContain('my-lib');
  });
});
