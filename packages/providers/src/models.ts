import type { LanguageModelV3 } from "@ai-sdk/provider";

import type { ModelProviders } from "./config";
import type { Provider } from "./provider";

export class Model<P extends ModelProviders = ModelProviders> {
  readonly #provider: Provider<P>;
  readonly #name: string;

  constructor(name: string, provider: Provider<P>) {
    this.#provider = provider;
    this.#name = name;
  }

  get name(): string {
    return `${this.#provider.name}/${this.#name}`;
  }

  get runtime(): LanguageModelV3 {
    return this.#provider.client(this.#name);
  }
}
