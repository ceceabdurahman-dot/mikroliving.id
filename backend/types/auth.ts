import { UserRole } from "./user";

export type AuthenticatedUser = {
  id: number;
  username: string;
  role: UserRole;
  token_version: number;
  iat?: number;
  exp?: number;
};
