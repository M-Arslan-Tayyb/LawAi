import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Session, ChatMessage } from "@/types/genericTypes";
import {
  FamilyLawSessionResponse,
  FamilyLawMessage,
} from "@/types/FamilyLawTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some(
    (type) => file.type === type || file.name.toLowerCase().endsWith(type),
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Transform API session response to app session format
 */
export function transformApiSessionToAppSession(
  apiSession: FamilyLawSessionResponse,
): Session {
  return {
    id: apiSession.session_id,
    chat_session_id: apiSession.chat_session_id,
    title:
      apiSession.first_message.user_message.slice(0, 40) +
      (apiSession.first_message.user_message.length > 40 ? "..." : ""),
    createdAt: new Date(apiSession.created_at),
    updatedAt: new Date(apiSession.created_at),
    type: "family-law",
    conversation: [],
  };
}

/**
 * Transform API messages to chat messages
 */
export function transformApiMessagesToChatMessages(
  apiMessages: FamilyLawMessage[],
): ChatMessage[] {
  const chatMessages: ChatMessage[] = [];

  apiMessages.forEach((msg) => {
    // Add user message
    chatMessages.push({
      id: `user-${msg.message_id}`,
      role: "user",
      content: msg.user_message,
      timestamp: new Date(msg.created_at),
      metadata: msg.metadata_json,
    });

    // Add AI response
    chatMessages.push({
      id: `ai-${msg.message_id}`,
      role: "assistant",
      content: msg.ai_response,
      timestamp: new Date(msg.created_at),
    });
  });

  return chatMessages;
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${generateId()}`;
}
