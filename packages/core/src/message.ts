import type { Model } from "@samrith/sodalite-providers";
import type { ULID } from "@samrith/sodalite-utils";
import { Ulid } from "@samrith/sodalite-utils";
import type { ModelMessage } from "ai";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  TOOL = "tool",
}

export interface MessageDescriptor {
  role: MessageRole;
  model: Model;
}

export class Message {
  readonly #id: ULID;
  readonly #role: MessageRole;
  readonly #createdAt: Date;
  readonly #sessionId: ULID;
  readonly #model: Model;

  #updatedAt: Date;
  #content: string;

  constructor(sessionId: ULID, content: string, descriptor: MessageDescriptor) {
    this.#id = Ulid.generate();
    this.#sessionId = sessionId;
    this.#createdAt = new Date();
    this.#updatedAt = this.#createdAt;
    this.#content = content ?? "";
    this.#role = descriptor.role;
    this.#model = descriptor.model;
  }

  get id(): ULID {
    return this.#id;
  }

  get sessionId(): ULID {
    return this.#sessionId;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
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
    this.#updatedAt = new Date();

    return this.#content;
  }

  update(content: string): string {
    this.#content = content;
    this.#updatedAt = new Date();

    return this.#content;
  }
}
