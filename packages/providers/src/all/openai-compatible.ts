import type { OpenAICompatibleProviderSettings } from "@ai-sdk/openai-compatible";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const OpenAICompatibleProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<
    OpenAICompatibleProviderSettings,
    OpenAICompatibleModels,
    false
  >
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string()).optional(),
  name: z.string(),
});

export type OpenAICompatibleProviderOptions = z.infer<
  typeof OpenAICompatibleProviderOptionsSchema
>;
export type OpenAICompatibleModels = ExtractedModels<
  typeof createOpenAICompatible
>;
export { createOpenAICompatible };
export type OpenAICompatibleProviderClient = ReturnType<
  typeof createOpenAICompatible
>;
