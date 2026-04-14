import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import type { AmazonBedrockProviderSettings } from "@ai-sdk/amazon-bedrock";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types";

export const AmazonBedrockProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<AmazonBedrockProviderSettings, AmazonBedrockModels>
> = z.object({
  apiKey: z.string().optional(),
  authToken: z.string().optional(),
  baseURL: z.string().default("https://api.amazon-bedrock.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<AmazonBedrockModels>()).optional(),
});

export type AmazonBedrockProviderOptions = z.infer<
  typeof AmazonBedrockProviderOptionsSchema
>;
export type AmazonBedrockModels = ExtractedModels<typeof createAmazonBedrock>;
export { createAmazonBedrock };
export type AmazonBedrockProviderClient = ReturnType<
  typeof createAmazonBedrock
>;
