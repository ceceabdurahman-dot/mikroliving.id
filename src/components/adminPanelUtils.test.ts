import assert from "node:assert/strict";
import test from "node:test";
import {
  clearDraft,
  clearStoredFilenameFormat,
  draftKeys,
  formatPendingSummaryFilename,
  formatPendingSummaryShortFilename,
  getErrorMessage,
  readDraft,
  readStoredFilenameFormat,
  toSettingsMap,
  writeDraft,
  writeStoredFilenameFormat,
} from "./adminPanelUtils";

type LocalStorageMock = {
  length: number;
  clear: () => void;
  getItem: (key: string) => string | null;
  key: (index: number) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function installWindowMock() {
  const store = new Map<string, string>();
  const localStorage: LocalStorageMock = {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };

  (globalThis as { window?: { localStorage: LocalStorageMock } }).window = {
    localStorage,
  };

  return {
    store,
    cleanup: () => {
      Reflect.deleteProperty(globalThis as { window?: { localStorage: LocalStorageMock } }, "window");
    },
  };
}

test("getErrorMessage reads API error payload when available", () => {
  const message = getErrorMessage(
    { response: { data: { error: "Something went wrong." } } },
    "Fallback message"
  );

  assert.equal(message, "Something went wrong.");
});

test("toSettingsMap normalizes settings array into lookup object", () => {
  const result = toSettingsMap([
    {
      id: 1,
      setting_group: "branding",
      setting_key: "brand_name",
      label: "Brand Name",
      value_type: "text",
      setting_value: "MikroLiving",
    },
    {
      id: 2,
      setting_group: "contact",
      setting_key: "contact_intro",
      label: "Contact Intro",
      value_type: "textarea",
      setting_value: null,
    },
  ]);

  assert.deepEqual(result, {
    brand_name: "MikroLiving",
    contact_intro: "",
  });
});

test("draft helpers read and write localStorage envelopes", () => {
  const { cleanup } = installWindowMock();

  try {
    const updatedAt = writeDraft(draftKeys.project, { editingId: 10, form: { title: "Demo" } });
    const restored = readDraft(draftKeys.project, { editingId: null, form: { title: "" } });

    assert.equal(typeof updatedAt, "string");
    assert.deepEqual(restored, { editingId: 10, form: { title: "Demo" } });

    clearDraft(draftKeys.project);
    assert.deepEqual(readDraft(draftKeys.project, { ok: true }), { ok: true });
  } finally {
    cleanup();
  }
});

test("filename format preference helpers persist short/full values", () => {
  const { cleanup } = installWindowMock();

  try {
    assert.equal(readStoredFilenameFormat(), "full");
    writeStoredFilenameFormat("short");
    assert.equal(readStoredFilenameFormat(), "short");
    clearStoredFilenameFormat();
    assert.equal(readStoredFilenameFormat(), "full");
  } finally {
    cleanup();
  }
});

test("pending summary filename helpers format Jakarta-friendly filenames", () => {
  const date = new Date("2026-03-27T07:35:00.000Z");

  assert.equal(
    formatPendingSummaryFilename(3, date),
    "pending-review-summary-3-items-jakarta-2026-03-27_14-35.txt"
  );
  assert.equal(formatPendingSummaryShortFilename(date), "pending-summary-2026-03-27.txt");
});
