import { createXai } from "@ai-sdk/xai";
import type { XaiProviderSettings } from "@ai-sdk/xai";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types";

export const XaiProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<XaiProviderSettings, XaiModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.xai.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  models: z.array(z.string<XaiModels>()).optional(),
});

export type XaiProviderOptions = z.infer<typeof XaiProviderOptionsSchema>;
export type XaiModels = ExtractedModels<typeof createXai>;
export { createXai };
export type XaiProviderClient = ReturnType<typeof createXai>;
