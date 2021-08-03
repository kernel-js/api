import { ILinks } from "./ILinks";

/**
 *
 *
 * @export
 * @interface IResponseItem
 */
export interface IResponseItem {
  /**
   *
   *
   * @type {(string | number)}
   * @memberof IResponseItem
   */
  id: string | number,

  /**
   *
   *
   * @type {string}
   * @memberof IResponseItem
   */
  type: string,

  /**
   *
   *
   * @type {Record<string, any>}
   * @memberof IResponseItem
   */
  attributes: Record<string, any>

  /**
   *
   *
   * @type {({ [P in keyof string]: { id: number | string, type: string } })}
   * @memberof IResponseItem
   */
  relationships?: { [P in keyof string]: {  id: number | string, type: string } }

  /**
   *
   *
   * @type {ILinks}
   * @memberof IResponseItem
   */
  links?: ILinks;
}
