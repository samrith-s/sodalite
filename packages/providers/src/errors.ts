// oxlint-disable max-classes-per-file
export class ProviderError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    const tag = "ProviderError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
  }
}

export class ProviderLoadError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    const tag = "ProviderLoadError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
  }
}

export class ProviderConfigParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    const tag = "ProviderConfigParseError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
  }
}

export class ProviderNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    const tag = "ProviderNotFoundError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
  }
}
