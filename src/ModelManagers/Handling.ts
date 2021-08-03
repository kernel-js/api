import { IModel, IHandling, IJsonApiResponse } from '../Interfaces/index';
import { clone, isUndefined, forEach, isEmpty, indexOf, keys } from 'lodash';
import { Serializer, JsonEncoder, JsonApiNormalizer, DateNormalizer } from '@kernel-js/serializer';

/**
 *
 *
 * @export
 * @class Handling
 * @implements {IHandling}
 */
export class Handling implements IHandling {
  
  /**
   *
   *
   * @private
   * @template T
   * @param {T} model
   * @param {*} respond
   * @return {*}  {T}
   * @memberof Handling
   */
  private _hydrate<T extends IModel>(model: T, respond: any): T
  {
    model.id = respond.id;
    model.attributes = Object.assign(clone(model.attributes), respond)

    return model
  }

  /**
   *
   *
   * @private
   * @template T
   * @param {T} model
   * @param {*} respond
   * @return {*}  {T[]}
   * @memberof Handling
   */
  private _hydrateCollection<T extends IModel>(model: T, respond: any): T[]
  {
    return Object.values(respond).map((value: any) => {
      return this._hydrate(clone(model), value);
    });
  }

  /**
   *
   *
   * @template T
   * @param {T} model
   * @param {IJsonApiResponse} response
   * @return {*}  {(T | T[])}
   * @memberof Handling
   */
  public hydrate<T extends IModel>(model: T, response: IJsonApiResponse): T | T[]
  {
    const respond = this.unserialize(response);

    return (indexOf(keys(respond), '0') !== -1)
      ? this._hydrateCollection(model, respond)
      : this._hydrate(model, respond);
  }

  /**
   *
   *
   * @param {IJsonApiResponse} response
   * @return {*}  {Record<string, any>}
   * @memberof Handling
   */
  public unserialize(response: IJsonApiResponse): Record<string, any> {
    const serializer = new Serializer(new JsonEncoder(), [new JsonApiNormalizer(), new DateNormalizer()]);
    const respond = serializer.unserialize(JSON.stringify(response)) as Record<string, any>;

    return respond;
  }

  /**
   *
   *
   * @param {IModel} model
   * @return {*}  {string}
   * @memberof Handling
   */
  public serialize(model: IModel): string
  {
    const serializer = new Serializer(new JsonEncoder());

    if (!isEmpty(model.relationships)) {
      return serializer.serialize(model.relationships);
    }

    const data: { id: string | number, type?: string } = {
      id: NaN,
      type: undefined,
    };

    if (model.hasOwnProperty('id')) {
      data.id = model.id;
    }

    data.type = model.type || model.resourceName;
  
    forEach(model.fields, field => {
      if (!isUndefined(model.attributes[field])) {
        data[field] = model.attributes[field];
      }
    });
  
    forEach(model.relationshipNames, name => {
      if(!isEmpty(model[name])){
        data[name] = model[name]['id'];
      }
    });

    return serializer.serialize(data) as string;
  }

}