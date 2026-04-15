import type { ULID } from "@samrith/sodalite-utils";

import { Metadata } from "./metadata";
import type { MetadataOptions } from "./metadata";
import { Session } from "./session";

export interface WorkspaceOptions extends MetadataOptions {
  cwd: string;
  sessions?: Session[];
}

export class Workspace extends Metadata {
  readonly #cwd: string;
  readonly #sessions = new Map<ULID, Session>();

  static from(options: WorkspaceOptions): Workspace {
    return new Workspace(options);
  }

  constructor({
    id,
    createdAt,
    updatedAt,
    archived,
    cwd,
    sessions,
  }: WorkspaceOptions) {
    super({ archived, createdAt, id, updatedAt });
    this.#cwd = cwd;

    if (sessions && sessions.length) {
      this.#sessions = new Map(
        sessions.map((session) => [session.id, session])
      );
    }
  }

  get cwd(): string {
    return this.#cwd;
  }

  get sessions(): Map<ULID, Session> {
    return this.#sessions;
  }

  createSession(): Session {
    const session = new Session({
      workspaceId: this.id,
    });
    this.#sessions.set(session.id, session);
    return session;
  }

  getSession(id: ULID): Session | undefined {
    return this.#sessions.get(id);
  }

  archiveSession(id: ULID): void {
    const session = this.#sessions.get(id);

    if (session) {
      session.archive();
    }
  }
}
