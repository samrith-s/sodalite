// oxlint-disable max-classes-per-file

import type { Message } from "./message";
import type { Session } from "./session";

export class SessionError extends Error {
  constructor(
    message: string,
    options: { session: Session } & Partial<ErrorOptions>
  ) {
    const tag = "SessionError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
  }
}

export class AssistantMessageError extends Error {
  readonly #session: Session;
  readonly #message: Message;

  constructor(
    message: string,
    options: { session: Session; message: Message } & Partial<ErrorOptions>
  ) {
    const tag = "AssistantError";

    super(`${tag}: ${message}`, options);
    this.name = tag;
    this.#session = options?.session;
    this.#message = options?.message;
  }

  get session(): Session {
    return this.#session;
  }

  get sessionMessage(): Message {
    return this.#message;
  }
}
