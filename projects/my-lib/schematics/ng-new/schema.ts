export interface Schema {
  /**
   * Run schematic in dry-run mode (no files written to disk).
   */
  dryRun?: boolean;
  /**
   * The name of the workspace and initial project.
   */
  name: string;

  /**
   * The directory name to create the workspace in.
   */
  directory?: string;

  /**
   * The version of the Angular CLI to use.
   */
  version?: string;

  /**
   * Create a workspace without any testing frameworks.
   */
  minimal?: boolean;

  /**
   * Generate a routing module for the initial project.
   */
  routing?: boolean;

  /**
   * Create Dockerfile and dev.Dockerfile for the Angular app?
   */
  docker?: boolean;
}