import { useMemo } from "react";
import {
  type DraftTimestampState,
  type PendingQueueItem,
  type RestoredDraftState,
  type TabKey,
  settingKeys,
} from "./adminPanelTypes";

type UseAdminPanelSelectorsArgs = {
  tab: TabKey;
  showPendingOnly: boolean;
  editingProjectId: number | null;
  editingServiceId: number | null;
  editingInsightId: number | null;
  editingTestimonialId: number | null;
  projectFormIsDefault: boolean;
  serviceFormIsDefault: boolean;
  insightFormIsDefault: boolean;
  testimonialFormIsDefault: boolean;
  settingsForm: Record<string, string>;
  settingsMap: Record<string, string>;
  navigationContactDirty: boolean;
  navigationContactDraftRestored: boolean;
  navigationContactDraftUpdatedAt: string | null;
  restoredDrafts: RestoredDraftState;
  draftUpdatedAt: DraftTimestampState;
};

const tabOrder: TabKey[] = ["projects", "services", "insights", "testimonials", "settings"];

export function getAdminPanelSelectors({
  tab,
  showPendingOnly,
  editingProjectId,
  editingServiceId,
  editingInsightId,
  editingTestimonialId,
  projectFormIsDefault,
  serviceFormIsDefault,
  insightFormIsDefault,
  testimonialFormIsDefault,
  settingsForm,
  settingsMap,
  navigationContactDirty,
  navigationContactDraftRestored,
  navigationContactDraftUpdatedAt,
  restoredDrafts,
  draftUpdatedAt,
}: UseAdminPanelSelectorsArgs) {
  const projectDirty = editingProjectId !== null || !projectFormIsDefault;
  const serviceDirty = editingServiceId !== null || !serviceFormIsDefault;
  const insightDirty = editingInsightId !== null || !insightFormIsDefault;
  const testimonialDirty = editingTestimonialId !== null || !testimonialFormIsDefault;
  const settingsDirty = settingKeys.some((key) => (settingsForm[key] ?? "") !== (settingsMap[key] ?? ""));
  const hasUnsavedChanges =
    projectDirty || serviceDirty || insightDirty || testimonialDirty || settingsDirty || navigationContactDirty;

  const dirtyTabs: Partial<Record<TabKey, boolean>> = {
    projects: projectDirty,
    services: serviceDirty,
    insights: insightDirty,
    testimonials: testimonialDirty,
    settings: settingsDirty || navigationContactDirty,
  };

  const restoredDirtyTabs: Partial<Record<TabKey, boolean>> = {
    projects: Boolean(restoredDrafts.projects && projectDirty),
    services: Boolean(restoredDrafts.services && serviceDirty),
    insights: Boolean(restoredDrafts.insights && insightDirty),
    testimonials: Boolean(restoredDrafts.testimonials && testimonialDirty),
    settings: Boolean(
      (restoredDrafts.settings || navigationContactDraftRestored) && (settingsDirty || navigationContactDirty)
    ),
  };

  const dirtyTabCount = Object.values(dirtyTabs).filter(Boolean).length;
  const restoredDirtyCount = Object.values(restoredDirtyTabs).filter(Boolean).length;
  const newDirtyCount = Math.max(dirtyTabCount - restoredDirtyCount, 0);

  const visibleTabs = tabOrder
    .filter((item) => !showPendingOnly || dirtyTabs[item])
    .sort((left, right) => {
      if (!showPendingOnly) {
        return tabOrder.indexOf(left) - tabOrder.indexOf(right);
      }

      const leftRestored = restoredDirtyTabs[left] ? 1 : 0;
      const rightRestored = restoredDirtyTabs[right] ? 1 : 0;
      if (leftRestored !== rightRestored) {
        return rightRestored - leftRestored;
      }

      const leftDirty = dirtyTabs[left] ? 1 : 0;
      const rightDirty = dirtyTabs[right] ? 1 : 0;
      if (leftDirty !== rightDirty) {
        return rightDirty - leftDirty;
      }

      return tabOrder.indexOf(left) - tabOrder.indexOf(right);
    });

  const pendingQueue: PendingQueueItem[] = tabOrder
    .filter((item) => dirtyTabs[item])
    .sort((left, right) => {
      const leftRestored = restoredDirtyTabs[left] ? 1 : 0;
      const rightRestored = restoredDirtyTabs[right] ? 1 : 0;
      if (leftRestored !== rightRestored) {
        return rightRestored - leftRestored;
      }

      return tabOrder.indexOf(left) - tabOrder.indexOf(right);
    })
    .map((item) => ({
      key: item,
      label: item,
      tone: restoredDirtyTabs[item] ? "restored" : "new",
    }));

  const highestPriorityPendingTab =
    tabOrder.find((item) => restoredDirtyTabs[item]) ?? tabOrder.find((item) => dirtyTabs[item]) ?? null;
  const restoredQueueTabs = tabOrder.filter((item) => restoredDirtyTabs[item]);
  const pendingSummaryText = [
    "Pending Review Summary",
    ...pendingQueue.map((item, index) => `${index + 1}. ${item.label} - ${item.tone}`),
  ].join("\n");

  const activeDraftRestored = restoredDrafts[tab];
  const showDraftRestoredBanner =
    tab === "settings" ? Boolean(restoredDrafts.settings || navigationContactDraftRestored) : activeDraftRestored;
  const activeDraftUpdatedAt =
    tab === "settings"
      ? [draftUpdatedAt.settings, navigationContactDraftUpdatedAt]
          .filter((value): value is string => Boolean(value))
          .sort()
          .at(-1) ?? null
      : draftUpdatedAt[tab] ?? null;

  return {
    dirtyTabCount,
    dirtyTabs,
    hasUnsavedChanges,
    highestPriorityPendingTab,
    insightDirty,
    newDirtyCount,
    pendingQueue,
    pendingSummaryText,
    projectDirty,
    restoredDirtyCount,
    restoredDirtyTabs,
    restoredQueueTabs,
    serviceDirty,
    settingsDirty,
    showDraftRestoredBanner,
    testimonialDirty,
    visibleTabs,
    activeDraftUpdatedAt,
  };
}

export default function useAdminPanelSelectors({
  tab,
  showPendingOnly,
  editingProjectId,
  editingServiceId,
  editingInsightId,
  editingTestimonialId,
  projectFormIsDefault,
  serviceFormIsDefault,
  insightFormIsDefault,
  testimonialFormIsDefault,
  settingsForm,
  settingsMap,
  navigationContactDirty,
  navigationContactDraftRestored,
  navigationContactDraftUpdatedAt,
  restoredDrafts,
  draftUpdatedAt,
}: UseAdminPanelSelectorsArgs) {
  return useMemo(() => getAdminPanelSelectors({
    tab,
    showPendingOnly,
    editingProjectId,
    editingServiceId,
    editingInsightId,
    editingTestimonialId,
    projectFormIsDefault,
    serviceFormIsDefault,
    insightFormIsDefault,
    testimonialFormIsDefault,
    settingsForm,
    settingsMap,
    navigationContactDirty,
    navigationContactDraftRestored,
    navigationContactDraftUpdatedAt,
    restoredDrafts,
    draftUpdatedAt,
  }), [
    tab,
    showPendingOnly,
    editingProjectId,
    editingServiceId,
    editingInsightId,
    editingTestimonialId,
    projectFormIsDefault,
    serviceFormIsDefault,
    insightFormIsDefault,
    testimonialFormIsDefault,
    settingsForm,
    settingsMap,
    navigationContactDirty,
    navigationContactDraftRestored,
    navigationContactDraftUpdatedAt,
    restoredDrafts,
    draftUpdatedAt,
  ]);
}
