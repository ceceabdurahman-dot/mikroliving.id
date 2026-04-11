export type AuthenticatedUser = {
  id: number;
  username: string;
  token_version: number;
  iat?: number;
  exp?: number;
};
