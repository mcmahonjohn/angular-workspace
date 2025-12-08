import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { updateImports } from './update-imports';
import * as path from 'path';

describe('update-imports schematic', () => {
  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicName = 'update-2-0-0';
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(() => {
      runner = new SchematicTestRunner('my-lib', collectionPath);
      appTree = new UnitTestTree(Tree.empty());
      appTree.create('src/app/example.ts', `import { Foo } from 'my-lib';\nconst x = 1;`);
  });

  it('should update imports from "my-lib" to "library"', async () => {
    const tree = await runner.runSchematic(schematicName, {}, appTree);
    const content = tree.readContent('src/app/example.ts');
    expect(content).toContain(`import { Foo } from 'library';`);
    expect(content).not.toContain('my-lib');
  });

  describe('updateImports function', () => {
    let mockContext: any;
    let testTree: UnitTestTree;

    beforeEach(() => {
      testTree = new UnitTestTree(Tree.empty());
      mockContext = {
        logger: {
          info: jasmine.createSpy('info')
        }
      };
    });

    it('should update single quotes import', () => {
      testTree.create('/test.ts', `import { Service } from 'my-lib';`);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Service } from 'library';`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.ts');
    });

    it('should update double quotes import', () => {
      testTree.create('/test.ts', `import { Component } from "my-lib";`);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Component } from "library";`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.ts');
    });

    it('should update multiple imports in same file', () => {
      testTree.create('/test.ts', `
        import { Service } from 'my-lib';
        import { Component } from "my-lib";
        import { Utils } from 'my-lib';
      `);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Service } from 'library';`);
      expect(content).toContain(`import { Component } from "library";`);
      expect(content).toContain(`import { Utils } from 'library';`);
      expect(content).not.toContain('my-lib');
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.ts');
    });

    it('should handle files with no my-lib imports', () => {
      testTree.create('/test.ts', `import { Component } from '@angular/core';\nconst x = 1;`);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Component } from '@angular/core';`);
      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it('should only process .ts and .scss files', () => {
      testTree.create('/test.js', `import { Service } from 'my-lib';`);
      testTree.create('/test.html', `<div>my-lib</div>`);
      testTree.create('/test.css', `.my-lib { color: red; }`);
      testTree.create('/test.scss', `@import 'my-lib';`);
      
      updateImports(testTree, mockContext);
      
      // JS, HTML, and CSS files should not be modified
      expect(testTree.readContent('/test.js')).toContain('my-lib');
      expect(testTree.readContent('/test.html')).toContain('my-lib');
      expect(testTree.readContent('/test.css')).toContain('my-lib');
      // SCSS file should be modified
      expect(testTree.readContent('/test.scss')).toContain('library');
      expect(testTree.readContent('/test.scss')).not.toContain('my-lib');
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.scss');
    });

    it('should handle empty TypeScript files', () => {
      testTree.create('/empty.ts', '');
      
      updateImports(testTree, mockContext);
      
      expect(testTree.readContent('/empty.ts')).toEqual('');
      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it('should handle TypeScript files with mixed content', () => {
      testTree.create('/mixed.ts', `
        import { Service } from 'my-lib';
        import { Component } from '@angular/core';
        
        const myLibString = 'this contains my-lib but should not be changed';
        // Comment about my-lib
        export class TestClass {
          // my-lib reference in comment
        }
      `);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/mixed.ts');
      expect(content).toContain(`import { Service } from 'library';`);
      expect(content).toContain(`import { Component } from '@angular/core';`);
      // Only imports should be changed, not other occurrences
      expect(content).toContain(`const myLibString = 'this contains my-lib but should not be changed';`);
      expect(content).toContain(`// Comment about my-lib`);
      expect(content).toContain(`// my-lib reference in comment`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /mixed.ts');
    });

    it('should handle complex import patterns', () => {
      testTree.create('/complex.ts', `
        import * as MyLib from 'my-lib';
        import { default as DefaultExport } from 'my-lib';
        import MyLibDefault, { Service, Component } from 'my-lib';
      `);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/complex.ts');
      expect(content).toContain(`import * as MyLib from 'library';`);
      expect(content).toContain(`import { default as DefaultExport } from 'library';`);
      expect(content).toContain(`import MyLibDefault, { Service, Component } from 'library';`);
      expect(content).not.toContain('my-lib');
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /complex.ts');
    });

    it('should handle nested directory structures', () => {
      testTree.create('/src/app/components/test.ts', `import { Service } from 'my-lib';`);
      testTree.create('/src/lib/utils/helper.ts', `import { Utils } from 'my-lib';`);
      
      updateImports(testTree, mockContext);
      
      expect(testTree.readContent('/src/app/components/test.ts')).toContain(`import { Service } from 'library';`);
      expect(testTree.readContent('/src/lib/utils/helper.ts')).toContain(`import { Utils } from 'library';`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /src/app/components/test.ts');
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /src/lib/utils/helper.ts');
    });

    it('should handle files that cannot be read (null buffer)', () => {
      // Create a mock tree that returns null for read operations
      const mockTree: any = {
        visit: jasmine.createSpy('visit').and.callFake((visitor) => {
          // Simulate visiting a .ts file that returns null buffer
          visitor('/unreadable.ts');
        }),
        read: jasmine.createSpy('read').and.returnValue(null),
        overwrite: jasmine.createSpy('overwrite')
      };
      
      // This should not throw an error and should handle null buffer gracefully
      expect(() => {
        updateImports(mockTree, mockContext);
      }).not.toThrow();
      
      // Verify that read was called but overwrite was not (due to null buffer)
      expect(mockTree.read).toHaveBeenCalledWith('/unreadable.ts');
      expect(mockTree.overwrite).not.toHaveBeenCalled();
      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });
  });
});

describe('replaceImportPath', () => {
  const { replaceImportPath } = require('./update-imports');

  it('should replace TypeScript single quote import', () => {
    const input = "import { Foo } from 'my-lib';";
    const output = replaceImportPath(input);
    expect(output).toEqual("import { Foo } from 'library';");
  });

  it('should replace TypeScript double quote import', () => {
    const input = 'import { Bar } from "my-lib";';
    const output = replaceImportPath(input);
    expect(output).toEqual('import { Bar } from "library";');
  });

  it('should replace multiple TypeScript imports', () => {
    const input = `import { Foo } from 'my-lib';\nimport { Bar } from "my-lib";`;
    const output = replaceImportPath(input);
    expect(output).toContain("import { Foo } from 'library';");
    expect(output).toContain('import { Bar } from "library";');
  });

  it('should replace SCSS @import single quote', () => {
    const input = "@import 'my-lib';";
    const output = replaceImportPath(input);
    expect(output).toEqual("@import 'library';");
  });

  it('should replace SCSS @import double quote', () => {
    const input = '@import "my-lib";';
    const output = replaceImportPath(input);
    expect(output).toEqual('@import "library";');
  });

  it('should replace multiple SCSS @import statements', () => {
    const input = `@import 'my-lib';\n@import "my-lib";`;
    const output = replaceImportPath(input);
    expect(output).toContain("@import 'library';");
    expect(output).toContain('@import "library";');
  });

  it('should not change unrelated content', () => {
    const input = "const x = 'my-lib'; // not an import";
    const output = replaceImportPath(input);
    expect(output).toEqual(input);
  });
});