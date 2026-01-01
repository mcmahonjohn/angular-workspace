export interface BaseNgNewSchema {
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
   * The version of the CLI to use.
   */
  version?: string;

  /**
   * Create Dockerfile and dev.Dockerfile for the Angular app?
   */
  docker?: boolean;
}