export class GenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, GenError.prototype);
  }
}
