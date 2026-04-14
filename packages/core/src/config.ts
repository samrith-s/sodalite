import type { ProviderConfig } from "@samrith/sodalite-providers";
import { ProviderConfigSchema } from "@samrith/sodalite-providers";
import { z } from "zod";

export const RuntimeConfigSchema = z.object({
  providers: ProviderConfigSchema,
  sandbox: z
    .object({
      allowlist: z
        .array(z.string())
        .default([])
        .describe(
          "A list of tools that are allowed to be executed in the sandbox."
        ),
    })
    .default(() => ({ allowlist: [] }))
    .describe("Configuration for the sandbox environment."),
  session: z.object({}).default(() => ({})),
  tools: z
    .object({
      alwaysRequireApproval: z
        .boolean()
        .default(true)
        .describe("Whether to always require approval for tool execution."),
    })
    .default(() => ({ alwaysRequireApproval: true }))
    .describe("Configuration for tool execution."),
  verify: z
    .object({
      commands: z
        .array(z.string())
        .default([])
        .describe(
          "A list of commands that are allowed to be executed in the sandbox."
        ),
      enabled: z
        .boolean()
        .default(false)
        .describe("Whether to enable command verification."),
      timeout: z
        .number()
        .default(120)
        .optional()
        .describe("The timeout for command verification."),
    })
    .default(() => ({ commands: [], enabled: false }))
    .describe("Configuration for command verification."),
});

export type RuntimeConfig = Omit<
  z.infer<typeof RuntimeConfigSchema>,
  "providers"
> & {
  providers: ProviderConfig;
};
