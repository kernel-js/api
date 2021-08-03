/**
 *
 *
 * @export
 * @interface IPagination
 */
export interface IPagination {
  /**
   *
   *
   * @type {number}
   * @memberof IPagination
   */
  total: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPagination
   */
  count: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPagination
   */
  per_page: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPagination
   */
  current_page: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPagination
   */
  total_pages: number;
}