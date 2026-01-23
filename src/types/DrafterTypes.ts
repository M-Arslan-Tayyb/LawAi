export interface DrafterGenerateRequest {
  user_id: number;
  requirements: string;
}

export interface DrafterGenerateResponse {
  draft: string;
}

export interface DrafterDraft {
  contract_id: number;
  user_id: number;
  requirements: string;
  contract_draft: string;
  created_at: string;
}

export interface GetDraftsParams {
  user_id: number;
}

export type ApiResponseData<T> = T | T[];
