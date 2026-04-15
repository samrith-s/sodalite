# Events

This folder groups the application event bus, the `Events` catalog, typed listeners, and the `@Emit` decorator for wiring emissions without scattering `Bus.emit` calls at every call site.

`@Emit` is implemented with **TC39 Stage 3** decorators (the standard supported since [TypeScript 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)), not the older experimental (“legacy”) decorator transform. Use TypeScript 5+ with **`experimentalDecorators` disabled** (or omitted), and ensure your bundler/runtime applies the same Stage 3 decorator semantics—otherwise the decorator will not line up with what `tsc` expects.

Import from the barrel:

```ts
import {
  Bus,
  Emit,
  Events,
  type EmitOptions,
  type EventListener,
} from "./events";
```

(`event-bus.ts` still re-exports `Bus`, `Events`, and `EventListener` for code that only needs the bus.)

> **Note:** The **`@Config`** class decorator and the old **`config.ts`** companion in this folder are gone; this barrel only exports the bus, catalog, types, and `@Emit`. Wire `RuntimeConfig` or other settings elsewhere in your app.

---

## `Bus`

`Bus` is a shared Node.js `EventEmitter`. Producers call `Bus.emit`; consumers use `Bus.on`, `Bus.once`, or `Bus.off` with names from `Events`.

```ts
import { Bus, Events } from "./events";

Bus.on(Events.SESSION_START, (session) => {
  // ...
});

Bus.emit(Events.SESSION_START, session);
```

Use the `EventListener` map when you want autocomplete and a single place that documents each event’s payload shape:

```ts
import type { EventListener } from "./events";

const handler: EventListener[typeof Events.SESSION_MESSAGE] = (
  session,
  message
) => {
  // ...
};

Bus.on(Events.SESSION_MESSAGE, handler);
```

---

## `@Emit`

`Emit` is a **Stage 3 class member** decorator. It replaces the decorated member with a wrapper that calls `Bus.emit` according to the same timing and payload rules everywhere. Supported kinds:

| Kind                 | When it emits                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Method**           | Around each invocation (default payload: the method’s arguments).                                                                                             |
| **Getter**           | Around each read (`args` in `payload` is `[]` unless you map it).                                                                                             |
| **Setter**           | Around each write (`args` is `[value]` by default).                                                                                                           |
| **`accessor` field** | Around `get` and `set` with the same rules as getter/setter.                                                                                                  |
| **Class field**      | Around **field initialization** only (`args` is `[]`; `result` is the initialized value). For emissions on every read/write, use an `accessor` field instead. |

```ts
import { Emit, Events } from "./events";

class SessionService {
  @Emit(Events.SESSION_START)
  start(session: Session) {
    // body runs, then Bus.emit(Events.SESSION_START, ...args) with default mapping
  }

  @Emit(Events.SESSION_MESSAGE)
  accessor draft: Message | undefined;
}
```

### Default behavior

- **When:** After the member body completes (or after a returned promise settles), unless you override with `when`.
- **Payload:** By default, **`args`** (as described per kind above) is spread into `Bus.emit(event, ...args)`. If the default `args` is empty (e.g. getters), the emit is `Bus.emit(event)` unless you supply **`payload`**.

So `start(session)` emits `Bus.emit(Events.SESSION_START, session)`.

### Options

**`when`** — control timing relative to the wrapped body:

| Value      | Behavior                                     |
| ---------- | -------------------------------------------- |
| `"after"`  | After return / promise settlement (default). |
| `"before"` | Before the body runs.                        |
| `"both"`   | Emit once before and once after.             |

**`payload`** — build the listener arguments explicitly:

```ts
(args, result) => unknown[]
```

- **`args`:** Depends on member kind (method arguments, `[value]` for setters, `[]` for getters and field initializers, etc.).
- **`result`:** The settled return value for the **after** pass; omitted / `undefined` for the **before** pass.

Example: emit session plus tool result only after an async method finishes:

```ts
@Emit(Events.TOOL_CALL_END, {
  payload: (args, result) => [args[0], result],
})
async finish(session: Session): Promise<Tool> {
  return tool;
}
```

---

## TypeScript and tooling

| Requirement              | Notes                                                                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript               | **5.0+** (Stage 3 decorator context types such as `ClassMethodDecoratorContext`, `ClassMemberDecoratorContext`, etc.).                                                                                                                                 |
| `experimentalDecorators` | **`false` or unset.** If you set it to `true`, the compiler switches to legacy decorators; `@Emit` is written for Stage 3 and will not match that mode.                                                                                                |
| Runtime / bundler        | Whatever compiles or strips decorators must follow **Stage 3** behavior so the emitted code matches TypeScript’s model. If you see runtime errors or mismatched behavior, confirm your toolchain is not still applying the legacy decorator transform. |

Legacy decorator APIs (`MethodDecorator`, `ClassDecorator`, mutating `PropertyDescriptor` in the decorator body) are **not** used here; the implementation follows the `(value, context) => replacement` shape from the Stage 3 proposal.
