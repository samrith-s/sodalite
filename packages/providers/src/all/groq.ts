import type { GroqProviderSettings } from "@ai-sdk/groq";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const GroqProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<GroqProviderSettings, GroqModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.groq.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<GroqModels>()).optional(),
});

export type GroqProviderOptions = z.infer<typeof GroqProviderOptionsSchema>;
export type GroqModels = ExtractedModels<typeof createGroq>;
export { createGroq };
export type GroqProviderClient = ReturnType<typeof createGroq>;
