// oxlint-disable func-style
import { Bus } from "./bus.ts";
import type { Events } from "./catalog.ts";

export interface EmitOptions {
  /**
   * Maps `(args, result)` to the argument list passed to `Bus.emit(event, ...args)`.
   * For `when: "before"` or the before pass of `both`, `result` is `undefined`.
   * - **Method**: `args` are the method invocation arguments (default: spread those).
   * - **Getter**: `args` is `[]` (default emit omits extras unless you map them).
   * - **Setter**: `args` is `[value]`.
   * - **Accessor**: `get` uses `[]`, `set` uses `[value]`.
   * - **Field**: `args` is `[]`; `result` is the field value after the initializer runs.
   */
  payload?: (args: unknown[], result: unknown) => unknown[];
  /**
   * When to emit relative to the wrapped body.
   * - `before` — emit before the body runs (`result` is `undefined` in `payload`).
   * - `after` — emit after the body returns (or the promise settles).
   * - `both` — emit before and after.
   */
  when?: "before" | "after" | "both";
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as { then: unknown }).then === "function"
  );
}

interface EmitDecorator {
  <This, Args extends unknown[], Return>(
    originalMethod: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ): (this: This, ...args: Args) => Return;
  <This, Value>(
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>
  ): ClassAccessorDecoratorResult<This, Value>;
  <This, Value>(
    _value: undefined,
    context: ClassFieldDecoratorContext<This, Value>
  ): (this: This, initialValue: Value) => Value;
  <This, Value>(
    original: (this: This) => Value,
    context: ClassGetterDecoratorContext<This, Value>
  ): (this: This) => Value;
  <This, Value>(
    original: (this: This, value: Value) => void,
    context: ClassSetterDecoratorContext<This, Value>
  ): (this: This, value: Value) => void;
}

/**
 * [TC39 Stage 3](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators) class member decorator:
 * the shared {@link Bus} emits when the decorated member runs (method, getter, setter, `accessor` field, or class field initializer).
 *
 * @example
 * ```ts
 * class S {
 *   @Emit(Events.SESSION_START)
 *   start(session: Session) { ... }
 *
 *   @Emit(Events.TOOL_CALL_END, {
 *     payload: (args, result) => [args[0], result],
 *   })
 *   async finish(session: Session): Promise<Tool> { ... }
 *
 *   @Emit(Events.SESSION_MESSAGE)
 *   accessor draft: Message | undefined;
 * }
 * ```
 */
export function Emit(event: Events, options?: EmitOptions): EmitDecorator {
  const when = options?.when ?? "after";

  function emitFor(
    phase: "before" | "after",
    args: unknown[],
    result?: unknown
  ): void {
    if (phase === "before" && when !== "before" && when !== "both") {
      return;
    }
    if (phase === "after" && when !== "after" && when !== "both") {
      return;
    }

    const mapped = options?.payload?.(args, result) ?? args;
    // biome-ignore lint/suspicious/noExplicitAny: too much type noise
    Bus.emit(event, mapped as any);
  }

  function wrapInvocation<This, Args extends readonly unknown[], Return>(
    this: This,
    args: Args,
    invoke: (this: This) => Return
  ): Return {
    emitFor("before", [...args]);

    const out = invoke.call(this);

    if (isThenable(out)) {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion,promise/prefer-await-to-then
      return out.then((settled) => {
        emitFor("after", [...args], settled);
        return settled;
      }) as Return;
    }

    emitFor("after", [...args], out);
    return out;
  }

  // oxlint-disable typescript/no-unsafe-type-assertion -- single implementation narrows `value` per `context.kind`
  function emitMember(
    value: unknown,
    context: ClassMemberDecoratorContext
  ): unknown {
    switch (context.kind) {
      case "method": {
        const original = value as (
          this: unknown,
          ...args: unknown[]
        ) => unknown;
        const replacementMethod = function replacementMethod(
          this: unknown,
          ...args: unknown[]
        ): unknown {
          return wrapInvocation.call(this, args, () =>
            original.call(this, ...args)
          );
        };
        return replacementMethod;
      }
      case "getter": {
        const original = value as (this: unknown) => unknown;
        const replacementGetter = function replacementGetter(
          this: unknown
        ): unknown {
          return wrapInvocation.call(this, [] as const, () =>
            original.call(this)
          );
        };
        return replacementGetter;
      }
      case "setter": {
        const original = value as (this: unknown, v: unknown) => void;
        const replacementSetter = function replacementSetter(
          this: unknown,
          v: unknown
        ): void {
          wrapInvocation.call(this, [v], () => {
            original.call(this, v);
          });
        };
        return replacementSetter;
      }
      case "accessor": {
        const target = value as ClassAccessorDecoratorTarget<unknown, unknown>;
        return {
          get(this: unknown) {
            return wrapInvocation.call(this, [] as const, () =>
              target.get.call(this)
            );
          },
          set(this: unknown, v: unknown) {
            wrapInvocation.call(this, [v], () => {
              target.set.call(this, v);
            });
          },
        } satisfies ClassAccessorDecoratorResult<unknown, unknown>;
      }
      case "field": {
        const fieldInitializer = function fieldInitializer(
          this: unknown,
          initialValue: unknown
        ): unknown {
          return wrapInvocation.call(this, [] as const, () => initialValue);
        };
        return fieldInitializer;
      }
      default: {
        const k = (context as { kind: string }).kind;
        throw new TypeError(`@Emit does not support @${k}`);
      }
    }
  }

  return emitMember as EmitDecorator;
}
