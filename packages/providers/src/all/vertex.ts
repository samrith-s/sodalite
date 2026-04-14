import { createVertex } from "@ai-sdk/google-vertex";
import type { GoogleVertexProviderSettings } from "@ai-sdk/google-vertex";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types";

export const VertexProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<GoogleVertexProviderSettings, VertexModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.google.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<VertexModels>()).optional(),
});

export type VertexProviderOptions = z.infer<typeof VertexProviderOptionsSchema>;
export type VertexModels = ExtractedModels<typeof createVertex>;
export { createVertex };
export type VertexProviderClient = ReturnType<typeof createVertex>;
