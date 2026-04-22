import type { Model } from "@samrith/sodalite-providers";
import type { ModelMessage } from "ai";
import { Bus } from "./events/bus.ts";
import type { MetadataOptions } from "./metadata.ts";
import { Metadata } from "./metadata.ts";
import type { Session } from "./session.ts";

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface MessageOptions extends MetadataOptions {
  content?: string;
  model: Model;
  role: MessageRole;
  session: Session;
}

export class Message extends Metadata {
  readonly #role: MessageRole;
  readonly #session: Session;
  readonly #model: Model;

  #content: string;

  static from(content: string, options: MessageOptions): Message {
    return new Message(content, options);
  }

  constructor(
    content: string,
    { id, createdAt, updatedAt, archived, session, role, model }: MessageOptions
  ) {
    super({ archived, createdAt, id, updatedAt });

    this.#session = session;
    this.#content = content;
    this.#role = role;
    this.#model = model;

    Bus.emit("message.create", { message: this });
  }

  get session(): Session {
    return this.#session;
  }

  get content(): ModelMessage {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return {
      content: this.#content,
      role: this.#role,
    } as unknown as ModelMessage;
  }

  get role(): MessageRole {
    return this.#role;
  }

  get model(): Model {
    return this.#model;
  }

  append(content: string): string {
    this.#content += content;
    this._updatedAt = new Date();

    Bus.emit("message.update", { session: this.#session, message: this });

    return this.#content;
  }

  update(content: string): string {
    this.#content = content;
    this._updatedAt = new Date();

    return this.#content;
  }
}
