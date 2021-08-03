/**
 *
 *
 * @export
 * @class Pagination
 */
export class Pagination {
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
   * @public
   * @type {Record<string, any>}
   * @memberof Pagination
   */
  public meta!: Record<string, any>;

  /**
   *
   *
   * @public
   * @type {Array<any>}
   * @memberof Pagination
   */
  public attributes!: Array<any>;
}
