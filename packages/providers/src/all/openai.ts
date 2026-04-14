import { createOpenAI } from "@ai-sdk/openai";
import type { OpenAIProviderSettings } from "@ai-sdk/openai";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types";

export const OpenAIProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<OpenAIProviderSettings, OpenAIModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.openai.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<OpenAIModels>()).optional(),
  organization: z.string().optional(),
  project: z.string().optional(),
});

export type OpenAIProviderOptions = z.infer<typeof OpenAIProviderOptionsSchema>;
export type OpenAIModels = ExtractedModels<typeof createOpenAI>;
export { createOpenAI };
export type OpenAIProviderClient = ReturnType<typeof createOpenAI>;
