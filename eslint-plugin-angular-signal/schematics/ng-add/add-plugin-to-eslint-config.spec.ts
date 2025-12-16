import { addPluginToEslintConfig } from './add-plugin-to-eslint-config';
import { Tree } from '@angular-devkit/schematics';

describe('addPluginToEslintConfig', () => {
  const configPath = '/eslint.config.mjs';

  it('should add angular-signal to plugins array if not present', () => {
    const initialConfig = `export default {\n  plugins: [],\n  rules: {}\n};`;
    const tree = Tree.empty();
    tree.create(configPath, initialConfig);
    const context = { logger: { info: jasmine.createSpy(), warn: jasmine.createSpy() } } as any;
    const rule = addPluginToEslintConfig(configPath);
    rule(tree, context);
    const updated = tree.read(configPath)!.toString('utf-8');
    expect(updated).toContain("'angular-signal'");
  });

  it('should not add if already present', () => {
    const initialConfig = `export default {\n  plugins: ['angular-signal'],\n  rules: {}\n};`;
    const tree = Tree.empty();
    tree.create(configPath, initialConfig);
    const context = { logger: { info: jasmine.createSpy(), warn: jasmine.createSpy() } } as any;
    const rule = addPluginToEslintConfig(configPath);
    rule(tree, context);
    const updated = tree.read(configPath)!.toString('utf-8');
    expect(updated.match(/'angular-signal'/g)?.length).toBe(1);
  });

  it('should warn if plugins array not found', () => {
    const initialConfig = `export default {\n  rules: {}\n};`;
    const tree = Tree.empty();
    tree.create(configPath, initialConfig);
    const context = { logger: { info: jasmine.createSpy(), warn: jasmine.createSpy() } } as any;
    const rule = addPluginToEslintConfig(configPath);
    rule(tree, context);
    expect(context.logger.warn).toHaveBeenCalled();
  });
});
