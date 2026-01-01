export interface BaseNgNewSchema {

  /**
   * The directory name to create the workspace in.
   */
  directory?: string;

  /**
   * Create Dockerfile and dev.Dockerfile for the Angular app?
   */
  docker?: boolean;

  /**
   * Run schematic in dry-run mode (no files written to disk).
   */
  dryRun?: boolean;

  /**
   * The name of the workspace and initial project.
   */
  name: string;

  /**
   * Additional schematic collections to register with the Nest CLI.
   */
  schematicCollections?: string[];

  /**
   * Skip git repository initialization.
   */
  skipGit?: boolean;

  /**
   * The version of the CLI to use.
   */
  version?: string;

}