import type { GatewayProviderSettings } from "@ai-sdk/gateway";
import { createGateway } from "@ai-sdk/gateway";
import { z } from "zod";

import type { ExtractedModels, SensibleProviderOptions } from "../types.ts";

export const VercelGatewayProviderOptionsSchema: z.ZodType<
  SensibleProviderOptions<GatewayProviderSettings, VercelGatewayModels>
> = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().default("https://api.vercel.com/v1").optional(),
  headers: z.record(z.string(), z.string()).optional(),
  metadataCacheRefreshMillis: z.number().optional(),
  models: z.array(z.string<VercelGatewayModels>()).optional(),
});

export type VercelGatewayProviderOptions = z.infer<
  typeof VercelGatewayProviderOptionsSchema
>;
export type VercelGatewayModels = ExtractedModels<typeof createGateway>;
export { createGateway as createVercelGateway };
export type VercelGatewayProviderClient = ReturnType<typeof createGateway>;
