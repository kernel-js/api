
import { isEmpty, get } from 'lodash';
import { IPaginate, IQueryBuilder } from '../Interfaces/index';

/**
 *
 *
 * @export
 * @class QueryBuilder
 * @implements {IQueryBuilder}
 */
export class QueryBuilder implements IQueryBuilder {
  //#region variables
  /**
   *
   *
   * @type {string}
   * @memberof QueryBuilder
   */
  private _query: string = '';

  /**
   *
   *
   * @type {Array<string>}
   * @memberof QueryBuilder
   */
  private _includes: Array<string> = [];

  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof QueryBuilder
   */
  private _sort: string[] = [];

  /**
   *
   *
   * @type {Array<Record<string, string>>}
   * @memberof QueryBuilder
   */
  private _filters: Array<Record<string, string>> = [];

  /**
   *
   *
   * @type {Array<string>}
   * @memberof QueryBuilder
   */
  private _fields: Record<string, string>[] = [];

  /**
   *
   *
   * @type {Paginate}
   * @memberof QueryBuilder
   */
  private _pagination!: IPaginate;
  //#endregion

  //#region add methods
  /**
   *
   *
   * @param {string[]} includes
   * @memberof QueryBuilder
   */
  public addIncludes(includes: string[]): void {
    this._includes = this._includes.concat(includes);
  }

  /**
   *
   *
   * @param {Record<string, string>} fields
   * @memberof QueryBuilder
   */
  public addFields(fields: Record<string, string>): void {
    this._fields = this._fields.concat([fields]);
  }

  /**
   *
   *
   * @param {Record<string, string>} filters
   * @memberof QueryBuilder
   */
  public addFilters(filters: Record<string, string>): void {
    this._filters = this._filters.concat([filters]);
  }

  /**
   *
   *
   * @param {string[]} sorts
   * @memberof QueryBuilder
   */
  public addSort(sorts: string[]): void {
    this._sort = this._sort.concat(sorts);
  }

  /**
   *
   *
   * @param {IPaginate} pagination
   * @memberof QueryBuilder
   */
  public addPagination(pagination: IPaginate): void {
    this._pagination = pagination;
  }
  //#endregion

  /**
   *
   *
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
  public getQuery(): string {
    this._query = '';

    this._query += this._resolveIncludes(this._includes);
    this._query += this._resolveFields(this._fields);
    this._query += this._resolveFilters(this._filters);
    this._query += this._resolvePagination(this._pagination);
    this._query += this._resolveSort(this._sort);

    if (this._query.length) {
      return `?${encodeURI(this._query)}`;
    }

    return this._query;
  }

  /**
   *
   *
   * @memberof QueryBuilder
   */
  public resetQuery(): void {
    this._query = '';
    this._includes = [];
    this._sort = [];
    this._filters = [];
    this._fields = [];
    this._pagination = {number: NaN, size: NaN};
  }

  /**
   *
   *
   * @private
   * @param {string} query
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
  private _setAmpersand(query: string): string {
    if (query) {
      return '&'
    }
    return '';
  }

  //#region resolved Methods
  /**
   *
   *
   * @param {*} fields
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
  private _resolveFields(fields: Record<string, string>[] = []): string {
    let resolveFields = '';

    fields.map((field, index) => {
      const property = Object.getOwnPropertyNames(field)[0];
      resolveFields += `${(index >= 1 ? '&' : '')}fields[${property}]=${field[property].toString()}`;
    })

    if (!isEmpty(resolveFields)) {
      return `${this._setAmpersand(this._query)}${resolveFields}`;
    }

    return ''
  }

  /**
   *
   *
   * @param {Array<Record<string, string>>} filters
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
   private _resolveFilters(filters: Array<Record<string, string>> = []): string {
    let resolveFilters = '';

    filters.map((filter: Record<string, string>, index: number) => {
      const property = Object.getOwnPropertyNames(filter)[0];
      resolveFilters += `${(index >= 1 ? '&' : '')}filter[${property}]=${filter[property].toString()}`;
    })

    if (!isEmpty(resolveFilters)) {
      return `${this._setAmpersand(this._query)}${resolveFilters}`;
    }

    return ''
  }

  /**
   *
   *
   * @param {Array<string>} includes
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
  private _resolveIncludes(includes: Array<string> = []): string {
    if (!isEmpty(includes)) {
      return `${this._setAmpersand(this._query)}include=${includes.toString()}`;
    }

    return ''
  }

  /**
   *
   *
   * @param {IPaginate} pagination
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
  private _resolvePagination(pagination: IPaginate): string {
    if (get(pagination, 'number', false) && get(pagination, 'size', false)) {
      return `${this._setAmpersand(this._query)}page[size]=${pagination.size}&page[number]=${pagination.number}`;
    }
    
    return ''
  }

  /**
   *
   *
   * @param {string} sort
   * @return {*}  {string}
   * @memberof QueryBuilder
   */
  private _resolveSort(sort: string[] = []): string {
    if (!isEmpty(sort)) {
      return `${this._setAmpersand(this._query)}sort=${sort.toString()}`;
    }

    return ''
  }
  #end
}
