export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone_no: string;
}

export interface SignupResponse {
  userId?: number;
}

export interface LoginData {
  access_token: string;
  user_name: string;
  user_email: string;
  user_id: number;
}
