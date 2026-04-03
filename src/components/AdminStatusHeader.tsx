import { type TabKey } from "./adminPanelTypes";

type AdminStatusHeaderProps = {
  hasUnsavedChanges: boolean;
  dirtyTabCount: number;
  restoredDirtyCount: number;
  newDirtyCount: number;
  highestPriorityPendingTab: TabKey | null;
  onReviewRestoredFirst: () => void;
  onRefresh: () => void;
  onLogout: () => void;
};

export default function AdminStatusHeader({
  hasUnsavedChanges,
  dirtyTabCount,
  restoredDirtyCount,
  newDirtyCount,
  highestPriorityPendingTab,
  onReviewRestoredFirst,
  onRefresh,
  onLogout,
}: AdminStatusHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-stone-950 px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Admin Panel</p>
        <h1 className="mt-2 text-3xl font-headline">Content Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-400">
          Manage projects, services, insights, testimonials, and site settings from one panel.
        </p>
        {hasUnsavedChanges ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Unsaved Changes
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-200">
              {dirtyTabCount} tab pending
            </span>
            {restoredDirtyCount > 0 ? (
              <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                {restoredDirtyCount} restored
              </span>
            ) : null}
            {newDirtyCount > 0 ? (
              <span className="inline-flex items-center rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
                {newDirtyCount} new edits
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <a href="/" className="rounded-xl border border-white/15 px-4 py-3 text-sm font-medium hover:bg-white/10">
          View Website
        </a>
        {highestPriorityPendingTab ? (
          <button
            type="button"
            onClick={onReviewRestoredFirst}
            className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/20"
          >
            Review Restored First
          </button>
        ) : null}
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-white/15 px-4 py-3 text-sm font-medium hover:bg-white/10"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-stone-950"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
