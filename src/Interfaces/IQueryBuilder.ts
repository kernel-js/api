import { IModel } from "./IModel";
import { IPaginate } from "./IPaginate";

/**
 *
 *
 * @export
 * @interface IQueryBuilder
 */
export interface IQueryBuilder {
  /**
   *
   *
   * @param {string[]} includes
   * @memberof IQueryBuilder
   */
  addIncludes(includes: string[]): void

  /**
   *
   *
   * @param {Record<string, string>} fields
   * @memberof IQueryBuilder
   */
  addFields(fields: Record<string, string>): void

  /**
   *
   *
   * @param {string[]} includes
   * @memberof IQueryBuilder
   */
  addFilters(filters: Record<string, string>): void

  /**
   *
   *
   * @param {string[]} sorts
   * @memberof IQueryBuilder
   */
  addSort(sorts: string[]): void

  /**
   *
   *
   * @param {Paginate} pagination
   * @memberof IQueryBuilder
   */
  addPagination(pagination: IPaginate): void

  /**
   *
   *
   * @return {*}  {string}
   * @memberof IQueryBuilder
   */
  getQuery(): string;

  /**
   *
   *
   * @memberof IQueryBuilder
   */
  resetQuery(): void;
}
