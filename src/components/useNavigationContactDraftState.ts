import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { draftKeys, readDraft, readDraftUpdatedAt, writeDraft, clearDraft } from "./adminPanelUtils";
import {
  type ContactForm,
  type NavigationContactBusyState,
  type NavigationForm,
  emptyContactForm,
  emptyNavigationForm,
} from "./navigationContactTypes";

type UseNavigationContactDraftStateArgs = {
  onDirtyChange: (value: boolean) => void;
  onDraftRestoredChange: (value: boolean) => void;
  onDraftAutosavedAtChange: (value: string | null) => void;
};

type EntityDraft<T> = { editingId: number | null; form: T };

const readEntityDraft = <T,>(key: string, emptyForm: T): EntityDraft<T> =>
  readDraft<EntityDraft<T>>(key, { editingId: null, form: emptyForm });

export default function useNavigationContactDraftState({
  onDirtyChange,
  onDraftRestoredChange,
  onDraftAutosavedAtChange,
}: UseNavigationContactDraftStateArgs) {
  const navigationDraft = readEntityDraft(draftKeys.navigation, emptyNavigationForm);
  const contactDraft = readEntityDraft(draftKeys.contact, emptyContactForm);

  const [busy, setBusy] = useState<NavigationContactBusyState>("idle");
  const [editingNavigationId, setEditingNavigationId] = useState<number | null>(navigationDraft.editingId);
  const [editingContactId, setEditingContactId] = useState<number | null>(contactDraft.editingId);
  const [navigationForm, setNavigationForm] = useState<NavigationForm>(navigationDraft.form);
  const [contactForm, setContactForm] = useState<ContactForm>(contactDraft.form);

  const navigationDirty =
    editingNavigationId !== null || JSON.stringify(navigationForm) !== JSON.stringify(emptyNavigationForm);
  const contactDirty =
    editingContactId !== null || JSON.stringify(contactForm) !== JSON.stringify(emptyContactForm);

  useEffect(() => {
    onDirtyChange(navigationDirty || contactDirty);
  }, [contactDirty, navigationDirty, onDirtyChange]);

  useEffect(() => {
    if (navigationDirty) {
      const updatedAt = writeDraft(draftKeys.navigation, {
        editingId: editingNavigationId,
        form: navigationForm,
      });
      onDraftAutosavedAtChange(updatedAt);
    } else {
      clearDraft(draftKeys.navigation);
      onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.contact));
    }
  }, [editingNavigationId, navigationDirty, navigationForm, onDraftAutosavedAtChange]);

  useEffect(() => {
    if (contactDirty) {
      const updatedAt = writeDraft(draftKeys.contact, {
        editingId: editingContactId,
        form: contactForm,
      });
      onDraftAutosavedAtChange(updatedAt);
    } else {
      clearDraft(draftKeys.contact);
      onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.navigation));
    }
  }, [contactDirty, contactForm, editingContactId, onDraftAutosavedAtChange]);

  useEffect(() => {
    const hasRestoredDraft =
      navigationDraft.editingId !== null ||
      JSON.stringify(navigationDraft.form) !== JSON.stringify(emptyNavigationForm) ||
      contactDraft.editingId !== null ||
      JSON.stringify(contactDraft.form) !== JSON.stringify(emptyContactForm);

    onDraftRestoredChange(hasRestoredDraft);
    onDraftAutosavedAtChange(readDraftUpdatedAt(draftKeys.contact) ?? readDraftUpdatedAt(draftKeys.navigation));
  }, [onDraftAutosavedAtChange, onDraftRestoredChange]);

  return {
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
  };
}
