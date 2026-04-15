import { streamText as aiStreamText } from "ai";

const FREQUENCY_PENALTY = 1;
const PRESENCE_PENALTY = 1;
const TEMPERATURE = 0.3;

export type StreamTextOptions = Parameters<typeof aiStreamText>[0];
export type StreamTextResult = ReturnType<typeof aiStreamText>;

export const streamText = (options: StreamTextOptions): StreamTextResult =>
  aiStreamText({
    ...options,
    frequencyPenalty: FREQUENCY_PENALTY,
    presencePenalty: PRESENCE_PENALTY,
    temperature: TEMPERATURE,
  });
