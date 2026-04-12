import { FormEvent } from "react";
import { type LoginForm, type LoginMessageTone } from "./adminPanelTypes";
import BrandMark from "./BrandMark";

type AdminLoginShellProps = {
  busy: boolean;
  loginForm: LoginForm;
  loginMessage: string;
  loginMessageTone?: LoginMessageTone;
  onSubmit: (event: FormEvent) => void | Promise<void>;
  onLoginFormChange: (updater: (current: LoginForm) => LoginForm) => void;
};

export default function AdminLoginShell({
  busy,
  loginForm,
  loginMessage,
  loginMessageTone = "error",
  onSubmit,
  onLoginFormChange,
}: AdminLoginShellProps) {
  return (
    <div className="min-h-screen bg-stone-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Admin Access</p>
        <div className="mt-5">
          <BrandMark tone="light" size="lg" />
        </div>
        <h1 className="mt-5 text-3xl font-headline">MikroLiving Control Room</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-400">
          Login with your admin account to manage homepage content.
        </p>
        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <input
            value={loginForm.username}
            onChange={(event) =>
              onLoginFormChange((current) => ({ ...current, username: event.target.value }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white"
            placeholder="Username"
          />
          <input
            type="password"
            value={loginForm.password}
            onChange={(event) =>
              onLoginFormChange((current) => ({ ...current, password: event.target.value }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white"
            placeholder="Password"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary disabled:opacity-60"
          >
            {busy ? "Signing In..." : "Login"}
          </button>
          {loginMessage ? (
            <p className={`text-sm ${loginMessageTone === "success" ? "text-emerald-200" : "text-red-200"}`}>
              {loginMessage}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
