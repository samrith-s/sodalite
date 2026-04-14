// oxlint-disable typescript/no-unsafe-type-assertion
import { createAnthropic } from "@ai-sdk/anthropic";

import { createAmazonBedrock } from "./all/amazon-bedrock";
import type { AmazonBedrockProviderOptions } from "./all/amazon-bedrock";
import type { AnthropicProviderOptions } from "./all/anthropic";
import { createAzure } from "./all/azure";
import type { AzureProviderOptions } from "./all/azure";
import { createCohere } from "./all/cohere";
import type { CohereProviderOptions } from "./all/cohere";
import { createDeepSeek } from "./all/deepseek";
import type { DeepSeekProviderOptions } from "./all/deepseek";
import { createGoogleGenerativeAI } from "./all/google";
import type { GoogleProviderOptions } from "./all/google";
import { createGroq } from "./all/groq";
import type { GroqProviderOptions } from "./all/groq";
import { createMistral } from "./all/mistral";
import type { MistralProviderOptions } from "./all/mistral";
import { createOpenAI } from "./all/openai";
import type { OpenAIProviderOptions } from "./all/openai";
import { createOpenAICompatible } from "./all/openai-compatible";
import type { OpenAICompatibleProviderOptions } from "./all/openai-compatible";
import { createTogetherAI } from "./all/togetherai";
import type { TogetherAIProviderOptions } from "./all/togetherai";
import { createVercelGateway } from "./all/vercel-gateway";
import type { VercelGatewayProviderOptions } from "./all/vercel-gateway";
import { createVertex } from "./all/vertex";
import type { VertexProviderOptions } from "./all/vertex";
import { createXai } from "./all/xai";
import type { XaiProviderOptions } from "./all/xai";
import { ModelProviders } from "./config";
import type {
  ProviderClient,
  ProviderDescriptor,
  ProviderModel,
  ProviderOptions,
} from "./config";
import { ProviderError } from "./errors";

export class Provider<P extends ModelProviders> {
  readonly #provider: P;
  readonly #options: ProviderOptions[P];
  readonly #models?: ProviderModel[P][];
  readonly #client: ProviderClient[P];

  constructor({ provider, options, models }: ProviderDescriptor<P>) {
    this.#provider = provider;
    this.#options = options ?? ({} as ProviderOptions[P]);
    this.#models = models;
    this.#client = this.#createClient();
  }

  get name(): P {
    return this.#provider;
  }

  get options(): ProviderOptions[P] {
    return this.#options;
  }

  get models(): ProviderModel[P][] {
    return this.#models ?? [];
  }

  get client(): ProviderClient[P] {
    return this.#client;
  }

  #createClient(): ProviderClient[P] {
    switch (this.#provider) {
      case ModelProviders.AMAZON_BEDROCK: {
        return createAmazonBedrock(
          this.#options as AmazonBedrockProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.ANTHROPIC: {
        return createAnthropic(
          this.#options as AnthropicProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.AZURE: {
        return createAzure(
          this.#options as AzureProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.COHERE: {
        return createCohere(
          this.#options as CohereProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.DEEPSEEK: {
        return createDeepSeek(
          this.#options as DeepSeekProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.GOOGLE: {
        return createGoogleGenerativeAI(
          this.#options as GoogleProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.GROQ: {
        return createGroq(
          this.#options as GroqProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.MISTRAL: {
        return createMistral(
          this.#options as MistralProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.OPENAI: {
        return createOpenAI(
          this.#options as OpenAIProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.OPENAI_COMPATIBLE: {
        return createOpenAICompatible(
          this.#options as OpenAICompatibleProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.TOGETHERAI: {
        return createTogetherAI(
          this.#options as TogetherAIProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.VERCEL_GATEWAY: {
        return createVercelGateway(
          this.#options as VercelGatewayProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.VERTEX: {
        return createVertex(
          this.#options as VertexProviderOptions
        ) as ProviderClient[P];
      }

      case ModelProviders.XAI: {
        return createXai(
          this.#options as XaiProviderOptions
        ) as ProviderClient[P];
      }

      default: {
        throw new ProviderError(`Unsupported provider: ${this.#provider}`);
      }
    }
  }
}
