export type UserRole = "admin" | "editor";

export type UserRecord = {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: number;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  password: string;
};

export type UpdateUserPayload = {
  username: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
};

export type ResetUserPasswordPayload = {
  newPassword: string;
};
