import assert from "node:assert/strict";
import test from "node:test";
import { getAdminPanelSelectors } from "./useAdminPanelSelectors";

const baseArgs = {
  tab: "settings" as const,
  showPendingOnly: true,
  editingProjectId: null,
  editingServiceId: null,
  editingInsightId: null,
  editingTestimonialId: null,
  projectFormIsDefault: true,
  serviceFormIsDefault: true,
  insightFormIsDefault: true,
  testimonialFormIsDefault: true,
  settingsForm: {
    brand_name: "MikroLiving Updated",
  },
  settingsMap: {
    brand_name: "MikroLiving",
  },
  navigationContactDirty: false,
  navigationContactDraftRestored: false,
  navigationContactDraftUpdatedAt: null,
  restoredDrafts: {
    projects: true,
    settings: true,
  },
  draftUpdatedAt: {
    projects: "2026-03-27T08:00:00.000Z",
    settings: "2026-03-27T09:00:00.000Z",
  },
};

test("getAdminPanelSelectors prioritizes restored tabs in pending queue and visible tabs", () => {
  const result = getAdminPanelSelectors({
    ...baseArgs,
    editingProjectId: 7,
    projectFormIsDefault: false,
  });

  assert.deepEqual(result.visibleTabs, ["projects", "settings"]);
  assert.deepEqual(
    result.pendingQueue.map((item) => `${item.key}:${item.tone}`),
    ["projects:restored", "settings:restored"]
  );
  assert.equal(result.highestPriorityPendingTab, "projects");
  assert.equal(result.dirtyTabCount, 2);
  assert.equal(result.restoredDirtyCount, 2);
  assert.equal(result.newDirtyCount, 0);
});

test("getAdminPanelSelectors tracks new edits separately from restored drafts", () => {
  const result = getAdminPanelSelectors({
    ...baseArgs,
    showPendingOnly: false,
    restoredDrafts: { settings: true },
    editingServiceId: 4,
    serviceFormIsDefault: false,
  });

  assert.equal(result.dirtyTabs.services, true);
  assert.equal(result.restoredDirtyTabs.services, false);
  assert.equal(result.restoredDirtyCount, 1);
  assert.equal(result.newDirtyCount, 1);
});

test("getAdminPanelSelectors uses latest settings-related autosave timestamp", () => {
  const result = getAdminPanelSelectors({
    ...baseArgs,
    navigationContactDirty: true,
    navigationContactDraftRestored: true,
    navigationContactDraftUpdatedAt: "2026-03-27T10:30:00.000Z",
  });

  assert.equal(result.showDraftRestoredBanner, true);
  assert.equal(result.activeDraftUpdatedAt, "2026-03-27T10:30:00.000Z");
  assert.match(result.pendingSummaryText, /1\. settings - restored/);
});
