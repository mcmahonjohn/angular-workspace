import { BaseNgNewSchema } from "../common/base-ng-new-schema";

export interface NgNewSchema extends BaseNgNewSchema{

  /**
   * Create a workspace without any testing frameworks.
   */
  minimal?: boolean;

  /**
   * Generate a routing module for the initial project.
   */
  routing?: boolean;

}