import {
  decodeTime,
  encodeTime,
  isValid,
  monotonicFactory,
  ulidToUUID,
  uuidToULID,
} from "ulid";

export type { ULID } from "ulid";

export const Ulid = {
  decodeTime,
  encodeTime,
  fromUUID: uuidToULID,
  generate: monotonicFactory(),
  toUUID: ulidToUUID,
  validate: isValid,
};
