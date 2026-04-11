import { ReactNode } from "react";

type AdminDashboardShellProps = {
  children: ReactNode;
};

export default function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(180deg,_#f8f5ef_0%,_#f3efe7_48%,_#efe8de_100%)] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </div>
  );
}
