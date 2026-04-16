import type { ULID } from "@samrith/sodalite-utils";
import { Ulid } from "@samrith/sodalite-utils";

export interface MetadataOptions {
  archived?: boolean;
  createdAt?: Date;
  id?: ULID;
  updatedAt?: Date;
}

export abstract class Metadata {
  readonly #id: ULID;
  readonly #createdAt: Date;

  protected _updatedAt: Date;
  // oxlint-disable-next-line typescript/no-inferrable-types
  protected _archived = false;

  constructor({ id, createdAt, updatedAt, archived }: MetadataOptions) {
    this.#id = id ?? Ulid.generate();
    this.#createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? this.#createdAt;
    this._archived = archived ?? false;
  }

  get id(): ULID {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isArchived(): boolean {
    return this._archived;
  }

  archive(): void {
    this._archived = true;
  }
}
