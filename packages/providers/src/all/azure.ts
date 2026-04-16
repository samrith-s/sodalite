import type { AzureOpenAIProviderSettings } from "@ai-sdk/azure";
import { createAzure } from "@ai-sdk/azure";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const AzureProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<AzureOpenAIProviderSettings, AzureModels>
> = z.object({
  apiKey: z.string().optional(),
  apiVersion: z.string().default("preview").optional(),
  baseURL: z.string().default("https://api.azure.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<AzureModels>()).optional(),
  resourceName: z.string().optional(),
  useDeploymentBasedUrls: z.boolean().default(false).optional(),
});

export type AzureProviderOptions = z.infer<typeof AzureProviderOptionsSchema>;
export type AzureModels = ExtractedModels<typeof createAzure>;
export { createAzure };
export type AzureProviderClient = ReturnType<typeof createAzure>;
