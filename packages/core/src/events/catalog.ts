import type { ToolCallRepairError, ToolResultPart } from "ai";

import type { SessionError } from "../errors.ts";
import type { Message } from "../message.ts";
import type { Session, SessionUsage } from "../session.ts";
import type { Tool } from "../tools.ts";

export type Events = `${keyof EventsCatalog & string}`;

export interface EventsCatalog {
  // Message events
  "message.abort": (params: {
    session: Session;
    message: Message;
    usage: SessionUsage;
  }) => void;
  "message.create": (params: { message: Message }) => void;
  "message.end": (params: {
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
  "message.start": (params: { session: Session; message: Message }) => void;
  "message.update": (params: { session: Session; message: Message }) => void;

  // Session events
  "session.archive": (params: { session: Session }) => void;
  "session.create": (params: { session: Session }) => void;
  "session.end": (params: { session: Session }) => void;
  "session.error": (params: { session: Session; error: SessionError }) => void;
  "session.fatal": (params: { session: Session; error: SessionError }) => void;
  "session.message": (params: { session: Session; message: Message }) => void;
  "session.resume": (params: { session: Session }) => void;
  "session.start": (params: { session: Session }) => void;

  // Tool events
  "tool.call.end": (params: {
    session: Session;
    tool: Tool;
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
  "tool.call.result": (params: {
    session: Session;
    tool: Tool;
    result: ToolResultPart;
    usage: SessionUsage;
  }) => void;
  "tool.call.start": (params: { session: Session; tool: Tool }) => void;
  "tool.discover": (params: { session: Session; tool: Tool }) => void;
  "tool.register": (params: { session: Session; tool: Tool }) => void;
}
