import { z } from "zod";

import { AmazonBedrockProviderOptionsSchema } from "./all/amazon-bedrock";
import type {
  AmazonBedrockModels,
  AmazonBedrockProviderClient,
} from "./all/amazon-bedrock";
import { AnthropicProviderOptionsSchema } from "./all/anthropic";
import type { AnthropicModels, AnthropicProviderClient } from "./all/anthropic";
import { AzureProviderOptionsSchema } from "./all/azure";
import type { AzureModels, AzureProviderClient } from "./all/azure";
import { CohereProviderOptionsSchema } from "./all/cohere";
import type { CohereModels, CohereProviderClient } from "./all/cohere";
import { DeepSeekProviderOptionsSchema } from "./all/deepseek";
import type { DeepSeekModels, DeepSeekProviderClient } from "./all/deepseek";
import { GoogleProviderOptionsSchema } from "./all/google";
import type { GoogleModels, GoogleProviderClient } from "./all/google";
import { GroqProviderOptionsSchema } from "./all/groq";
import type { GroqModels, GroqProviderClient } from "./all/groq";
import { MistralProviderOptionsSchema } from "./all/mistral";
import type { MistralModels, MistralProviderClient } from "./all/mistral";
import { OpenAIProviderOptionsSchema } from "./all/openai";
import type { OpenAIModels, OpenAIProviderClient } from "./all/openai";
import type { OpenAICompatibleProviderClient } from "./all/openai-compatible";
import { TogetherAIProviderOptionsSchema } from "./all/togetherai";
import type {
  TogetherAIModels,
  TogetherAIProviderClient,
} from "./all/togetherai";
import { VercelGatewayProviderOptionsSchema } from "./all/vercel-gateway";
import type {
  VercelGatewayModels,
  VercelGatewayProviderClient,
} from "./all/vercel-gateway";
import { VertexProviderOptionsSchema } from "./all/vertex";
import type { VertexModels, VertexProviderClient } from "./all/vertex";
import { XaiProviderOptionsSchema } from "./all/xai";
import type { XaiModels, XaiProviderClient } from "./all/xai";

/** String-literal union (not a TS enum) so config objects accept `"openai"` and Zod inference matches. */
export const ModelProviders = {
  AMAZON_BEDROCK: "amazon-bedrock",
  ANTHROPIC: "anthropic",
  AZURE: "azure",
  COHERE: "cohere",
  DEEPSEEK: "deepseek",
  GOOGLE: "google",
  GROQ: "groq",
  MISTRAL: "mistral",
  OPENAI: "openai",
  OPENAI_COMPATIBLE: "openai-compatible",
  TOGETHERAI: "togetherai",
  VERCEL_GATEWAY: "vercel-gateway",
  VERTEX: "vertex",
  XAI: "xai",
} as const;

export type ModelProviders =
  (typeof ModelProviders)[keyof typeof ModelProviders];

export interface ProviderModel {
  [ModelProviders.AMAZON_BEDROCK]: AmazonBedrockModels;
  [ModelProviders.ANTHROPIC]: AnthropicModels;
  [ModelProviders.AZURE]: AzureModels;
  [ModelProviders.COHERE]: CohereModels;
  [ModelProviders.DEEPSEEK]: DeepSeekModels;
  [ModelProviders.GOOGLE]: GoogleModels;
  [ModelProviders.GROQ]: GroqModels;
  [ModelProviders.MISTRAL]: MistralModels;
  [ModelProviders.OPENAI]: OpenAIModels;
  [ModelProviders.OPENAI_COMPATIBLE]: string;
  [ModelProviders.TOGETHERAI]: TogetherAIModels;
  [ModelProviders.VERCEL_GATEWAY]: VercelGatewayModels;
  [ModelProviders.VERTEX]: VertexModels;
  [ModelProviders.XAI]: XaiModels;
}

export const ProviderOptionsSchema = {
  [ModelProviders.ANTHROPIC]: AnthropicProviderOptionsSchema.optional(),
  [ModelProviders.AZURE]: AzureProviderOptionsSchema.optional(),
  [ModelProviders.AMAZON_BEDROCK]:
    AmazonBedrockProviderOptionsSchema.optional(),
  [ModelProviders.COHERE]: CohereProviderOptionsSchema.optional(),
  [ModelProviders.DEEPSEEK]: DeepSeekProviderOptionsSchema.optional(),
  [ModelProviders.GOOGLE]: GoogleProviderOptionsSchema.optional(),
  [ModelProviders.GROQ]: GroqProviderOptionsSchema.optional(),
  [ModelProviders.MISTRAL]: MistralProviderOptionsSchema.optional(),
  [ModelProviders.OPENAI]: OpenAIProviderOptionsSchema,
  [ModelProviders.OPENAI_COMPATIBLE]: OpenAIProviderOptionsSchema.optional(),
  [ModelProviders.TOGETHERAI]: TogetherAIProviderOptionsSchema.optional(),
  [ModelProviders.VERCEL_GATEWAY]:
    VercelGatewayProviderOptionsSchema.optional(),
  [ModelProviders.VERTEX]: VertexProviderOptionsSchema.optional(),
  [ModelProviders.XAI]: XaiProviderOptionsSchema.optional(),
} as const;

export type ProviderOptions = {
  [K in keyof typeof ProviderOptionsSchema]: z.infer<
    (typeof ProviderOptionsSchema)[K]
  >;
};

// oxlint-disable-next-line typescript/explicit-module-boundary-types
export const ProviderDescriptorSchema = <Provider extends ModelProviders>(
  provider: Provider
  // oxlint-disable-next-line typescript/explicit-function-return-type
) =>
  z.object({
    models: z.array(z.string<ProviderModel[Provider]>()).optional(),
    options: ProviderOptionsSchema[provider],
    provider: z.literal(provider),
  });

/**
 * Per-provider entry. **Write `provider` before `models`** in object literals so TypeScript can
 * narrow the union and the editor can suggest model ids for that backend.
 */
export type ProviderDescriptor<
  Provider extends ModelProviders,
  HasMandatoryOptions extends boolean = false,
> = {
  provider: Provider;
  models?: ProviderModel[Provider][];
} & (HasMandatoryOptions extends true
  ? { options: ProviderOptions[Provider] }
  : { options?: ProviderOptions[Provider] });

export const ProviderConfigSchema = z.array(
  z.discriminatedUnion("provider", [
    ProviderDescriptorSchema(ModelProviders.AMAZON_BEDROCK),
    ProviderDescriptorSchema(ModelProviders.ANTHROPIC),
    ProviderDescriptorSchema(ModelProviders.AZURE),
    ProviderDescriptorSchema(ModelProviders.COHERE),
    ProviderDescriptorSchema(ModelProviders.DEEPSEEK),
    ProviderDescriptorSchema(ModelProviders.GOOGLE),
    ProviderDescriptorSchema(ModelProviders.GROQ),
    ProviderDescriptorSchema(ModelProviders.MISTRAL),
    ProviderDescriptorSchema(ModelProviders.OPENAI),
    ProviderDescriptorSchema(ModelProviders.OPENAI_COMPATIBLE),
    ProviderDescriptorSchema(ModelProviders.TOGETHERAI),
    ProviderDescriptorSchema(ModelProviders.VERCEL_GATEWAY),
    ProviderDescriptorSchema(ModelProviders.VERTEX),
    ProviderDescriptorSchema(ModelProviders.XAI),
  ])
);

/** True when Zod requires `options` for that provider (see `ProviderOptionsSchema`). */
export type ProviderRequiresOptions<P extends ModelProviders> =
  P extends typeof ModelProviders.OPENAI ? true : false;

/**
 * Explicit discriminated union on `provider` so TypeScript narrows `options` / `models`
 * when you write `provider: "openai"` (Zod’s `z.infer` alone does not contextual‑narrow well).
 */
export type ProviderConfigItem = {
  [P in ModelProviders]: ProviderDescriptor<P, ProviderRequiresOptions<P>>;
}[ModelProviders];

export type ProviderConfig = ProviderConfigItem[];

export interface ProviderClient {
  [ModelProviders.AMAZON_BEDROCK]: AmazonBedrockProviderClient;
  [ModelProviders.ANTHROPIC]: AnthropicProviderClient;
  [ModelProviders.AZURE]: AzureProviderClient;
  [ModelProviders.COHERE]: CohereProviderClient;
  [ModelProviders.DEEPSEEK]: DeepSeekProviderClient;
  [ModelProviders.GOOGLE]: GoogleProviderClient;
  [ModelProviders.GROQ]: GroqProviderClient;
  [ModelProviders.MISTRAL]: MistralProviderClient;
  [ModelProviders.OPENAI]: OpenAIProviderClient;
  [ModelProviders.OPENAI_COMPATIBLE]: OpenAICompatibleProviderClient;
  [ModelProviders.TOGETHERAI]: TogetherAIProviderClient;
  [ModelProviders.VERCEL_GATEWAY]: VercelGatewayProviderClient;
  [ModelProviders.VERTEX]: VertexProviderClient;
  [ModelProviders.XAI]: XaiProviderClient;
}
