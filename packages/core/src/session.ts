import { Ulid } from "@samrith/sodalite-utils";
import type { ULID } from "@samrith/sodalite-utils";
import { streamText } from "ai";

import type { MessageDescriptor } from "./message";
import { Message } from "./message";

export class Session {
  readonly #id: ULID;
  readonly #createdAt: Date;
  readonly #messages: Message[];

  readonly #temperature: number;
  readonly #frequencyPenalty: number;
  readonly #presencePenalty: number;

  #updatedAt: Date;

  constructor() {
    this.#id = Ulid.generate();
    this.#createdAt = new Date();
    this.#updatedAt = this.createdAt;
    this.#messages = [];
    this.#temperature = 0.3;
    this.#frequencyPenalty = 1;
    this.#presencePenalty = 0.5;
  }

  get id(): ULID {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  get messages(): Message[] {
    return this.#messages;
  }

  message(
    content: string,
    descriptor: MessageDescriptor
  ): ReturnType<typeof streamText> {
    const message = new Message(this.#id, content, descriptor);

    this.#messages.push(message);

    this.#updatedAt = new Date();

    return streamText({
      frequencyPenalty: this.#frequencyPenalty,
      messages: this.#messages.map((m) => m.content),
      model: descriptor.model.runtime,
      presencePenalty: this.#presencePenalty,
      temperature: this.#temperature,
    });
  }
}
