import type { TogetherAIProviderSettings } from "@ai-sdk/togetherai";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const TogetherAIProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<TogetherAIProviderSettings, TogetherAIModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.together.ai/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<TogetherAIModels>()).optional(),
});

export type TogetherAIProviderOptions = z.infer<
  typeof TogetherAIProviderOptionsSchema
>;
export type TogetherAIModels = ExtractedModels<typeof createTogetherAI>;
export { createTogetherAI };
export type TogetherAIProviderClient = ReturnType<typeof createTogetherAI>;
