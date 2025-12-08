import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { replaceImportPath, updateImports } from './update-imports';
import * as path from 'path';

describe('update-imports schematic', () => {
  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicName = 'update-2-0-0';
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(() => {
      runner = new SchematicTestRunner('my-lib', collectionPath);
      appTree = new UnitTestTree(Tree.empty());
      appTree.create('src/app/example.ts', `import { Foo } from '@car';\nconst x = 1;`);
  });

  it('should update imports from "@car" to "@door"', async () => {
    const tree = await runner.runSchematic(schematicName, {}, appTree);
    const content = tree.readContent('src/app/example.ts');
    expect(content).toContain(`import { Foo } from '@door';`);
    expect(content).not.toContain('@car');
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
      testTree.create('/test.ts', `import { Service } from '@car';`);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Service } from '@door';`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.ts');
    });

    it('should update double quotes import', () => {
      testTree.create('/test.ts', `import { Component } from "@car";`);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Component } from "@door";`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.ts');
    });

    it('should update multiple imports in same file', () => {
      testTree.create('/test.ts', `
        import { Service } from '@car';
        import { Component } from "@car";
        import { Utils } from '@car';
      `);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Service } from '@door';`);
      expect(content).toContain(`import { Component } from "@door";`);
      expect(content).toContain(`import { Utils } from '@door';`);
      expect(content).not.toContain('@car');
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /test.ts');
    });

    it('should handle files with no @car imports', () => {
      testTree.create('/test.ts', `import { Component } from '@angular/core';\nconst x = 1;`);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/test.ts');
      expect(content).toContain(`import { Component } from '@angular/core';`);
      expect(mockContext.logger.info).not.toHaveBeenCalled();
    });

    it('should only process .ts and .scss files', () => {
      testTree.create('/test.js', `import { Service } from '@car';`);
      testTree.create('/test.html', `<div>@car</div>`);
      testTree.create('/test.css', `.@car { color: red; }`);
      testTree.create('/test.scss', `@import '@car';`);
      
      updateImports(testTree, mockContext);
      
      // JS, HTML, and CSS files should not be modified
      expect(testTree.readContent('/test.js')).toContain('@car');
      expect(testTree.readContent('/test.html')).toContain('@car');
      expect(testTree.readContent('/test.css')).toContain('@car');
      // SCSS file should be modified
      expect(testTree.readContent('/test.scss')).toContain('@door');
      expect(testTree.readContent('/test.scss')).not.toContain('@car');
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
        import { Service } from '@car';
        import { Component } from '@angular/core';
        
        const myLibString = 'this contains @car but should not be changed';
        // Comment about @car
        export class TestClass {
          // @car reference in comment
        }
      `);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/mixed.ts');
      expect(content).toContain(`import { Service } from '@door';`);
      expect(content).toContain(`import { Component } from '@angular/core';`);
      // Only imports should be changed, not other occurrences
      expect(content).toContain(`const myLibString = 'this contains @car but should not be changed';`);
      expect(content).toContain(`// Comment about @car`);
      expect(content).toContain(`// @car reference in comment`);
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /mixed.ts');
    });

    it('should handle complex import patterns', () => {
      testTree.create('/complex.ts', `
        import * as MyLib from '@car';
        import { default as DefaultExport } from '@car';
        import MyLibDefault, { Service, Component } from '@car';
      `);
      
      updateImports(testTree, mockContext);
      
      const content = testTree.readContent('/complex.ts');
      expect(content).toContain(`import * as MyLib from '@door';`);
      expect(content).toContain(`import { default as DefaultExport } from '@door';`);
      expect(content).toContain(`import MyLibDefault, { Service, Component } from '@door';`);
      expect(content).not.toContain('@car');
      expect(mockContext.logger.info).toHaveBeenCalledWith('Updated imports in /complex.ts');
    });

    it('should handle nested directory structures', () => {
      testTree.create('/src/app/components/test.ts', `import { Service } from '@car';`);
      testTree.create('/src/lib/utils/helper.ts', `import { Utils } from '@car';`);
      
      updateImports(testTree, mockContext);
      
      expect(testTree.readContent('/src/app/components/test.ts')).toContain(`import { Service } from '@door';`);
      expect(testTree.readContent('/src/lib/utils/helper.ts')).toContain(`import { Utils } from '@door';`);
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
  // const { replaceImportPath } = require('./update-imports');

  it('should replace TypeScript single quote import', () => {
    const input = "import { Foo } from '@car';";
    const output = replaceImportPath(input);
    expect(output).toEqual("import { Foo } from '@door';");
  });

  it('should replace TypeScript double quote import', () => {
    const input = 'import { Bar } from "@car";';
    const output = replaceImportPath(input);
    expect(output).toEqual('import { Bar } from "@door";');
  });

  it('should replace multiple TypeScript imports', () => {
    const input = `import { Foo } from '@car';\nimport { Bar } from "@car";`;
    const output = replaceImportPath(input);
    expect(output).toContain("import { Foo } from '@door';");
    expect(output).toContain('import { Bar } from "@door";');
  });

  it('should replace SCSS @import single quote', () => {
    const input = "@import '@car';";
    const output = replaceImportPath(input);
    expect(output).toEqual("@import '@door';");
  });

  it('should replace SCSS @import double quote', () => {
    const input = '@import "@car";';
    const output = replaceImportPath(input);
    expect(output).toEqual('@import "@door";');
  });

  it('should replace multiple SCSS @import statements', () => {
    const input = `@import '@car';\n@import "@car";`;
    const output = replaceImportPath(input);
    expect(output).toContain("@import '@door';");
    expect(output).toContain('@import "@door";');
  });

  it('should not change unrelated content', () => {
    const input = "const x = '@car'; // not an import";
    const output = replaceImportPath(input);
    expect(output).toEqual(input);
  });
});