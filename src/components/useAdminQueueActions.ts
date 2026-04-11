import { Dispatch, SetStateAction } from "react";
import {
  type DraftTimestampState,
  type FilenameFormat,
  type PendingQueueItem,
  type RestoredDraftState,
  type TabKey,
  emptyInsightForm,
  emptyProjectForm,
  emptyServiceForm,
  emptyTestimonialForm,
} from "./adminPanelTypes";
import {
  clearDraft,
  clearStoredFilenameFormat,
  draftKeys,
  formatPendingSummaryFilename,
  formatPendingSummaryShortFilename,
} from "./adminPanelUtils";

type PushToast = (tone: "success" | "error", message: string) => void;

type UseAdminQueueActionsArgs = {
  tab: TabKey;
  pendingQueue: PendingQueueItem[];
  pendingSummaryText: string;
  hasUnsavedChanges: boolean;
  highestPriorityPendingTab: TabKey | null;
  restoredQueueTabs: TabKey[];
  restoredDirtyTabs: Partial<Record<TabKey, boolean>>;
  filenameFormat: FilenameFormat;
  setFilenameFormat: Dispatch<SetStateAction<FilenameFormat>>;
  setMessage: (value: string) => void;
  pushToast: PushToast;
  setTab: Dispatch<SetStateAction<TabKey>>;
  setIsExportingPendingSummary: Dispatch<SetStateAction<boolean>>;
  setIsDownloadingPendingSummary: Dispatch<SetStateAction<boolean>>;
  setProjectsState: {
    setEditingProjectId: Dispatch<SetStateAction<number | null>>;
    setProjectForm: Dispatch<SetStateAction<typeof emptyProjectForm>>;
  };
  setServicesState: {
    setEditingServiceId: Dispatch<SetStateAction<number | null>>;
    setServiceForm: Dispatch<SetStateAction<typeof emptyServiceForm>>;
  };
  setInsightsState: {
    setEditingInsightId: Dispatch<SetStateAction<number | null>>;
    setInsightForm: Dispatch<SetStateAction<typeof emptyInsightForm>>;
  };
  setTestimonialsState: {
    setEditingTestimonialId: Dispatch<SetStateAction<number | null>>;
    setTestimonialForm: Dispatch<SetStateAction<typeof emptyTestimonialForm>>;
  };
  setRestoredDrafts: Dispatch<SetStateAction<RestoredDraftState>>;
  setDraftUpdatedAt: Dispatch<SetStateAction<DraftTimestampState>>;
  resetNavigationContactDraftState: () => void;
  resetProjectChanges: () => void;
  resetServiceChanges: () => void;
  resetInsightChanges: () => void;
  resetTestimonialChanges: () => void;
  clearSettingsRestoredDraft: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
};

export default function useAdminQueueActions({
  tab,
  pendingQueue,
  pendingSummaryText,
  hasUnsavedChanges,
  highestPriorityPendingTab,
  restoredQueueTabs,
  restoredDirtyTabs,
  filenameFormat,
  setFilenameFormat,
  setMessage,
  pushToast,
  setTab,
  setIsExportingPendingSummary,
  setIsDownloadingPendingSummary,
  setProjectsState,
  setServicesState,
  setInsightsState,
  setTestimonialsState,
  setRestoredDrafts,
  setDraftUpdatedAt,
  resetNavigationContactDraftState,
  resetProjectChanges,
  resetServiceChanges,
  resetInsightChanges,
  resetTestimonialChanges,
  clearSettingsRestoredDraft,
  refreshDashboard,
}: UseAdminQueueActionsArgs) {
  const confirmDiscardChanges = () => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm("You have unsaved changes. Leave this section and discard them?");
  };

  const handleTabChange = (nextTab: TabKey) => {
    if (nextTab === tab) {
      return;
    }

    if (!confirmDiscardChanges()) {
      return;
    }

    setTab(nextTab);
  };

  const reviewHighestPriorityPendingTab = () => {
    if (!highestPriorityPendingTab) {
      return;
    }

    handleTabChange(highestPriorityPendingTab);
  };

  const clearAllRestoredDrafts = async () => {
    if (restoredQueueTabs.length === 0) {
      return;
    }

    if (!window.confirm("Clear all restored drafts and go back to the latest saved data for those tabs?")) {
      return;
    }

    if (restoredDirtyTabs.projects) {
      setProjectsState.setEditingProjectId(null);
      setProjectsState.setProjectForm(emptyProjectForm);
      clearDraft(draftKeys.project);
    }

    if (restoredDirtyTabs.services) {
      setServicesState.setEditingServiceId(null);
      setServicesState.setServiceForm(emptyServiceForm);
      clearDraft(draftKeys.service);
    }

    if (restoredDirtyTabs.insights) {
      setInsightsState.setEditingInsightId(null);
      setInsightsState.setInsightForm(emptyInsightForm);
      clearDraft(draftKeys.insight);
    }

    if (restoredDirtyTabs.testimonials) {
      setTestimonialsState.setEditingTestimonialId(null);
      setTestimonialsState.setTestimonialForm(emptyTestimonialForm);
      clearDraft(draftKeys.testimonial);
    }

    if (restoredDirtyTabs.settings) {
      clearDraft(draftKeys.settings);
      clearDraft(draftKeys.navigation);
      clearDraft(draftKeys.contact);
      resetNavigationContactDraftState();
    }

    setRestoredDrafts((current) => ({
      ...current,
      projects: false,
      services: false,
      insights: false,
      testimonials: false,
      settings: false,
    }));
    setDraftUpdatedAt((current) => ({
      ...current,
      projects: restoredDirtyTabs.projects ? null : current.projects,
      services: restoredDirtyTabs.services ? null : current.services,
      insights: restoredDirtyTabs.insights ? null : current.insights,
      testimonials: restoredDirtyTabs.testimonials ? null : current.testimonials,
      settings: restoredDirtyTabs.settings ? null : current.settings,
    }));

    await refreshDashboard();
    setMessage("All restored drafts have been cleared.");
  };

  const exportPendingSummary = async () => {
    if (pendingQueue.length === 0) {
      setMessage("There are no pending tabs to export.");
      pushToast("error", "No pending tabs to export.");
      return;
    }

    setIsExportingPendingSummary(true);
    try {
      await navigator.clipboard.writeText(pendingSummaryText);
      setMessage("Pending review summary copied to clipboard.");
      pushToast("success", `${pendingQueue.length} pending item${pendingQueue.length === 1 ? "" : "s"} copied to clipboard.`);
    } catch {
      setMessage("We couldn't copy the pending review summary to the clipboard.");
      pushToast("error", "Pending review summary could not be copied.");
    } finally {
      setIsExportingPendingSummary(false);
    }
  };

  const copyPendingSummaryTextBlock = async () => {
    if (!pendingSummaryText.trim()) {
      pushToast("error", "No text block available to copy.");
      return;
    }

    setIsExportingPendingSummary(true);
    try {
      await navigator.clipboard.writeText(pendingSummaryText);
      setMessage("Pending text block copied to clipboard.");
      pushToast(
        "success",
        `${pendingQueue.length} pending item${pendingQueue.length === 1 ? "" : "s"} copied from text block.`
      );
    } catch {
      setMessage("We couldn't copy the pending text block to the clipboard.");
      pushToast("error", "Pending text block could not be copied.");
    } finally {
      setIsExportingPendingSummary(false);
    }
  };

  const resetExportPreferences = () => {
    clearStoredFilenameFormat();
    setFilenameFormat("full");
    setMessage("Export preferences reset to default.");
    pushToast("success", "Export preferences reset to default.");
  };

  const downloadPendingSummaryTextFile = async () => {
    if (!pendingSummaryText.trim()) {
      pushToast("error", "No text block available to download.");
      return;
    }

    setIsDownloadingPendingSummary(true);
    try {
      const blob = new Blob([pendingSummaryText], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        filenameFormat === "short"
          ? formatPendingSummaryShortFilename()
          : formatPendingSummaryFilename(pendingQueue.length);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
      setMessage("Pending review summary downloaded as .txt.");
      pushToast(
        "success",
        `${pendingQueue.length} pending item${pendingQueue.length === 1 ? "" : "s"} downloaded as .txt.`
      );
    } catch {
      setMessage("We couldn't download the pending review summary.");
      pushToast("error", "Pending review summary could not be downloaded.");
    } finally {
      setIsDownloadingPendingSummary(false);
    }
  };

  const clearRestoredDraft = async () => {
    if (!window.confirm("Clear the restored local draft and go back to the latest saved data?")) {
      return;
    }

    if (tab === "projects") {
      resetProjectChanges();
      return;
    }

    if (tab === "services") {
      resetServiceChanges();
      return;
    }

    if (tab === "insights") {
      resetInsightChanges();
      return;
    }

    if (tab === "testimonials") {
      resetTestimonialChanges();
      return;
    }

    await clearSettingsRestoredDraft();
  };

  return {
    clearAllRestoredDrafts,
    clearRestoredDraft,
    confirmDiscardChanges,
    copyPendingSummaryTextBlock,
    downloadPendingSummaryTextFile,
    exportPendingSummary,
    handleTabChange,
    resetExportPreferences,
    reviewHighestPriorityPendingTab,
  };
}
