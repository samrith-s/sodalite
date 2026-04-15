import type { RuntimeConfig } from "./config";
import type { Tool } from "./tools";

export class Runtime {
  readonly #config: RuntimeConfig;
  readonly #tools: Tool[];
}
