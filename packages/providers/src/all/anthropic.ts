import type { AnthropicProviderSettings } from "@ai-sdk/anthropic";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const AnthropicProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<AnthropicProviderSettings, AnthropicModels>
> = z.object({
  apiKey: z.string().optional(),
  authToken: z.string().optional(),
  baseURL: z.string().default("https://api.anthropic.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<AnthropicModels>()).optional(),
});

export type AnthropicProviderOptions = z.infer<
  typeof AnthropicProviderOptionsSchema
>;
export type AnthropicModels = ExtractedModels<typeof createAnthropic>;
export { createAnthropic };
export type AnthropicProviderClient = ReturnType<typeof createAnthropic>;
