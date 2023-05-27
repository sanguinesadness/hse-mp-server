export class ResponseModel<T> {
  result: T;

  constructor(data: T) {
    this.result = data;
  }
}
