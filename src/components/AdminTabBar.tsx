import { type TabKey } from "./adminPanelTypes";

type AdminTabBarProps = {
  showPendingOnly: boolean;
  onTogglePendingOnly: () => void;
  visibleTabs: TabKey[];
  activeTab: TabKey;
  dirtyTabs: Partial<Record<TabKey, boolean>>;
  onSelectTab: (tab: TabKey) => void;
};

export default function AdminTabBar({
  showPendingOnly,
  onTogglePendingOnly,
  visibleTabs,
  activeTab,
  dirtyTabs,
  onSelectTab,
}: AdminTabBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onTogglePendingOnly}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          showPendingOnly
            ? "border border-amber-300/40 bg-amber-50 text-amber-900"
            : "border border-stone-200 bg-white text-stone-700"
        }`}
      >
        {showPendingOnly ? "Show All Tabs" : "Show Pending Only"}
      </button>
      {visibleTabs.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelectTab(item)}
          className={
            activeTab === item
              ? "rounded-xl bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
              : "rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700"
          }
        >
          <span className="inline-flex items-center gap-2 capitalize">
            <span>{item}</span>
            {dirtyTabs[item] ? (
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${
                  activeTab === item ? "bg-amber-300" : "bg-amber-500"
                }`}
                aria-label={`${item} has unsaved changes`}
                title="Unsaved changes"
              />
            ) : null}
          </span>
        </button>
      ))}
      {showPendingOnly && visibleTabs.length === 0 ? (
        <span className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-2 text-sm text-stone-500">
          No pending tabs
        </span>
      ) : null}
    </div>
  );
}
