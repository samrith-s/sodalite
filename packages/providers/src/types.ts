export type SensibleProviderOptions<
  T,
  Models,
  ExcludeName extends boolean = true,
> = Omit<
  T,
  "fetch" | "generateId" | (ExcludeName extends true ? "name" : never)
> & { models?: Models[] } extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export type ExtractedModels<T extends (...args: never) => unknown> =
  ReturnType<T> extends (...args: infer Args) => unknown
    ? Args extends [infer M, ...unknown[]]
      ? M
      : never
    : never;
