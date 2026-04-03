import { FormEvent, useEffect, useState } from "react";
import { api, ContactChannel, NavigationLink } from "../services/api";
import {
  contactIcons,
  emptyContactForm,
  emptyNavigationForm,
  type NavigationForm,
} from "./navigationContactTypes";
import useNavigationContactActions from "./useNavigationContactActions";
import useNavigationContactDraftState from "./useNavigationContactDraftState";

export default function NavigationContactEditor({
  navigationLinks,
  contactChannels,
  onRefresh,
  onMessage,
  onDirtyChange,
  onDraftRestoredChange,
  onDraftAutosavedAtChange,
}: {
  navigationLinks: NavigationLink[];
  contactChannels: ContactChannel[];
  onRefresh: () => Promise<void>;
  onMessage: (value: string) => void;
  onDirtyChange: (value: boolean) => void;
  onDraftRestoredChange: (value: boolean) => void;
  onDraftAutosavedAtChange: (value: string | null) => void;
}) {
  const {
    busy,
    contactDirty,
    contactForm,
    editingContactId,
    editingNavigationId,
    navigationDirty,
    navigationForm,
    setBusy,
    setContactForm,
    setEditingContactId,
    setEditingNavigationId,
    setNavigationForm,
  } = useNavigationContactDraftState({
    onDirtyChange,
    onDraftRestoredChange,
    onDraftAutosavedAtChange,
  });
  const {
    discardContactChanges,
    discardNavigationChanges,
    editContact,
    editNavigation,
    removeContact,
    removeNavigation,
    saveContact,
    saveNavigation,
  } = useNavigationContactActions({
    editingNavigationId,
    editingContactId,
    navigationForm,
    contactForm,
    setBusy,
    setEditingNavigationId,
    setEditingContactId,
    setNavigationForm,
    setContactForm,
    onRefresh,
    onMessage,
    onDraftRestoredChange,
    onDraftAutosavedAtChange,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-headline">{editingNavigationId ? "Edit Navigation Link" : "Create Navigation Link"}</h2>
            <div className="flex gap-3">
              {editingNavigationId || navigationDirty ? (
                <button type="button" onClick={discardNavigationChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">
                  Discard Changes
                </button>
              ) : null}
              {editingNavigationId ? <button type="button" onClick={discardNavigationChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Cancel</button> : null}
            </div>
          </div>
          <form className="space-y-4" onSubmit={saveNavigation}>
            <input value={navigationForm.label} onChange={(event) => setNavigationForm((current) => ({ ...current, label: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Label" />
            <input value={navigationForm.url} onChange={(event) => setNavigationForm((current) => ({ ...current, url: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="URL or anchor" />
            <select value={navigationForm.location} onChange={(event) => setNavigationForm((current) => ({ ...current, location: event.target.value as NavigationForm["location"] }))} className="w-full rounded-xl border border-stone-200 px-4 py-3">
              <option value="header">header</option>
              <option value="footer">footer</option>
              <option value="legal">legal</option>
            </select>
            <input type="number" value={navigationForm.sort_order} onChange={(event) => setNavigationForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Sort order" />
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-3"><input type="checkbox" checked={navigationForm.opens_new_tab} onChange={(event) => setNavigationForm((current) => ({ ...current, opens_new_tab: event.target.checked }))} /> Open in new tab</label>
              <label className="inline-flex items-center gap-3"><input type="checkbox" checked={navigationForm.is_active} onChange={(event) => setNavigationForm((current) => ({ ...current, is_active: event.target.checked }))} /> Active</label>
            </div>
            <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{editingNavigationId ? "Update Navigation Link" : "Create Navigation Link"}</button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-2xl font-headline">Navigation Links</h2>
          {navigationLinks.map((link) => (
            <article key={link.id} className="rounded-2xl border border-stone-200 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{link.location}</p>
              <h3 className="mt-2 text-lg font-headline">{link.label}</h3>
              <p className="mt-2 text-sm text-stone-600">{link.url}</p>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => editNavigation(link)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Edit</button>
                <button type="button" onClick={() => removeNavigation(link.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
              </div>
            </article>
          ))}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-headline">{editingContactId ? "Edit Contact Channel" : "Create Contact Channel"}</h2>
            <div className="flex gap-3">
              {editingContactId || contactDirty ? (
                <button type="button" onClick={discardContactChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">
                  Discard Changes
                </button>
              ) : null}
              {editingContactId ? <button type="button" onClick={discardContactChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Cancel</button> : null}
            </div>
          </div>
          <form className="space-y-4" onSubmit={saveContact}>
            <input value={contactForm.label} onChange={(event) => setContactForm((current) => ({ ...current, label: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Label" />
            <input value={contactForm.value_text} onChange={(event) => setContactForm((current) => ({ ...current, value_text: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Displayed value" />
            <input value={contactForm.href} onChange={(event) => setContactForm((current) => ({ ...current, href: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Link target" />
            <select value={contactForm.icon_key} onChange={(event) => setContactForm((current) => ({ ...current, icon_key: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3">
              {contactIcons.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <input value={contactForm.location_label} onChange={(event) => setContactForm((current) => ({ ...current, location_label: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Optional location label" />
            <input type="number" value={contactForm.sort_order} onChange={(event) => setContactForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Sort order" />
            <label className="inline-flex items-center gap-3"><input type="checkbox" checked={contactForm.is_active} onChange={(event) => setContactForm((current) => ({ ...current, is_active: event.target.checked }))} /> Active</label>
            <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{editingContactId ? "Update Contact Channel" : "Create Contact Channel"}</button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-2xl font-headline">Contact Channels</h2>
          {contactChannels.map((channel) => (
            <article key={channel.id} className="rounded-2xl border border-stone-200 p-4">
              <h3 className="text-lg font-headline">{channel.label}</h3>
              <p className="mt-2 text-sm text-stone-500">{channel.value_text}</p>
              <p className="mt-2 text-sm text-stone-600">{channel.href}</p>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => editContact(channel)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Edit</button>
                <button type="button" onClick={() => removeContact(channel.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
