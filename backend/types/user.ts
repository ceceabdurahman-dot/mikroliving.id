export const USER_ROLE_VALUES = ["superadmin", "admin", "editor"] as const;

export type UserRole = (typeof USER_ROLE_VALUES)[number];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLE_VALUES.includes(value as UserRole);
}

export function isPrivilegedUserRole(role: UserRole) {
  return role === "superadmin" || role === "admin";
}

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
