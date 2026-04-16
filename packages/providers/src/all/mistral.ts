import type { MistralProviderSettings } from "@ai-sdk/mistral";
import { createMistral } from "@ai-sdk/mistral";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const MistralProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<MistralProviderSettings, MistralModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.mistral.ai/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<MistralModels>()).optional(),
});

export type MistralProviderOptions = z.infer<
  typeof MistralProviderOptionsSchema
>;
export type MistralModels = ExtractedModels<typeof createMistral>;
export { createMistral };
export type MistralProviderClient = ReturnType<typeof createMistral>;
