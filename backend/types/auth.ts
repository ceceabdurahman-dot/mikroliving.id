export type AuthenticatedUser = {
  id: number;
  username: string;
  iat?: number;
  exp?: number;
};
