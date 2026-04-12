import { FormEvent } from "react";
import { ContactChannel, NavigationLink } from "../services/api";
import AdminPasswordSection from "./AdminPasswordSection";
import NavigationContactEditor from "./NavigationContactEditor";
import SiteSettingsEditor from "./SiteSettingsEditor";
import { PasswordChangeForm } from "./adminPanelTypes";

type AdminSettingsSectionProps = {
  canManageSystemSettings: boolean;
  settingsDirty: boolean;
  settings: Record<string, string>;
  passwordForm: PasswordChangeForm;
  navigationLinks: NavigationLink[];
  contactChannels: ContactChannel[];
  busy: boolean;
  onDiscardChanges: () => void;
  onSettingsChange: (key: string, value: string) => void;
  onPasswordFormChange: (updater: (current: PasswordChangeForm) => PasswordChangeForm) => void;
  onPasswordSubmit: (event: FormEvent) => void | Promise<void>;
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
  canManageSystemSettings,
  settingsDirty,
  settings,
  passwordForm,
  navigationLinks,
  contactChannels,
  busy,
  onDiscardChanges,
  onSettingsChange,
  onPasswordFormChange,
  onPasswordSubmit,
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
      <AdminPasswordSection
        form={passwordForm}
        busy={busy}
        onFormChange={onPasswordFormChange}
        onSubmit={onPasswordSubmit}
      />

      {!canManageSystemSettings ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h2 className="text-2xl font-headline text-stone-950">Admin-Only System Settings</h2>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            Akun editor tetap bisa mengubah password sendiri, tetapi pengaturan hero, footer, navigation,
            contact channel, dan manajemen user hanya tersedia untuk role admin.
          </p>
        </section>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
