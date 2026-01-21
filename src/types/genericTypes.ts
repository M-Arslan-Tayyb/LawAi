export type ApiResponse<T = any> = {
  succeeded: boolean;
  message: string;
  data?: T | T[] | null;
  userId?: number;
  pageNo?: number;
  pageSize?: number;
  count?: number;
  httpStatusCode: number;
};

// Session Types
export type SessionType =
  | "comparison"
  | "drafter"
  | "analyzer"
  | "summarizer"
  | "family-law"
  | "immigration-law";

// Generic Chat Message
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: any;
}

// Base Session Interface - Used by all modules
export interface Session {
  id: string; // Frontend/API session_id
  chat_session_id?: number; // Backend database ID (optional, only after API creates it)
  title: string;
  createdAt: Date;
  updatedAt: Date;
  type: SessionType;
  conversation?: ChatMessage[];
}

// Session Sidebar Props
export interface SessionSidebarProps<T extends Session = Session> {
  sessions: T[];
  activeSessionId?: string;
  onSessionSelect?: (session: T) => void;
  onNewSession?: () => void;
  onDeleteSession?: (sessionId: string) => void;
  title?: string;
  className?: string;
}
