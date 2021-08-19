import { ILinks } from "./ILinks";
import { IMeta } from "./IMeta";
import { IResponseItem } from "./IResponseItem";

/**
 *
 *
 * @export
 * @interface IJsonApiResponse
 */
export interface IJsonApiResponse {
  /**
   *
   *
   * @type {(IResponseItem | IResponseItem[])}
   * @memberof IJsonApiResponse
   */
  data: IResponseItem | IResponseItem[];

  /**
   *
   *
   * @type {IResponseItem[]}
   * @memberof IJsonApiResponse
   */
  included?: IResponseItem[];

  /**
   *
   *
   * @type {ILinks}
   * @memberof IJsonApiResponse
   */
  links?: ILinks;

  /**
   *
   *
   * @type {IMeta}
   * @memberof IJsonApiResponse
   */
  meta?: IMeta;
}
