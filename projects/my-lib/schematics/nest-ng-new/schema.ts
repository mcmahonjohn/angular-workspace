import { BaseNgNewSchema } from "../common/base-ng-new-schema";

export interface NestNgNewOptions extends BaseNgNewSchema {

  /**
   * Programming language for the new project. Always 'typescript'.
   */
  language?: 'typescript';

}
