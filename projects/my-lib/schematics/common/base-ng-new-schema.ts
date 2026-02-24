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
   * The name of the workspace and initial project.
   */
  name: string;

  /**
   * Skip git repository initialization.
   */
  skipGit?: boolean;

  /**
   * The version of the CLI to use.
   */
  version?: string;

}