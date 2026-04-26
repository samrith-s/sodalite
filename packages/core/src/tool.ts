import type { Tool as AITool, FlexibleSchema } from "ai";
import { tool } from "ai";
import type { z } from "zod";

export interface ToolDescriptor<
  Params extends FlexibleSchema<z.ZodType> = FlexibleSchema<z.ZodType>,
  Result extends FlexibleSchema<z.ZodType> = FlexibleSchema<z.ZodType>,
> {
  description: string;
  execute(parameters: z.infer<Params>): Promise<Result>;
  name: string;
  needsApproval?: boolean;
  parameters: Params;
}

export class Tool<
  Params extends FlexibleSchema<z.ZodType> = FlexibleSchema<z.ZodType>,
  Result extends FlexibleSchema<z.ZodType> = FlexibleSchema<z.ZodType>,
> {
  readonly #name: string;
  readonly #description: string;
  readonly #parameters: Params;
  readonly #needsApproval?: boolean = true;
  readonly #tool: AITool<Params, Result>;

  constructor({
    name,
    description,
    parameters,
    needsApproval,
  }: ToolDescriptor<Params, Result>) {
    this.#name = name;
    this.#description = description;
    this.#parameters = parameters;
    this.#needsApproval = needsApproval;

    this.#tool = tool({
      description: this.#description,
      inputSchema: this.#parameters as FlexibleSchema,
      needsApproval: this.#needsApproval,
    });
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get parameters(): Params {
    return this.#parameters;
  }

  get registry(): AITool<Params, Result> {
    return this.#tool;
  }
}
