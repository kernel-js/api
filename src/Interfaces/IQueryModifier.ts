/**
 *
 *
 * @interface IQueryModifier
 */
export interface IQueryModifier {
  /**
   *
   *
   * @param {Array<string>} includes
   * @return {*}  {Array<string>}
   * @memberof IQueryModifier
   */
  include(includes: Array<string>): Array<string>

  /**
   *
   *
   * @param {string} resource
   * @param {Array<string>} fields
   * @return {*}  {Record<string, string>}
   * @memberof IQueryModifier
   */
  select(resource: string, fields: Array<string>): Record<string, string>

  /**
   *
   *
   * @param {Array<string>} columns
   * @param {('asc' | 'desc')} direction
   * @return {*}  {string[]}
   * @memberof IQueryModifier
   */
  orderBy(columns: Array<string>, direction: 'asc' | 'desc'): string[]

  /**
   *
   *
   * @param {string} key
   * @param {string} value
   * @param {string} [group]
   * @return {*}  {Record<string, string>}
   * @memberof IQueryModifier
   */
  filter(key: string, value: string, group?: string): Record<string, string>
}
