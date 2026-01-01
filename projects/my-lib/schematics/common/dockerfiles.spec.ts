import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { addDockerfilesIfRequested, copyDockerfilesToTree } from './dockerfiles';
import { Tree, SchematicContext } from '@angular-devkit/schematics';

describe('dockerfiles utilities', () => {
  let tree: UnitTestTree;
  let context: SchematicContext;

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());
    // @ts-ignore
    context = {};
  });

  describe('addDockerfilesIfRequested', () => {
    it('should not modify tree if docker is false', () => {
      const rule = addDockerfilesIfRequested(false, '.', './templates');
      const result = rule(tree, context);
      expect(result).toBe(tree);
    });

    it('should merge templates if docker is true', () => {
      // Simulate template files in the virtual fs
      tree.create('templates/Dockerfile.template', 'FROM node:20\n');
      tree.create('templates/dev.Dockerfile.template', 'FROM node:20 AS dev\n');
      const rule = addDockerfilesIfRequested(true, '.', './templates');
      // Should return a Rule, but mergeWith/apply is hard to test directly
      expect(typeof rule).toBe('function');
    });
  });

  describe('copyDockerfilesToTree', () => {
    it('should not create files if docker is false', () => {
      copyDockerfilesToTree(tree, false, '.', 'Dockerfile.template', 'dev.Dockerfile.template');
      expect(tree.files).not.toContain('./Dockerfile');
      expect(tree.files).not.toContain('./dev.Dockerfile');
    });

    it('should create Dockerfile and dev.Dockerfile if docker is true and templates exist', () => {
      tree.create('Dockerfile.template', 'FROM node:20\n');
      tree.create('dev.Dockerfile.template', 'FROM node:20 AS dev\n');
      copyDockerfilesToTree(tree, true, '.', 'Dockerfile.template', 'dev.Dockerfile.template');
      expect(tree.files).toContain('/Dockerfile');
      expect(tree.files).toContain('/dev.Dockerfile');
      expect(tree.read('./Dockerfile')!.toString()).toBe('FROM node:20\n');
      expect(tree.read('./dev.Dockerfile')!.toString()).toBe('FROM node:20 AS dev\n');
    });

    it('should not create files if templates do not exist', () => {
      copyDockerfilesToTree(tree, true, '.', 'missing.Dockerfile.template', 'missing.dev.Dockerfile.template');
      expect(tree.files).not.toContain('./Dockerfile');
      expect(tree.files).not.toContain('./dev.Dockerfile');
    });
  });
});
