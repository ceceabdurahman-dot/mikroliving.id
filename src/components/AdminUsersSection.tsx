import { FormEvent } from "react";
import { AdminUser } from "../services/api";
import { BusyState, UserForm, UserResetPasswordForm } from "./adminPanelTypes";

type AdminUsersSectionProps = {
  editingUserId: number | null;
  editingUser: AdminUser | null;
  userDirty: boolean;
  resetPasswordDirty: boolean;
  userForm: UserForm;
  resetPasswordForm: UserResetPasswordForm;
  users: AdminUser[];
  busy: BusyState;
  onDiscardChanges: () => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onUserFormChange: (updater: (current: UserForm) => UserForm) => void;
  onEditUser: (user: AdminUser) => void;
  onResetPasswordFormChange: (updater: (current: UserResetPasswordForm) => UserResetPasswordForm) => void;
  onResetPasswordSubmit: (event: FormEvent) => void | Promise<void>;
};

function formatLastLogin(value?: string | null) {
  if (!value) {
    return "Belum pernah login";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminUsersSection({
  editingUserId,
  editingUser,
  userDirty,
  resetPasswordDirty,
  userForm,
  resetPasswordForm,
  users,
  busy,
  onDiscardChanges,
  onSubmit,
  onUserFormChange,
  onEditUser,
  onResetPasswordFormChange,
  onResetPasswordSubmit,
}: AdminUsersSectionProps) {
  const isBusy = busy !== "idle";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-headline">{editingUserId ? "Edit User" : "Create User"}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Tambahkan superadmin, admin, atau editor baru, lalu atur status aktif dan profil singkatnya dari satu form.
              </p>
            </div>
            <div className="flex gap-3">
              {userDirty || resetPasswordDirty ? (
                <button
                  type="button"
                  onClick={onDiscardChanges}
                  className="rounded-xl border border-stone-200 px-4 py-2 text-sm"
                >
                  Discard Changes
                </button>
              ) : null}
              {editingUserId ? (
                <button
                  type="button"
                  onClick={onDiscardChanges}
                  className="rounded-xl border border-stone-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800">Username</label>
              <input
                value={userForm.username}
                onChange={(event) => onUserFormChange((current) => ({ ...current, username: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 px-4 py-3"
                autoComplete="username"
                placeholder="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800">Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(event) => onUserFormChange((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 px-4 py-3"
                autoComplete="email"
                placeholder="nama@mikroliving.store"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800">Full Name</label>
              <input
                value={userForm.full_name}
                onChange={(event) => onUserFormChange((current) => ({ ...current, full_name: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 px-4 py-3"
                autoComplete="name"
                placeholder="Nama lengkap"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800">Avatar URL</label>
              <input
                value={userForm.avatar_url}
                onChange={(event) => onUserFormChange((current) => ({ ...current, avatar_url: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 px-4 py-3"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800">Role</label>
              <select
                value={userForm.role}
                onChange={(event) =>
                  onUserFormChange((current) => ({ ...current, role: event.target.value as UserForm["role"] }))
                }
                className="w-full rounded-xl border border-stone-200 px-4 py-3"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={userForm.is_active}
                  onChange={(event) =>
                    onUserFormChange((current) => ({ ...current, is_active: event.target.checked }))
                  }
                />
                Active user
              </label>
            </div>

            {!editingUserId ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-800">Password</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(event) =>
                      onUserFormChange((current) => ({ ...current, password: event.target.value }))
                    }
                    className="w-full rounded-xl border border-stone-200 px-4 py-3"
                    autoComplete="new-password"
                    placeholder="Minimum 8 karakter"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-800">Confirm Password</label>
                  <input
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(event) =>
                      onUserFormChange((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    className="w-full rounded-xl border border-stone-200 px-4 py-3"
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                  />
                </div>
              </>
            ) : null}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isBusy}
                className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {editingUserId ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </section>

        {editingUserId && editingUser ? (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-headline">Reset Password</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Reset password untuk <span className="font-semibold text-stone-900">{editingUser.username}</span>.
                  Semua sesi user ini akan langsung keluar setelah password diganti.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                Minimum 8 characters
              </div>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onResetPasswordSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-800">New Password</label>
                <input
                  type="password"
                  value={resetPasswordForm.newPassword}
                  onChange={(event) =>
                    onResetPasswordFormChange((current) => ({ ...current, newPassword: event.target.value }))
                  }
                  className="w-full rounded-xl border border-stone-200 px-4 py-3"
                  autoComplete="new-password"
                  placeholder="Password baru"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-800">Confirm New Password</label>
                <input
                  type="password"
                  value={resetPasswordForm.confirmPassword}
                  onChange={(event) =>
                    onResetPasswordFormChange((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  className="w-full rounded-xl border border-stone-200 px-4 py-3"
                  autoComplete="new-password"
                  placeholder="Ulangi password baru"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="rounded-xl border border-stone-950 px-5 py-3 font-semibold text-stone-950 disabled:opacity-60"
                >
                  Reset User Password
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-headline">User Directory</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Lihat siapa yang punya akses ke CMS, kapan terakhir login, dan role aktif mereka.
            </p>
          </div>
          <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-600">
            {users.length} user
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {users.map((user) => (
            <article key={user.id} className="rounded-[1.5rem] border border-stone-200 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-headline text-stone-950">
                      {user.full_name || user.username}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "superadmin"
                          ? "bg-rose-100 text-rose-700"
                          : user.role === "admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-stone-700">@{user.username}</p>
                  <p className="mt-1 text-sm text-stone-500">{user.email}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-stone-400">Last Login</p>
                  <p className="mt-1 text-sm text-stone-600">{formatLastLogin(user.last_login_at)}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onEditUser(user)}
                    className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
