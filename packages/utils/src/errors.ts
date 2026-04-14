export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    const tag = "NotFoundError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
  }
}
