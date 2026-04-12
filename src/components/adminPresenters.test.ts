import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AdminLoginShell from "./AdminLoginShell";
import AdminPasswordSection from "./AdminPasswordSection";
import AdminStatusHeader from "./AdminStatusHeader";
import AdminUsersSection from "./AdminUsersSection";
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

test("AdminPasswordSection renders password change guidance", () => {
  const html = renderToStaticMarkup(
    React.createElement(AdminPasswordSection, {
      busy: false,
      form: { currentPassword: "", newPassword: "", confirmPassword: "" },
      onFormChange: () => undefined,
      onSubmit: () => undefined,
    })
  );

  assert.match(html, /Change Admin Password/);
  assert.match(html, /Current Password/);
  assert.match(html, /Confirm New Password/);
  assert.match(html, /signed out/i);
});

test("AdminUsersSection renders user directory and reset password state", () => {
  const html = renderToStaticMarkup(
    React.createElement(AdminUsersSection, {
      editingUserId: 7,
      editingUser: {
        id: 7,
        username: "editor1",
        email: "editor1@mikroliving.store",
        full_name: "Editor One",
        role: "editor",
        avatar_url: null,
        is_active: 1,
        last_login_at: "2026-04-12T09:00:00.000Z",
      },
      userDirty: true,
      resetPasswordDirty: false,
      userForm: {
        username: "editor1",
        email: "editor1@mikroliving.store",
        full_name: "Editor One",
        role: "editor",
        avatar_url: "",
        is_active: true,
        password: "",
        confirmPassword: "",
      },
      resetPasswordForm: { newPassword: "", confirmPassword: "" },
      users: [
        {
          id: 1,
          username: "admin",
          email: "admin@mikroliving.store",
          full_name: "Admin",
          role: "admin",
          avatar_url: null,
          is_active: 1,
          last_login_at: null,
        },
      ],
      busy: "idle",
      onDiscardChanges: () => undefined,
      onSubmit: () => undefined,
      onUserFormChange: () => undefined,
      onEditUser: () => undefined,
      onResetPasswordFormChange: () => undefined,
      onResetPasswordSubmit: () => undefined,
    }),
  );

  assert.match(html, /Create User|Edit User/);
  assert.match(html, /User Directory/);
  assert.match(html, /Reset Password/);
  assert.match(html, /admin@mikroliving\.store/);
});
