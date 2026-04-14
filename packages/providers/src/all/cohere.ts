import { createCohere } from "@ai-sdk/cohere";
import type { CohereProviderSettings } from "@ai-sdk/cohere";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types";

export const CohereProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<CohereProviderSettings, CohereModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.cohere.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<CohereModels>()).optional(),
});

export type CohereProviderOptions = z.infer<typeof CohereProviderOptionsSchema>;
export type CohereModels = ExtractedModels<typeof createCohere>;
export { createCohere };
export type CohereProviderClient = ReturnType<typeof createCohere>;
