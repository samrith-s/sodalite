import type { ToolCallRepairError, ToolResultPart } from "ai";

import type { SessionError } from "./errors";
import type { Message } from "./message";
import type { Session } from "./session";
import type { Tool } from "./tools";

export enum Events {
  // Session events
  SESSION_START = "session.start",
  SESSION_END = "session.end",
  SESSION_RESUME = "session.resume",
  SESSION_MESSAGE = "session.message",
  SESSION_ARCHIVE = "session.archive",
  SESSION_ERROR = "session.error",
  SESSION_FATAL = "session.fatal",

  // Assistant message events
  ASSISTANT_MESSAGE_START = "assistant.message.start",
  ASSISTANT_MESSAGE_STREAM = "assistant.message.stream",
  ASSISTANT_MESSAGE_END = "assistant.message.end",
  ASSISTANT_ERROR = "assistant.error",

  // Tool events
  TOOL_DISCOVER = "tool.discover",
  TOOL_REGISTER = "tool.register",

  TOOL_CALL_START = "tool.call.start",
  TOOL_CALL_END = "tool.end",
  TOOL_CALL_RESULT = "tool.call.result",
  TOOL_CALL_ERROR = "tool.call.error",
  TOOL_CALL_FATAL = "tool.call.fatal",
}

export interface EventListener {
  [Events.SESSION_START]: (session: Session) => void;
  [Events.SESSION_END]: (session: Session) => void;
  [Events.SESSION_RESUME]: (session: Session) => void;
  [Events.SESSION_MESSAGE]: (session: Session, message: Message) => void;
  [Events.SESSION_ARCHIVE]: (session: Session) => void;
  [Events.SESSION_ERROR]: (session: Session, error: SessionError) => void;
  [Events.SESSION_FATAL]: (session: Session, error: SessionError) => void;

  [Events.ASSISTANT_MESSAGE_START]: (
    session: Session,
    message: Message
  ) => void;
  [Events.ASSISTANT_MESSAGE_STREAM]: (
    session: Session,
    message: Message
  ) => void;
  [Events.ASSISTANT_MESSAGE_END]: (session: Session, message: Message) => void;
  [Events.ASSISTANT_ERROR]: (session: Session, error: Error) => void;

  [Events.TOOL_DISCOVER]: (session: Session) => void;
  [Events.TOOL_REGISTER]: (session: Session) => void;
  [Events.TOOL_CALL_START]: (session: Session) => void;
  [Events.TOOL_CALL_END]: (session: Session, tool: Tool) => void;
  [Events.TOOL_CALL_RESULT]: (session: Session, error: ToolResultPart) => void;
  [Events.TOOL_CALL_ERROR]: (
    session: Session,
    error: ToolCallRepairError
  ) => void;
  [Events.TOOL_CALL_FATAL]: (
    session: Session,
    error: ToolCallRepairError
  ) => void;
}
