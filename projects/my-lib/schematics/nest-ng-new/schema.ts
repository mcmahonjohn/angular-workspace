import { BaseNgNewSchema } from "../common/base-ng-new-schema";

export interface NestNgNewOptions extends BaseNgNewSchema {

  /**
   * Enable strict mode for the new project.
   */
  strict?: boolean;

  /**
   * Skip git repository initialization.
   */
  skipGit?: boolean;

  /**
   * Package manager to use for installing dependencies.
   * Only 'npm' is supported by this schematic.
   */
  packageManager?: 'npm';

  /**
   * Programming language for the new project. Always 'typescript'.
   */
  language?: 'typescript';

  /**
   * Additional schematic collections to register with the Nest CLI.
   */
  schematicCollections?: string[];

}
