import type { Model } from "@samrith/sodalite-providers";
import type { ULID } from "@samrith/sodalite-utils";
import type { ModelMessage } from "ai";

import type { MetadataOptions } from "./metadata";
import { Metadata } from "./metadata";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  TOOL = "tool",
}

export interface MessageOptions extends MetadataOptions {
  sessionId: ULID;
  content?: string;
  role: MessageRole;
  model: Model;
}

export class Message extends Metadata {
  readonly #role: MessageRole;
  readonly #sessionId: ULID;
  readonly #model: Model;

  #content: string;

  static from(content: string, options: MessageOptions): Message {
    return new Message(content, options);
  }

  constructor(
    content: string,
    {
      id,
      createdAt,
      updatedAt,
      archived,
      sessionId,
      role,
      model,
    }: MessageOptions
  ) {
    super({ archived, createdAt, id, updatedAt });

    this.#sessionId = sessionId;
    this.#content = content;
    this.#role = role;
    this.#model = model;
  }

  get sessionId(): ULID {
    return this.#sessionId;
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

    return this.#content;
  }

  update(content: string): string {
    this.#content = content;
    this._updatedAt = new Date();

    return this.#content;
  }
}
