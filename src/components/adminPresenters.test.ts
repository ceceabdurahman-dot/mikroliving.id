import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminLoginShell from "./AdminLoginShell";
import AdminStatusHeader from "./AdminStatusHeader";
import PendingReviewQueue from "./PendingReviewQueue";

test("AdminStatusHeader renders pending badges and review shortcut", () => {
  const html = renderToStaticMarkup(
    React.createElement(AdminStatusHeader, {
      hasUnsavedChanges: true,
      dirtyTabCount: 2,
      restoredDirtyCount: 1,
      newDirtyCount: 1,
      highestPriorityPendingTab: "projects",
      onReviewRestoredFirst: () => undefined,
      onRefresh: () => undefined,
      onLogout: () => undefined,
    })
  );

  assert.match(html, /Unsaved Changes/);
  assert.match(html, /2 tab pending/);
  assert.match(html, /1 restored/);
  assert.match(html, /1 new edits/);
  assert.match(html, /Review Restored First/);
});

test("PendingReviewQueue renders pending items and bulk clear action", () => {
  const html = renderToStaticMarkup(
    React.createElement(PendingReviewQueue, {
      pendingQueue: [
        { key: "projects", label: "projects", tone: "restored" },
        { key: "settings", label: "settings", tone: "new" },
      ],
      restoredQueueCount: 1,
      onOpenTab: () => undefined,
      onClearAllRestoredDrafts: () => undefined,
      showPendingSummaryPreview: false,
      onTogglePendingSummaryPreview: () => undefined,
      onExportSummary: () => undefined,
      onCopyTextBlock: () => undefined,
      onDownloadTextFile: () => undefined,
      onResetPreferences: () => undefined,
      onSetFilenameFormat: () => undefined,
      isExporting: false,
      isDownloading: false,
      filenameFormat: "full",
      filenamePreview: "pending-review-summary-2-items-jakarta-2026-03-27_14-35.txt",
      pendingSummaryText: "Pending Review Summary",
    })
  );

  assert.match(html, /Pending Review Queue/);
  assert.match(html, /Clear All Restored Drafts/);
  assert.match(html, /projects/);
  assert.match(html, /settings/);
  assert.match(html, /restored/);
  assert.match(html, /new/);
});

test("AdminLoginShell renders login state and error message", () => {
  const html = renderToStaticMarkup(
    React.createElement(AdminLoginShell, {
      busy: true,
      loginForm: { username: "admin", password: "secret" },
      loginMessage: "Login failed.",
      onSubmit: () => undefined,
      onLoginFormChange: () => undefined,
    })
  );

  assert.match(html, /MikroLiving Control Room/);
  assert.match(html, /Signing In\.\.\./);
  assert.match(html, /Login failed\./);
  assert.match(html, /Username/);
});
