import type { GoogleGenerativeAIProviderSettings } from "@ai-sdk/google";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const GoogleProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<GoogleGenerativeAIProviderSettings, GoogleModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.google.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<GoogleModels>()).optional(),
});

export type GoogleProviderOptions = z.infer<typeof GoogleProviderOptionsSchema>;
export type GoogleModels = ExtractedModels<typeof createGoogleGenerativeAI>;
export { createGoogleGenerativeAI };
export type GoogleProviderClient = ReturnType<typeof createGoogleGenerativeAI>;
