import { Session } from "next-auth";

export interface ExtendedSession extends Session {
  access_token?: string;
  user_id: string;
  user_email: string;
  user_name: string;
}
