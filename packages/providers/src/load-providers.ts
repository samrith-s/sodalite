import { existsSync } from "node:fs";

import { NotFoundError } from "@samrith/sodalite-utils";

import type { ModelProviders, ProviderConfig } from "./config";
import { ProviderConfigSchema } from "./config";
import { ProviderConfigParseError } from "./errors";
import { Provider } from "./provider";

export const loadProviders = async ({
  globalPath,
  localPath,
}: {
  globalPath: string;
  localPath: string;
}): Promise<Map<string, Provider<ModelProviders>>> => {
  if (!existsSync(globalPath) && !existsSync(localPath)) {
    throw new NotFoundError("global providers file not found", {
      cause: globalPath,
    });
  }

  let globalList: ProviderConfig;
  let localList: ProviderConfig;

  try {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    globalList = (await import(globalPath)) as unknown as ProviderConfig;
    ProviderConfigSchema.parse(globalList);
  } catch (error) {
    throw new ProviderConfigParseError(
      "failed to parse global providers file",
      { cause: error }
    );
  }

  try {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    localList = (await import(localPath)) as unknown as ProviderConfig;
    ProviderConfigSchema.parse(localList);
  } catch (error) {
    throw new ProviderConfigParseError("failed to parse local providers file", {
      cause: error,
    });
  }

  const finalProvidersList = new Map<string, Provider<ModelProviders>>();

  for (const provider of globalList) {
    finalProvidersList.set(provider.provider, new Provider(provider));
  }

  for (const provider of localList) {
    finalProvidersList.set(provider.provider, new Provider(provider));
  }

  return finalProvidersList;
};
