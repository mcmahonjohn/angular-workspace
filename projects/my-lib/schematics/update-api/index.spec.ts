import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import { default as updateApi } from './index';
import * as path from 'path';

describe('update-api schematic', () => {
  it('applies component and template replacements', () => {
    const tree = new UnitTestTree(Tree.empty());
    tree.create('src/app/sample.component.ts', `export class SampleComponent { oldInput = true; }`);
    tree.create('src/app/sample.component.html', `<div class="app-old">{{ oldInput }}</div>`);

    const rule = updateApi({} as any);
    rule(tree, { logger: { info: () => {} } } as any);

    const ts = tree.readContent('src/app/sample.component.ts');
    const html = tree.readContent('src/app/sample.component.html');

    expect(ts).toContain('newInput');
    expect(html).toContain('app-new');
  });

  it('applies replacements for new filename style (dash separator)', () => {
    const tree = new UnitTestTree(Tree.empty());
    tree.create('src/app/sample-component.ts', `export class SampleComponent { oldInput = true; }`);
    tree.create('src/app/sample-component.html', `<div class="app-old">{{ oldInput }}</div>`);

    const rule = updateApi({} as any);
    rule(tree, { logger: { info: () => {} } } as any);

    const ts = tree.readContent('src/app/sample-component.ts');
    const html = tree.readContent('src/app/sample-component.html');

    expect(ts).toContain('newInput');
    expect(html).toContain('app-new');
  });

  it('applies replacements when filename omits the type segment (e.g. sample.ts)', () => {
    const tree = new UnitTestTree(Tree.empty());
    tree.create('src/app/sample.ts', `export class SampleComponent { oldInput = true; }`);
    tree.create('src/app/sample.html', `<div class="app-old">{{ oldInput }}</div>`);

    const rule = updateApi({} as any);
    rule(tree, { logger: { info: () => {} } } as any);

    const ts = tree.readContent('src/app/sample.ts');
    const html = tree.readContent('src/app/sample.html');

    expect(ts).toContain('newInput');
    expect(html).toContain('app-new');
  });
});
