export class ResponseFetchError extends Error {
  constructor(message: string) {
    super(`Failed to fetch quiz: ${message}`);
    // Ensure that `name` property is set to the name of the class
    this.name = this.constructor.name;
    // Set the prototype explicitly
    Object.setPrototypeOf(this, ResponseFetchError.prototype);
  }
}
