import { Pagination } from './Pagination';
import { TypeError } from '@kernel-js/exceptions';
import { IRequestConfig, IHandling, IModel, IQueryModifier, IQueryBuilder, IJsonApiResponse } from '../Interfaces/index';


/**
 *
 *
 * @export
 * @abstract
 * @class Model
 * @implements {IModel}
 */
export abstract class Model implements IModel {
  /**
   *
   *
   * @type {Config}
   * @memberof Model
   */
  private _config!: IRequestConfig;

  /**
   *
   *
   * @type {(number | string)}
   * @memberof Model
   */
  public id!: number | string;

  /**
   *
   *
   * @type {string}
   * @memberof Model
   */
  public type!: string;

  /**
   *
   *
   * @type {*}
   * @memberof Model
   */
  public attributes: any = {};

  /**
   *
   *
   * @type {*}
   * @memberof Model
   */
  public relationships: any = {};

  /**
   *
   *
   * @readonly
   * @abstract
   * @type {string}
   * @memberof Model
   */
  public abstract readonly resourceName: string

  /**
   *
   *
   * @readonly
   * @abstract
   * @type {string}
   * @memberof Model
   */
  public abstract readonly baseUrl: string;

  /**
   *
   *
   * @readonly
   * @abstract
   * @type {Array<string>}
   * @memberof Model
   */
  public abstract readonly fields: Array<string>;

  /**
   *
   *
   * @readonly
   * @abstract
   * @type {Array<string>}
   * @memberof Model
   */
  public abstract readonly relationshipNames: Array<string>;

  /**
   * Creates an instance of Model.
   * @param {IQueryBuilder} queryBuilder
   * @param {IQueryModifier} queryModifier
   * @param {IHandling} handling
   * @memberof Model
   */
  constructor(
    protected queryBuilder: IQueryBuilder,
    protected queryModifier: IQueryModifier,
    protected handling: IHandling
    ){}

  /**
   *
   *
   * @param {IRequestConfig} config
   * @return {*}  {this}
   * @memberof Model
   */
  public setConfig(config: IRequestConfig): this {
    this._config = {
      method: config.method,
      url: `${config.url}${this.queryBuilder.getQuery()}`,
      data: config.data,
      headers: config.headers,
    }

    this.queryBuilder.resetQuery();

    return this;
  }

  /**
   *
   *
   * @protected
   * @return {*}  {string}
   * @memberof Model
   */
  protected resourceUrl(): string {
    return `${this.baseUrl}/${this.resourceName}`
  }

  /**
   *
   *
   * @protected
   * @abstract
   * @param {Config} config
   * @return {*}  {Promise<any>}
   * @memberof Model
   */
  protected abstract request<T = any>(config: IRequestConfig): Promise<T>;

  //#region Get Response
  /**
   *
   *
   * @param {boolean} [hydrate=true]
   * @return {*}  {Promise<any>}
   * @memberof Model
   */
  public async getEntity(): Promise<this | this[]> {
    const response = await this._getResponse();

    return this.handling.hydrate(this, response);
  }

  /**
   *
   *
   * @return {*}  {Promise<Record<string, any>>}
   * @memberof Model
   */
  public async getContent(): Promise<Record<string, any>> {
    const response = await this._getResponse();

    return this.handling.unserialize(response);
  }

  /**
   *
   *
   * @return {*}  {string}
   * @memberof Model
   */
  public getUrl(): string {
    return this._config.url;
  }

  /**
   *
   *
   * @return {*}  {IRequestConfig}
   * @memberof Model
   */
  public getUrlConfig(): IRequestConfig {
    return this._config;
  }

  /**
   *
   *
   * @private
   * @return {*}  {Promise<IJsonApiResponse>}
   * @memberof Model
   */
  private async _getResponse(): Promise<IJsonApiResponse> {
    return this.request(this._config)
      .then( response => Promise.resolve(response.data))
      .catch( error => Promise.reject(error));
  }
  //#endregion

  //#region URL Modifiers
  /**
   *
   *
   * @return {*}  {this}
   * @memberof Model
   */
  public all(): this {
    this.setConfig({ method: 'GET', url: `${this.resourceUrl()}`})

    return this;
  }

  /**
   *
   *
   * @return {*}  {this}
   * @memberof Model
   */
  public search(): this {
    this.setConfig({ method: 'GET', url: `${this.resourceUrl()}/search`})

    return this;
  }

  /**
   *
   *
   * @param {(number | string)} id
   * @return {*}  {this}
   * @memberof Model
   */
  public find(id: number | string): this {
    if (!id) {
      throw new TypeError(`Id argument is required.`, 400)
    }

    if (typeof id !== 'number' && typeof id !== 'string') {
      throw new TypeError(`Argument 1 passed must be of the type number or string, ${typeof id} given`, 422);
    }

    this.setConfig({ method: 'GET', url: `${this.resourceUrl()}/${id}`})

    return this;
  }

  /**
   *
   *
   * @param {Array<IModel>} entities
   * @return {*}  {this}
   * @memberof Model
   */
  public attach(entities: Array<IModel>): this {
    const config = this._mountRelationships(entities);

    config.method = 'PATCH';

    this.setConfig(config);

    return this;
  }

  /**
   *
   *
   * @param {Array<IModel>} entities
   * @return {*}  {this}
   * @memberof Model
   */
  public detach(entities: Array<IModel>): this {
    const config = this._mountRelationships(entities);

    config.method = 'PATCH';
    config.data = JSON.stringify({data: []});

    this.setConfig(config);

    return this;
  }

  /**
   *
   *
   * @param {Array<IModel>} entities
   * @return {*}  {this}
   * @memberof Model
   */
  public createPivot(entities: Array<IModel>): this {
    const config = this._mountRelationships(entities);

    config.method = 'POST';

    this.setConfig(config);

    return this;
  }

  /**
   *
   *
   * @param {Array<IModel>} entities
   * @return {*}  {this}
   * @memberof Model
   */
  public deletePivot(entities: Array<IModel>): this {
    const config = this._mountRelationships(entities);

    config.method = 'DELETE';

    this.setConfig(config);

    return this;
  }

  /**
   *
   *
   * @param {(number | string)} [id]
   * @return {*}  {this}
   * @memberof Model
   */
  public save(id?: number | string): this {

    this.id = id || this.id; // Preference parameter

    if (typeof this.id !== 'string' && typeof this.id !== 'number' && typeof this.id !== 'undefined') {
      throw new TypeError(`Argument 1 passed must be of the type number or string, ${typeof this.id} given.`, 422)
    }

    if (this.id) {
      this.setConfig({
        method: 'PUT',
        url: `${this.resourceUrl()}/${this.id}`,
        data: this.handling.serialize(this)
      });
    } else {
      this.setConfig({
        method: 'POST',
        url: `${this.resourceUrl()}`,
        data: this.handling.serialize(this)
      });
    }

    return this;
  }

  /**
   *
   *
   * @return {*}  {this}
   * @memberof Model
   */
  public create(): this {
    return this.save();
  }

  /**
   *
   *
   * @param {(number | string)} id
   * @return {*}  {this}
   * @memberof Model
   */
  public update(id: number | string): this {
    if (!id) {
      throw new TypeError(`Id argument is required.`, 400)
    }

    if (typeof id !== 'number' && typeof id !== 'string') {
      throw new TypeError(`Argument 1 passed must be of the type number or string, ${typeof id} given.`, 422);
    }

    return this.save(id);
  }

  /**
   *
   *
   * @param {(number | string)} [id]
   * @return {*}  {this}
   * @memberof Model
   */
  public delete(id?: number | string): this {

    this.id = id || this.id; // Preference parameter

    if (!this.id) {
      throw new TypeError(`Id argument is required in model or passed as parameter.`, 400)
    }

    if (typeof this.id !== 'number' && typeof this.id !== 'string') {
      throw new TypeError(`Argument 1 passed must be of the type number or string, ${typeof this.id} given.`, 422);
    }

    this.setConfig({
      method: 'DELETE',
      url: `${this.resourceUrl()}/${this.id}`
    });

    return this;
  }

  /**
   *
   *
   * @param {number} perPage
   * @param {number} page
   * @return {*}  {Promise<any>}
   * @memberof Model
   */
  public paginate(perPage: number, page: number): Promise<any> {
    if (!perPage || !page) {
      throw new TypeError(`Arguments PerPage/Page is required.`, 400)
    }

    if (typeof perPage !== 'number') {
      throw new TypeError(`Argument 1 passed must be of the type number, ${typeof this.id} given.`, 422);
    }

    if (typeof page !== 'number') {
      throw new TypeError(`Argument 2 passed must be of the type number, ${typeof this.id} given.`, 422);
    }

    this.queryBuilder.addPagination({
      size: perPage,
      number: page
    })

    this.setConfig({
      method: 'GET',
      url: `${this.resourceUrl()}${this.queryBuilder.getQuery()}`
    });

    return new Promise((resolve, reject) => {
      this.request(this._config)
        .then( response => {
          const pagination = response.data.meta?.pagination;
          const attributes = (response.data) ? this.handling.unserialize(response.data) : response;

          resolve(new Pagination(pagination, attributes));
        })
        .catch( response => reject(response));
    })
  }

  /**
   *
   *
   * @private
   * @param {...Array<IModel>} entities
   * @memberof Model
   */
  private _mountRelationships<T extends IModel>(entities: Array<T>): IRequestConfig {
    const type = entities[0]?.resourceName;

    if (!type || type.length < 1) {
      throw new TypeError(`The 1 argument passed must not be Empty and must be of type Array, ${typeof type} given.`, 422);
    }

    if (entities.some((entity) => entity.resourceName !== type)) {
      throw new TypeError(`The entities must be of the same type.`, 422);
    }

    this.relationships['data'] = entities.map((entity) => {
      return {
        type: entity.resourceName.toLowerCase(),
        id: entity.id,
      };
    });

    return {
      url: `${this.resourceUrl()}/${this.id}/relationships/${type.toLowerCase()}`,
      data: this.handling.serialize(this)
    };
  }
  //#endregion

  //#region Query Modifiers
  /**
   *
   *
   * @param {...Array<string>} includes
   * @return {*}  {this}
   * @memberof Model
   */
  public with(...includes: Array<string>): this {
    this.queryBuilder.addIncludes(this.queryModifier.include(includes))
    return this;
  }

  /**
   *
   *
   * @param {string} resource
   * @param {...Array<string>} fields
   * @return {*}  {this}
   * @memberof Model
   */
  public selectResource(resource: string, ...fields: Array<string>): this {
    this.queryBuilder.addFields(this.queryModifier.select(resource, fields));
    return this;
  }

  /**
   *
   *
   * @param {...Array<string>} fields
   * @return {*}  {this}
   * @memberof Model
   */
  public select(...fields: Array<string>): this {
    this.queryBuilder.addFields(this.queryModifier.select(this.resourceName, fields));
    return this;
  }

  /**
   *
   *
   * @param {...Array<string>} column
   * @return {*}  {this}
   * @memberof Model
   */
  public orderByAsc(...column: Array<string>): this {
    this._orderBy(column, 'asc');
    return this;
  }

  /**
   *
   *
   * @param {...Array<string>} column
   * @return {*}  {this}
   * @memberof Model
   */
  public orderByDesc(...column: Array<string>): this {
    this._orderBy(column, 'desc');
    return this;
  }

  /**
   *
   *
   * @param {string} key
   * @param {string} value
   * @param {string} [group]
   * @return {*}  {this}
   * @memberof Model
   */
  public where(key: string, value: string, group?: string): this {
    this.queryBuilder.addFilters(this.queryModifier.filter(key, value, group));
    return this;
  }

  /**
   *
   *
   * @param {string} value
   * @return {*}  {this}
   * @memberof Model
   */
  public limit(value: string): this {
    this.where('limit', value);
    return this;
  }

  /**
   *
   *
   * @private
   * @param {Array<string>} column
   * @param {('asc' | 'desc')} direction
   * @return {*}  {this}
   * @memberof Model
   */
  private _orderBy(column: Array<string>, direction: 'asc' | 'desc'): this {
    this.queryBuilder.addSort(this.queryModifier.orderBy(column, direction));
    return this;
  }
  //#endregion
}
