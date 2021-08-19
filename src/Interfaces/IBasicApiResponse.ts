export interface IBasicApiResponse {
  getBody<T = this>(): T;
  getIncludes<T = this>(): T;
}