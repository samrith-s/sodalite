import { EventEmitter } from "node:events";

import type { Events, EventsCatalog } from "./catalog.ts";

// oxlint-disable-next-line unicorn/prefer-event-target
export const emitter = new EventEmitter();

export const Bus = {
  emit<Event extends Events>(
    event: Event,
    params: Parameters<EventsCatalog[Event]>[0]
  ): void {
    emitter.emit(event, params);
  },
  off<Event extends Events>(
    event: Event,
    listener: EventsCatalog[Event]
  ): void {
    emitter.off(event, listener);
  },
  on<Event extends Events>(
    event: Event,
    listener: EventsCatalog[Event]
  ): { remove: () => void } {
    const cb = emitter.on(event, listener);

    return {
      remove() {
        cb.removeListener(event, listener);
      },
    };
  },
  once<Event extends Events>(
    event: Event,
    listener: EventsCatalog[Event]
  ): void {
    emitter.once(event, listener);
  },
  removeAll<Event extends Events>(event: Event): void {
    emitter.removeAllListeners(event);
  },
};
