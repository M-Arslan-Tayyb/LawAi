// Family Law API Request/Response Types

export interface FamilyLawQueryRequest {
  user_id: number;
  session_id: string;
  user_message: string;
}

export interface FamilyLawQueryResponse {
  ai_response: string;
}

export interface FamilyLawMessage {
  message_id: number;
  user_message: string;
  ai_response: string;
  metadata_json: any | null;
  chat_session_id: number;
  created_at: string;
}

export interface FamilyLawSessionResponse {
  chat_session_id: number;
  user_id: number;
  session_id: string;
  created_at: string;
  first_message: {
    message_id: number;
    user_message: string;
    created_at: string;
  };
}

export interface GetSessionsParams {
  user_id: number;
}

export interface GetMessagesParams {
  chat_session_id: number;
}
