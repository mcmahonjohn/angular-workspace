import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { updateFontAwesomeDeps } from './update-fontawesome-deps';
import * as fs from 'fs';
import * as path from 'path';

describe('updateFontAwesomeDeps', () => {
  let tree: UnitTestTree;
  let mockContext: SchematicContext;
  const pkgPath = '/package.json';
  const staticPkgPath = path.join(__dirname, 'static', 'package.example.json');
  const examplePkg = fs.readFileSync(staticPkgPath, 'utf-8');

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());
    tree.create(pkgPath, examplePkg);
    mockContext = {
      logger: {
        info: jasmine.createSpy('info')
      }
    } as any;
  });

  it('should upgrade all relevant FontAwesome deps to the correct versions', () => {
    updateFontAwesomeDeps(tree, mockContext);
    const updated = JSON.parse(tree.readText(pkgPath));
    expect(updated.dependencies['@fortawesome/angular-fontawesome']).toBe('^0.15.0');
    expect(updated.dependencies['@fortawesome/fontawesome-svg-core']).toBe('^6.5.2');
    expect(updated.dependencies['@fortawesome/free-brands-svg-icons']).toBe('^6.5.2');
    expect(updated.dependencies['@fortawesome/free-regular-svg-icons']).toBe('^6.5.2');
    expect(updated.dependencies['@fortawesome/free-solid-svg-icons']).toBe('^6.5.2');
    expect(updated.devDependencies['@fortawesome/angular-fontawesome']).toBe('^0.15.0');
    expect(updated.devDependencies['@fortawesome/fontawesome-svg-core']).toBe('^6.5.2');
    expect(updated.peerDependencies['@fortawesome/angular-fontawesome']).toBe('^0.15.0');
  });

  it('should log an info message for each upgraded dependency', () => {
    updateFontAwesomeDeps(tree, mockContext);
    const logger = mockContext.logger.info;
    expect(logger).toHaveBeenCalledWith(jasmine.stringMatching('Upgraded @fortawesome/angular-fontawesome to \\^0.15.0'));
    expect(logger).toHaveBeenCalledWith(jasmine.stringMatching('Upgraded @fortawesome/fontawesome-svg-core to \\^6.5.2'));
    expect(logger).toHaveBeenCalledWith(jasmine.stringMatching('Upgraded @fortawesome/free-brands-svg-icons to \\^6.5.2'));
    expect(logger).toHaveBeenCalledWith(jasmine.stringMatching('Upgraded @fortawesome/free-regular-svg-icons to \\^6.5.2'));
    expect(logger).toHaveBeenCalledWith(jasmine.stringMatching('Upgraded @fortawesome/free-solid-svg-icons to \\^6.5.2'));
  });

  it('should do nothing if package.json does not exist', () => {
    tree.delete(pkgPath);
    updateFontAwesomeDeps(tree, mockContext);
    expect(tree.exists(pkgPath)).toBe(false);
  });
});
