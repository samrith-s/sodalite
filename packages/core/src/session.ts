import type { ULID } from "@samrith/sodalite-utils";

import { Bus, Emit } from "./events";
import type { MessageOptions } from "./message";
import { Message, MessageRole } from "./message";
import type { MetadataOptions } from "./metadata";
import { Metadata } from "./metadata";
import { streamText } from "./stream";

export interface SessionOptions extends MetadataOptions {
  workspaceId: ULID;
  messages?: Message[] | MessageOptions[];
}

export interface SessionUsage {
  input: {
    cachedRead: number;
    cachedWrite: number;
    noCache: number;
    total: number;
  };
  output: {
    text: number;
    reasoning: number;
    total: number;
  };
  total: number;
}

export class Session extends Metadata {
  static from(options: SessionOptions): Session {
    return new Session(options);
  }

  readonly #workspaceId: ULID;
  readonly #messages: Message[] = [];

  readonly #tokens: SessionUsage = {
    input: {
      cachedRead: 0,
      cachedWrite: 0,
      noCache: 0,
      total: 0,
    },
    output: {
      reasoning: 0,
      text: 0,
      total: 0,
    },
    total: 0,
  };

  constructor({
    id,
    createdAt,
    updatedAt,
    archived,
    workspaceId,
    messages,
  }: SessionOptions) {
    super({ archived, createdAt, id, updatedAt });

    this.#workspaceId = workspaceId;

    if (messages && messages.length) {
      for (const message of messages ?? []) {
        if (message instanceof Message) {
          this.#messages.push(message);
        } else {
          this.#messages.push(Message.from(message.content ?? "", message));
        }
      }
    }
  }

  get workspaceId(): ULID {
    return this.#workspaceId;
  }

  get messages(): Message[] {
    return this.#messages;
  }

  get usage(): SessionUsage {
    return {
      input: {
        cachedRead: this.#tokens.input.cachedRead,
        cachedWrite: this.#tokens.input.cachedWrite,
        noCache: this.#tokens.input.noCache,
        total: this.#tokens.input.total,
      },
      output: {
        reasoning: this.#tokens.output.reasoning,
        text: this.#tokens.output.text,
        total: this.#tokens.output.total,
      },
      total: this.#tokens.total,
    };
  }

  @Emit("session.archive")
  override archive(): this {
    super.archive();
    return this;
  }

  @Emit("session.message")
  async message(
    content: string,
    descriptor: Pick<MessageOptions, "content" | "model" | "role" | "sessionId">
  ): Promise<void> {
    const message = Message.from(content, {
      model: descriptor.model,
      role: MessageRole.USER,
      sessionId: this.id,
    });

    this.#messages.push(message);

    this._updatedAt = new Date();

    const agentMessage = Message.from("", {
      model: descriptor.model,
      role: MessageRole.ASSISTANT,
      sessionId: this.id,
    });

    this.#messages.push(agentMessage);

    Bus.emit("message.start", { message: agentMessage, session: this });

    const stream = streamText({
      messages: this.#messages.map((m) => m.content),
      model: descriptor.model.runtime,
      onAbort: () => {
        Bus.emit("message.abort", {
          message: agentMessage,
          session: this,
          usage: this.#tokens,
        });
      },
      onError: ({ error }) => {
        Bus.emit("message.error", {
          error,
          message: agentMessage,
          session: this,
          usage: this.#tokens,
        });
      },
      onFinish: ({ totalUsage, text }) => {
        this.#tokens.input.cachedRead =
          totalUsage.inputTokenDetails.cacheReadTokens ?? 0;
        this.#tokens.input.cachedWrite =
          totalUsage.inputTokenDetails.cacheWriteTokens ?? 0;
        this.#tokens.input.noCache =
          totalUsage.inputTokenDetails.noCacheTokens ?? 0;
        this.#tokens.input.total =
          this.#tokens.input.cachedRead +
          this.#tokens.input.cachedWrite +
          this.#tokens.input.noCache;

        this.#tokens.output.text =
          totalUsage.outputTokenDetails.textTokens ?? 0;
        this.#tokens.output.reasoning =
          totalUsage.outputTokenDetails.reasoningTokens ?? 0;
        this.#tokens.output.total =
          this.#tokens.output.reasoning + this.#tokens.output.text;

        this.#tokens.total =
          this.#tokens.input.total + this.#tokens.output.total;

        agentMessage.update(text);

        Bus.emit("message.end", {
          message: agentMessage,
          session: this,
          usage: this.#tokens,
        });
      },
      // onStepFinish: ({ text, reasoningText, response }) => {
      //   response.messages.forEach((msg) => {
      //     if (msg.role === "assistant") {
      //       // oxlint-disable-next-line typescript/no-base-to-string
      //       agentMessage.append(msg.content.toString());
      //     }
      //   });

      //   Bus.emit("message.stream", { session: this, message: agentMessage });
      // },
    });

    for await (const chunk of stream.textStream) {
      agentMessage.update(chunk);
      Bus.emit("message.stream", { message: agentMessage, session: this });
    }
  }
}
