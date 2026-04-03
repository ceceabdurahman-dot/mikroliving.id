import { FormEvent } from "react";
import { ContactChannel, NavigationLink } from "../services/api";
import NavigationContactEditor from "./NavigationContactEditor";
import SiteSettingsEditor from "./SiteSettingsEditor";

type AdminSettingsSectionProps = {
  settingsDirty: boolean;
  settings: Record<string, string>;
  navigationLinks: NavigationLink[];
  contactChannels: ContactChannel[];
  busy: boolean;
  onDiscardChanges: () => void;
  onSettingsChange: (key: string, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onFormatHeroStats: () => void;
  onResetDefaults: () => void;
  onRefresh: () => Promise<void>;
  onMessage: (value: string) => void;
  onNavigationDirtyChange: (value: boolean) => void;
  onNavigationDraftRestoredChange: (value: boolean) => void;
  onNavigationDraftAutosavedAtChange: (value: string | null) => void;
};

export default function AdminSettingsSection({
  settingsDirty,
  settings,
  navigationLinks,
  contactChannels,
  busy,
  onDiscardChanges,
  onSettingsChange,
  onSubmit,
  onFormatHeroStats,
  onResetDefaults,
  onRefresh,
  onMessage,
  onNavigationDirtyChange,
  onNavigationDraftRestoredChange,
  onNavigationDraftAutosavedAtChange,
}: AdminSettingsSectionProps) {
  return (
    <div className="space-y-6">
      {settingsDirty ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDiscardChanges}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700"
          >
            Discard Changes
          </button>
        </div>
      ) : null}
      <SiteSettingsEditor
        settings={settings}
        onChange={onSettingsChange}
        onSubmit={onSubmit}
        onFormatHeroStats={onFormatHeroStats}
        onResetDefaults={onResetDefaults}
        disabled={busy}
      />
      <NavigationContactEditor
        navigationLinks={navigationLinks}
        contactChannels={contactChannels}
        onRefresh={onRefresh}
        onMessage={onMessage}
        onDirtyChange={onNavigationDirtyChange}
        onDraftRestoredChange={onNavigationDraftRestoredChange}
        onDraftAutosavedAtChange={onNavigationDraftAutosavedAtChange}
      />
    </div>
  );
}
