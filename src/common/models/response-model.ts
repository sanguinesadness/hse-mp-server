export class ResponseModel<T> {
  result: T | object;

  constructor(data?: T) {
    this.result = data || {};
  }
}
