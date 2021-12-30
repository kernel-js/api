import { TypeError } from '@kernel-js/exceptions';
import { IQueryModifier } from '../Interfaces/IQueryModifier';

/**
 *
 *
 * @export
 * @class QueryModifier
 */
export class QueryModifier implements IQueryModifier {
  /**
   *
   *
   * @param {Array<string>} includes
   * @return {*}  {Array<string>}
   * @memberof QueryModifier
   */
  public include(includes: Array<string>): Array<string>
  {
    return [...new Set(includes)];
  }
  
  /**
   *
   *
   * @param {string} group
   * @param {Array<string>} fields
   * @return {*}  {Array<string>}
   * @memberof QueryModifier
   */
  public select(resource: string, fields: Array<string>): Record<string, string>
  {
    let selectFields: Record<string, string> = {};

    selectFields[resource] = fields.toString()
    return selectFields;
  }

  /**
   *
   *
   * @param {Array<string>} columns
   * @param {('asc' | 'desc')} direction
   * @return {*}  {string[]}
   * @memberof QueryModifier
   */
  public orderBy(columns: Array<string>, direction: 'asc' | 'desc'): string[]
  {
    if (!direction.includes('asc') && !direction.includes('desc')) {
      throw new TypeError(`Argument 2 invalid`, 400);
    }

    if (direction === 'desc') {
      return columns.map((column) => `-${column}`);
    }
    
    return columns;
  }

  /**
   *
   *
   * @param {string} key
   * @param {string} value
   * @param {string} [group]
   * @return {*}  {*}
   * @memberof QueryModifier
   */
  public filter(key: string, value: string, group?: string): Record<string, string>
  {
    const groupWithDot = group ? `${group}.` : ''; 

    return { [groupWithDot + key]: value }
  }
}
