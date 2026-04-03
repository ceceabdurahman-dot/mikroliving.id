import PendingSummaryExportPanel from "./PendingSummaryExportPanel";
import { type FilenameFormat, type PendingQueueItem, type TabKey } from "./adminPanelTypes";

type PendingReviewQueueProps = {
  pendingQueue: PendingQueueItem[];
  restoredQueueCount: number;
  onOpenTab: (tabKey: TabKey) => void;
  onClearAllRestoredDrafts: () => void;
  showPendingSummaryPreview: boolean;
  onTogglePendingSummaryPreview: () => void;
  onExportSummary: () => void;
  onCopyTextBlock: () => void;
  onDownloadTextFile: () => void;
  onResetPreferences: () => void;
  onSetFilenameFormat: (value: FilenameFormat) => void;
  isExporting: boolean;
  isDownloading: boolean;
  filenameFormat: FilenameFormat;
  filenamePreview: string;
  pendingSummaryText: string;
};

export default function PendingReviewQueue({
  pendingQueue,
  restoredQueueCount,
  onOpenTab,
  onClearAllRestoredDrafts,
  showPendingSummaryPreview,
  onTogglePendingSummaryPreview,
  onExportSummary,
  onCopyTextBlock,
  onDownloadTextFile,
  onResetPreferences,
  onSetFilenameFormat,
  isExporting,
  isDownloading,
  filenameFormat,
  filenamePreview,
  pendingSummaryText,
}: PendingReviewQueueProps) {
  if (pendingQueue.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Pending Review Queue
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Prioritizing restored drafts first, followed by new unsaved edits.
          </p>
        </div>
        {restoredQueueCount > 0 ? (
          <button
            type="button"
            onClick={onClearAllRestoredDrafts}
            className="rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900"
          >
            Clear All Restored Drafts
          </button>
        ) : null}
      </div>

      <PendingSummaryExportPanel
        showPreview={showPendingSummaryPreview}
        onTogglePreview={onTogglePendingSummaryPreview}
        onExportSummary={onExportSummary}
        onCopyTextBlock={onCopyTextBlock}
        onDownloadTextFile={onDownloadTextFile}
        onResetPreferences={onResetPreferences}
        onSetFilenameFormat={onSetFilenameFormat}
        isExporting={isExporting}
        isDownloading={isDownloading}
        filenameFormat={filenameFormat}
        filenamePreview={filenamePreview}
        pendingSummaryText={pendingSummaryText}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {pendingQueue.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onOpenTab(item.key)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700"
          >
            <span className="capitalize tracking-normal text-sm">{item.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                item.tone === "restored" ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"
              }`}
            >
              {item.tone}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
