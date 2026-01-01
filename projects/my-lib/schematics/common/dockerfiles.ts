import { Rule, SchematicContext, Tree, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';

/**
 * Utility to add Dockerfile and dev.Dockerfile from templates if requested.
 * @param docker Should Dockerfiles be created?
 * @param targetPath Where to place the Dockerfiles (project root)
 * @param templatesRelPath Relative path to the schematic's templates folder
 */
export function addDockerfilesIfRequested(
  docker: boolean | undefined,
  targetPath: string,
  templatesRelPath: string
): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (docker) {
      return mergeWith(
        apply(url(templatesRelPath), [
          template({}),
          move(targetPath),
        ])
      )(tree, context);
    }
    return tree;
  };
}

/**
 * Utility for non-schematic context (plain Tree) to copy Dockerfiles from templates.
 * Used in async/Promise-based rules.
 */
export function copyDockerfilesToTree(
  tree: Tree,
  docker: boolean | undefined,
  targetPath: string,
  dockerfileTemplatePath: string,
  devDockerfileTemplatePath: string
): void {

  if (docker) {
    const dockerfileContent = tree.read(dockerfileTemplatePath);

    if (dockerfileContent) {
      tree.create(`${targetPath}/Dockerfile`, dockerfileContent.toString());
    }

    const devDockerfileContent = tree.read(devDockerfileTemplatePath);

    if (devDockerfileContent) {
      tree.create(`${targetPath}/dev.Dockerfile`, devDockerfileContent.toString());
    }
  }
}
