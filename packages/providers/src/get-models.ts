import { NotFoundError } from "@samrith/sodalite-utils";

import type { ModelProviders } from "./config";
import { Model } from "./models";
import type { Provider } from "./provider";

export const getModels = (
  providers: Map<string, Provider<ModelProviders>>
): Model[] => {
  const models: Model[] = [];

  for (const [_, descriptor] of providers) {
    if (!descriptor.models.length) {
      continue;
    }

    for (const model of descriptor.models) {
      models.push(new Model(model, descriptor));
    }
  }

  if (models.length === 0) {
    throw new NotFoundError("no models found");
  }

  return models;
};
