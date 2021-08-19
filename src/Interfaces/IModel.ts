/**
 * Model interface
 */
export interface IModel {
  /**
   *
   *
   * @type {(string | number)}
   * @memberof IModel
   */
  id: string | number;

  /**
   *
   *
   * @type {string}
   * @memberof IModel
   */
  type: string;

  /**
   *
   *
   * @type {string}
   * @memberof IModel
   */
  attributes: any;

  /**
   *
   *
   * @type {*}
   * @memberof IModel
   */
  relationships: any
  
  /**
   *
   *
   * @type {string}
   * @memberof IModel
   */
  readonly resourceName: string;
  
  /**
   *
   *
   * @type {string}
   * @memberof IModel
   */
  readonly baseUrl: string;
  
  /**
   *
   *
   * @type {string[]}
   * @memberof IModel
   */
  readonly fields: string[];
  
  /**
   *
   *
   * @type {string[]}
   * @memberof IModel
   */
  readonly relationshipNames: string[];
}