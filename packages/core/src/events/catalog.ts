import type { ToolCallRepairError, ToolResultPart } from "ai";

import type { SessionError } from "../errors";
import type { Message } from "../message";
import type { Session, SessionUsage } from "../session";
import type { Tool } from "../tools";

export type Events = `${keyof EventsCatalog & string}`;

export interface EventsCatalog {
  // Session events
  "session.start": (params: { session: Session }) => void;
  "session.end": (params: { session: Session }) => void;
  "session.resume": (params: { session: Session }) => void;
  "session.message": (params: { session: Session; message: Message }) => void;
  "session.archive": (params: { session: Session }) => void;
  "session.error": (params: { session: Session; error: SessionError }) => void;
  "session.fatal": (params: { session: Session; error: SessionError }) => void;

  // Message events
  "message.start": (params: { session: Session; message: Message }) => void;
  "message.stream": (params: { session: Session; message: Message }) => void;
  "message.end": (params: {
    session: Session;
    message: Message;
    usage: SessionUsage;
  }) => void;
  "message.abort": (params: {
    session: Session;
    message: Message;
    usage: SessionUsage;
  }) => void;
  "message.error": (params: {
    session: Session;
    message: Message;
    error: unknown;
    usage: SessionUsage;
  }) => void;
  "message.fatal": (params: {
    session: Session;
    message: Message;
    error: unknown;
    usage: SessionUsage;
  }) => void;

  // Tool events
  "tool.discover": (params: { session: Session; tool: Tool }) => void;
  "tool.register": (params: { session: Session; tool: Tool }) => void;
  "tool.call.start": (params: { session: Session; tool: Tool }) => void;
  "tool.call.end": (params: {
    session: Session;
    tool: Tool;
    usage: SessionUsage;
  }) => void;
  "tool.call.result": (params: {
    session: Session;
    tool: Tool;
    result: ToolResultPart;
    usage: SessionUsage;
  }) => void;
  "tool.call.error": (params: {
    session: Session;
    error: ToolCallRepairError;
    usage: SessionUsage;
  }) => void;
  "tool.call.fatal": (params: {
    session: Session;
    error: ToolCallRepairError;
    usage: SessionUsage;
  }) => void;
}
