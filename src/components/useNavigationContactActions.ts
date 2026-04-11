import { FormEvent } from "react";
import { api, ContactChannel, NavigationLink } from "../services/api";
import { clearDraft, draftKeys, getErrorMessage, readDraftUpdatedAt } from "./adminPanelUtils";
import {
  type ContactForm,
  type NavigationForm,
  emptyContactForm,
  emptyNavigationForm,
} from "./navigationContactTypes";

type UseNavigationContactActionsArgs = {
  editingNavigationId: number | null;
  editingContactId: number | null;
  navigationForm: NavigationForm;
  contactForm: ContactForm;
  setBusy: (value: "idle" | "saving" | "deleting") => void;
  setEditingNavigationId: (value: number | null) => void;
  setEditingContactId: (value: number | null) => void;
  setNavigationForm: (value: NavigationForm | ((current: NavigationForm) => NavigationForm)) => void;
  setContactForm: (value: ContactForm | ((current: ContactForm) => ContactForm)) => void;
  onRefresh: () => Promise<void>;
  onMessage: (value: string) => void;
  onDraftRestoredChange: (value: boolean) => void;
  onDraftAutosavedAtChange: (value: string | null) => void;
};

export default function useNavigationContactActions({
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
}: UseNavigationContactActionsArgs) {
  const discardNavigationChanges = () => {
    if (!window.confirm("Discard the unsaved navigation link changes?")) {
      return;
    }

    setEditingNavigationId(null);
    setNavigationForm(emptyNavigationForm);
    clearDraft(draftKeys.navigation);
    onDraftRestoredChange(false);
    onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.contact));
    onMessage("Navigation link changes discarded.");
  };

  const discardContactChanges = () => {
    if (!window.confirm("Discard the unsaved contact channel changes?")) {
      return;
    }

    setEditingContactId(null);
    setContactForm(emptyContactForm);
    clearDraft(draftKeys.contact);
    onDraftRestoredChange(false);
    onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.navigation));
    onMessage("Contact channel changes discarded.");
  };

  const saveNavigation = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      if (editingNavigationId) {
        await api.updateNavigationLink(editingNavigationId, navigationForm);
        onMessage("Navigation link updated successfully.");
      } else {
        await api.createNavigationLink(navigationForm);
        onMessage("Navigation link created successfully.");
      }
      setEditingNavigationId(null);
      setNavigationForm(emptyNavigationForm);
      clearDraft(draftKeys.navigation);
      onDraftRestoredChange(false);
      onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.contact));
      await onRefresh();
    } catch (error) {
      onMessage(getErrorMessage(error, "We couldn't save the navigation link right now."));
    } finally {
      setBusy("idle");
    }
  };

  const saveContact = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      if (editingContactId) {
        await api.updateContactChannel(editingContactId, contactForm);
        onMessage("Contact channel updated successfully.");
      } else {
        await api.createContactChannel(contactForm);
        onMessage("Contact channel created successfully.");
      }
      setEditingContactId(null);
      setContactForm(emptyContactForm);
      clearDraft(draftKeys.contact);
      onDraftRestoredChange(false);
      onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.navigation));
      await onRefresh();
    } catch (error) {
      onMessage(getErrorMessage(error, "We couldn't save the contact channel right now."));
    } finally {
      setBusy("idle");
    }
  };

  const removeNavigation = async (id: number) => {
    if (!window.confirm("Delete this navigation link?")) {
      return;
    }

    setBusy("deleting");
    try {
      await api.deleteNavigationLink(id);
      onMessage("Navigation link deleted successfully.");
      await onRefresh();
    } catch (error) {
      onMessage(getErrorMessage(error, "We couldn't delete the navigation link right now."));
    } finally {
      setBusy("idle");
    }
  };

  const removeContact = async (id: number) => {
    if (!window.confirm("Delete this contact channel?")) {
      return;
    }

    setBusy("deleting");
    try {
      await api.deleteContactChannel(id);
      onMessage("Contact channel deleted successfully.");
      await onRefresh();
    } catch (error) {
      onMessage(getErrorMessage(error, "We couldn't delete the contact channel right now."));
    } finally {
      setBusy("idle");
    }
  };

  const editNavigation = (link: NavigationLink) => {
    setEditingNavigationId(link.id);
    setNavigationForm({
      label: link.label,
      url: link.url,
      location: link.location,
      sort_order: link.sort_order,
      opens_new_tab: Boolean(link.opens_new_tab),
      is_active: Boolean(link.is_active),
    });
  };

  const editContact = (channel: ContactChannel) => {
    setEditingContactId(channel.id);
    setContactForm({
      label: channel.label,
      value_text: channel.value_text,
      href: channel.href || "",
      icon_key: channel.icon_key || "MessageCircle",
      location_label: channel.location_label || "",
      sort_order: channel.sort_order,
      is_active: Boolean(channel.is_active),
    });
  };

  return {
    discardContactChanges,
    discardNavigationChanges,
    editContact,
    editNavigation,
    removeContact,
    removeNavigation,
    saveContact,
    saveNavigation,
  };
}
