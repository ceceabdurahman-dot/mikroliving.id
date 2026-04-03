type PendingSummaryExportPanelProps = {
  showPreview: boolean;
  onTogglePreview: () => void;
  onExportSummary: () => void;
  onCopyTextBlock: () => void;
  onDownloadTextFile: () => void;
  onResetPreferences: () => void;
  onSetFilenameFormat: (value: "short" | "full") => void;
  isExporting: boolean;
  isDownloading: boolean;
  filenameFormat: "short" | "full";
  filenamePreview: string;
  pendingSummaryText: string;
};

export default function PendingSummaryExportPanel({
  showPreview,
  onTogglePreview,
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
}: PendingSummaryExportPanelProps) {
  return (
    <div className="mt-3">
      <div className="mb-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onTogglePreview}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700"
        >
          {showPreview ? "Hide Text Block" : "Export as Text Block"}
        </button>
        <button
          type="button"
          onClick={onExportSummary}
          disabled={isExporting}
          className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 disabled:opacity-60"
        >
          {isExporting ? "Copying..." : "Export Pending Summary"}
        </button>
      </div>
      {showPreview ? (
        <div className="mb-3 rounded-2xl border border-stone-200 bg-stone-950 p-4 text-sm text-stone-100">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Text Block Preview
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-stone-700 bg-stone-900 p-1">
                <button
                  type="button"
                  onClick={() => onSetFilenameFormat("short")}
                  className={`rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    filenameFormat === "short" ? "bg-stone-100 text-stone-950" : "text-stone-300"
                  }`}
                >
                  Short Name
                </button>
                <button
                  type="button"
                  onClick={() => onSetFilenameFormat("full")}
                  className={`rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    filenameFormat === "full" ? "bg-stone-100 text-stone-950" : "text-stone-300"
                  }`}
                >
                  Full Name
                </button>
              </div>
              <button
                type="button"
                onClick={onResetPreferences}
                className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-100"
              >
                Reset Export Preferences
              </button>
              <button
                type="button"
                onClick={onCopyTextBlock}
                disabled={isExporting}
                className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-100 disabled:opacity-60"
              >
                {isExporting ? "Copying..." : "Copy Text Block"}
              </button>
              <button
                type="button"
                onClick={onDownloadTextFile}
                disabled={isDownloading}
                className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-100 disabled:opacity-60"
              >
                {isDownloading ? "Downloading..." : "Download .txt"}
              </button>
            </div>
          </div>
          <p className="mb-3 text-xs text-stone-400">
            Filename preview: <span className="font-mono text-stone-200">{filenamePreview}</span>
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6">
            {pendingSummaryText}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
