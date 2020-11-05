
import { isEmpty, forOwn, isObject, isNull, get } from 'lodash';
import { Paginate } from '../Interfaces/index';
import { Model } from '../ModelManagers/Model';

/**
 *
 */
export default class QueryBuilder {
  /**
   * @type {string}
   */
  public query: string = '';

  /**
   * @type {Array<string>}
   */
  public includes: Array<string> = [];

  /**
   * @type {string}
   */
  public sort!: string;

  /**
   * @type {Array<Record<string, string>>}
   */
  public filters: Array<Record<string, string>> = [];

  /**
   * @type {Array<string>}
   */  
  public fields: Array<string> = [];

  /**
   * @type {Paginate}
   */
  public pagination!: Paginate;

  /**
   *
   */
  constructor() {}

  /**
   * @param  {Model} self
   * @returns string
   */
  public getQuery(self: Model): string {

    this.query += this.resolveIncludes(self.queryBuilder.includes);
    this.query += this.resolveFields(self.queryBuilder.fields);
    this.query += this.resolveFilters(self.queryBuilder.filters);
    this.query += this.resolvePagination(self.queryBuilder.pagination);
    this.query += this.resolveSort(self.queryBuilder.sort);

    if (this.query.length) {
      self.queryBuilder.query = `?${encodeURI(this.query)}`;
    }
    
    return self.queryBuilder.query;
  }

  /**
   * @param  {string} query
   */
  public setAmpersand(query: string) {
    if (query) {
      return '&'
    }
    return '';
  }

  /**
   * @param  {Model} self
   */
  public resetQuery(self: Model) {
    self.queryBuilder.query = '';
    self.queryBuilder.includes = [];
    self.queryBuilder.sort = '';
    self.queryBuilder.filters = [];
    self.queryBuilder.fields = [];
    self.queryBuilder.pagination = {number: NaN, size: NaN};
  }

  /**
   * @param  {any} fields
   * @returns string
   */
  public resolveFields(fields: any): string {
    let resolveFields = '';

    forOwn(fields, (fields, resource) => {
      resolveFields += `fields[${resource}]=${fields.toString()}`;
    });

    if (!isEmpty(resolveFields)) {
      return `${this.setAmpersand(this.query)}${resolveFields}`;
    }

    return ''
  }

  /**
   * @param  {Array<Record<string, string>>} filters
   * @returns string
   */
  public resolveFilters(filters: Array<Record<string, string>>): string {
    let resolveFilters = '';

    filters.map((filter: Record<string, string>, index: number) => {
      const property = Object.getOwnPropertyNames(filter)[0];
      resolveFilters += `${(index >= 1 ? '&' : '')}filter[${property}]=${filter[property].toString()}`;
    })

    if (!isEmpty(resolveFilters)) {
      return `${this.setAmpersand(this.query)}${resolveFilters}`;
    }

    return ''
  }

  /**
   * @param  {Array<string>} includes
   * @returns string
   */
  public resolveIncludes(includes: Array<string>): string {
    if (!isEmpty(includes)) {
      return `${this.setAmpersand(this.query)}include=${includes.toString()}`;
    }

    return ''
  }

  /**
   * @param  {Paginate} pagination
   * @returns string
   */
  public resolvePagination(pagination: Paginate): string {
    if (get(pagination, 'number', false) && get(pagination, 'size', false)) {
      return `${this.setAmpersand(this.query)}page[size]=${pagination.size}&page[number]=${pagination.number}`;
    }
    
    return ''
  }

  /**
   * @param  {string} sort
   * @returns string
   */
  public resolveSort(sort: string): string {
    if (!isEmpty(sort)) {
      return `${this.setAmpersand(this.query)}sort=${sort}`;
    }

    return ''
  }
}
