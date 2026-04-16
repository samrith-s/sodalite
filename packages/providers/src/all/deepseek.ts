import type { DeepSeekProviderSettings } from "@ai-sdk/deepseek";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const DeepSeekProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<DeepSeekProviderSettings, DeepSeekModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.deepseek.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<DeepSeekModels>()).optional(),
});

export type DeepSeekProviderOptions = z.infer<
  typeof DeepSeekProviderOptionsSchema
>;
export type DeepSeekModels = ExtractedModels<typeof createDeepSeek>;
export { createDeepSeek };
export type DeepSeekProviderClient = ReturnType<typeof createDeepSeek>;
