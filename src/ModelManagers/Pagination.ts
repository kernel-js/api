/**
 *
 *
 * @export
 * @class Pagination
 */
export default class Pagination {
  /**
   * Creates an instance of Pagination.
   * @param {*} meta
   * @param {*} attributes
   * @memberof Pagination
   */
  constructor(meta: any, attributes: any) {
    this.meta = meta;
    this.attributes = attributes;
  }

  /**
   *
   *
   * @private
   * @type {Record<string, any>}
   * @memberof Pagination
   */
  private meta!: Record<string, any>;

  /**
   *
   *
   * @private
   * @type {Array<any>}
   * @memberof Pagination
   */
  private attributes!: Array<any>;
}
