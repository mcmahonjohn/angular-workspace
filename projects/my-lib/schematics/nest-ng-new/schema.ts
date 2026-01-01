export interface Schema {

  /**
   * Run schematic in dry-run mode (no files written to disk).
   */
  dryRun?: boolean;

  /**
   * The name of the new NestJS project.
   */
  name: string;

  /**
   * The version of the Nest CLI to use.
   */
  version?: string;

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
}
