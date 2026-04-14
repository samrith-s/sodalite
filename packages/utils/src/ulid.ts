import {
  monotonicFactory,
  isValid,
  ulidToUUID,
  uuidToULID,
  decodeTime,
  encodeTime,
} from "ulid";
import type { ULID } from "ulid";

export type { ULID };

export const Ulid = {
  decodeTime,
  encodeTime,
  fromUUID: uuidToULID,
  generate: monotonicFactory(),
  toUUID: ulidToUUID,
  validate: isValid,
};
