export class ActionDisallowedError extends Error {
  constructor(message: string) {
    super(message);
    // Ensure that `name` property is set to the name of the class
    this.name = this.constructor.name;
    // Set the prototype explicitly
    Object.setPrototypeOf(this, ActionDisallowedError.prototype);
  }
}
