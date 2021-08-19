import { IModel } from "./IModel";
import { IJsonApiResponse } from "./jsonApiStructure";

/**
 *
 *
 * @export
 * @interface IHandling
 */
export interface IHandling {
  /**
   *
   *
   * @template T
   * @param {T} that
   * @param {IJsonApiResponse} response
   * @return {*}  {(T | T[])}
   * @memberof IHandling
   */
  hydrate<T extends IModel>(that: T, response: IJsonApiResponse): T | T[];

  /**
   *
   *
   * @param {IJsonApiResponse} response
   * @return {*}  {Record<string, any>}
   * @memberof IHandling
   */
  unserialize(response: IJsonApiResponse): Record<string, any>;

  /**
   *
   *
   * @param {IModel} model
   * @return {*}  {*}
   * @memberof IHandling
   */
  serialize(model: IModel): any;
}
