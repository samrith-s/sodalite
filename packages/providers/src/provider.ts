// oxlint-disable typescript/no-unsafe-type-assertion
import { createAnthropic } from "@ai-sdk/anthropic";
import type { AmazonBedrockProviderOptions } from "./all/amazon-bedrock.ts";
import { createAmazonBedrock } from "./all/amazon-bedrock.ts";
import type { AnthropicProviderOptions } from "./all/anthropic.ts";
import type { AzureProviderOptions } from "./all/azure.ts";
import { createAzure } from "./all/azure.ts";
import type { CohereProviderOptions } from "./all/cohere.ts";
import { createCohere } from "./all/cohere.ts";
import type { DeepSeekProviderOptions } from "./all/deepseek.ts";
import { createDeepSeek } from "./all/deepseek.ts";
import type { GoogleProviderOptions } from "./all/google.ts";
import { createGoogleGenerativeAI } from "./all/google.ts";
import type { GroqProviderOptions } from "./all/groq.ts";
import { createGroq } from "./all/groq.ts";
import type { MistralProviderOptions } from "./all/mistral.ts";
import { createMistral } from "./all/mistral.ts";
import type { OpenAIProviderOptions } from "./all/openai.ts";
import { createOpenAI } from "./all/openai.ts";
import type { OpenAICompatibleProviderOptions } from "./all/openai-compatible.ts";
import { createOpenAICompatible } from "./all/openai-compatible.ts";
import type { TogetherAIProviderOptions } from "./all/togetherai.ts";
import { createTogetherAI } from "./all/togetherai.ts";
import type { VercelGatewayProviderOptions } from "./all/vercel-gateway.ts";
import { createVercelGateway } from "./all/vercel-gateway.ts";
import type { VertexProviderOptions } from "./all/vertex.ts";
import { createVertex } from "./all/vertex.ts";
import type { XaiProviderOptions } from "./all/xai.ts";
import { createXai } from "./all/xai.ts";
import type {
  ProviderClient,
  ProviderDescriptor,
  ProviderModel,
  ProviderOptions,
} from "./config.ts";
import { ModelProviders } from "./config.ts";
import { ProviderError } from "./errors.ts";

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
