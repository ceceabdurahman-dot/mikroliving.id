import { FormEvent } from "react";
import { PasswordChangeForm } from "./adminPanelTypes";

type AdminPasswordSectionProps = {
  form: PasswordChangeForm;
  busy: boolean;
  onFormChange: (updater: (current: PasswordChangeForm) => PasswordChangeForm) => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
};

export default function AdminPasswordSection({
  form,
  busy,
  onFormChange,
  onSubmit,
}: AdminPasswordSectionProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-headline">Change Admin Password</h2>
          <p className="mt-2 text-sm text-stone-600">
            Enter your current password, then set a new one. After it updates, all existing admin sessions
            will be signed out and you will need to log in again.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
          Minimum 8 characters
        </div>
      </div>

      <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-stone-800">Current Password</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, currentPassword: event.target.value }))
            }
            className="w-full rounded-xl border border-stone-200 px-4 py-3"
            autoComplete="current-password"
            placeholder="Current password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-stone-800">New Password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, newPassword: event.target.value }))
            }
            className="w-full rounded-xl border border-stone-200 px-4 py-3"
            autoComplete="new-password"
            placeholder="New password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-stone-800">Confirm New Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              onFormChange((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            className="w-full rounded-xl border border-stone-200 px-4 py-3"
            autoComplete="new-password"
            placeholder="Confirm new password"
          />
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </section>
  );
}
