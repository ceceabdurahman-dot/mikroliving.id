import { useEffect, useState } from "react";
import { AdminContent } from "../services/api";
import {
  type DraftTimestampState,
  type FilenameFormat,
  type InsightForm,
  type ProjectForm,
  type RestoredDraftState,
  type ServiceForm,
  type TestimonialForm,
  emptyInsightForm,
  emptyProjectForm,
  emptyServiceForm,
  emptyTestimonialForm,
} from "./adminPanelTypes";
import {
  clearDraft,
  draftKeys,
  readDraft,
  readDraftUpdatedAt,
  readStoredFilenameFormat,
  toSettingsMap,
  writeDraft,
  writeStoredFilenameFormat,
} from "./adminPanelUtils";

type EntityDraft<T> = {
  editingId: number | null;
  form: T;
};

type UseAdminDraftStateArgs = {
  content: AdminContent | null;
  onSettingsDraftRestored?: (message: string) => void;
};

const hasEntityDraft = <T,>(draft: EntityDraft<T>, emptyForm: T) =>
  draft.editingId !== null || JSON.stringify(draft.form) !== JSON.stringify(emptyForm);

const readEntityDraft = <T,>(key: string, emptyForm: T): EntityDraft<T> =>
  readDraft<EntityDraft<T>>(key, {
    editingId: null,
    form: emptyForm,
  });

export default function useAdminDraftState({
  content,
  onSettingsDraftRestored,
}: UseAdminDraftStateArgs) {
  const [filenameFormat, setFilenameFormat] = useState<FilenameFormat>(() => readStoredFilenameFormat());
  const [navigationContactDirty, setNavigationContactDirty] = useState(false);
  const [navigationContactDraftRestored, setNavigationContactDraftRestored] = useState(false);
  const [navigationContactDraftUpdatedAt, setNavigationContactDraftUpdatedAt] = useState<string | null>(null);
  const [didRestoreSettingsDraft, setDidRestoreSettingsDraft] = useState(false);
  const [restoredDrafts, setRestoredDrafts] = useState<RestoredDraftState>({});
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<DraftTimestampState>({
    projects: readDraftUpdatedAt(draftKeys.project),
    services: readDraftUpdatedAt(draftKeys.service),
    insights: readDraftUpdatedAt(draftKeys.insight),
    testimonials: readDraftUpdatedAt(draftKeys.testimonial),
    settings: readDraftUpdatedAt(draftKeys.settings),
  });

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>(() =>
    readDraft<Record<string, string>>(draftKeys.settings, {})
  );

  const initialProjectDraft = readEntityDraft(draftKeys.project, emptyProjectForm);
  const initialServiceDraft = readEntityDraft(draftKeys.service, emptyServiceForm);
  const initialInsightDraft = readEntityDraft(draftKeys.insight, emptyInsightForm);
  const initialTestimonialDraft = readEntityDraft(draftKeys.testimonial, emptyTestimonialForm);

  const [editingProjectId, setEditingProjectId] = useState<number | null>(initialProjectDraft.editingId);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(initialServiceDraft.editingId);
  const [editingInsightId, setEditingInsightId] = useState<number | null>(initialInsightDraft.editingId);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(initialTestimonialDraft.editingId);

  const [projectForm, setProjectForm] = useState<ProjectForm>(initialProjectDraft.form);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(initialServiceDraft.form);
  const [insightForm, setInsightForm] = useState<InsightForm>(initialInsightDraft.form);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(initialTestimonialDraft.form);

  useEffect(() => {
    writeStoredFilenameFormat(filenameFormat);
  }, [filenameFormat]);

  useEffect(() => {
    const isDirty =
      editingProjectId !== null || JSON.stringify(projectForm) !== JSON.stringify(emptyProjectForm);

    if (isDirty) {
      const updatedAt = writeDraft(draftKeys.project, {
        editingId: editingProjectId,
        form: projectForm,
      });
      setDraftUpdatedAt((current) => ({ ...current, projects: updatedAt }));
    } else {
      clearDraft(draftKeys.project);
      setDraftUpdatedAt((current) => ({ ...current, projects: null }));
    }

    setRestoredDrafts((current) => (isDirty ? current : { ...current, projects: false }));
  }, [editingProjectId, projectForm]);

  useEffect(() => {
    const isDirty =
      editingServiceId !== null || JSON.stringify(serviceForm) !== JSON.stringify(emptyServiceForm);

    if (isDirty) {
      const updatedAt = writeDraft(draftKeys.service, {
        editingId: editingServiceId,
        form: serviceForm,
      });
      setDraftUpdatedAt((current) => ({ ...current, services: updatedAt }));
    } else {
      clearDraft(draftKeys.service);
      setDraftUpdatedAt((current) => ({ ...current, services: null }));
    }

    setRestoredDrafts((current) => (isDirty ? current : { ...current, services: false }));
  }, [editingServiceId, serviceForm]);

  useEffect(() => {
    const isDirty =
      editingInsightId !== null || JSON.stringify(insightForm) !== JSON.stringify(emptyInsightForm);

    if (isDirty) {
      const updatedAt = writeDraft(draftKeys.insight, {
        editingId: editingInsightId,
        form: insightForm,
      });
      setDraftUpdatedAt((current) => ({ ...current, insights: updatedAt }));
    } else {
      clearDraft(draftKeys.insight);
      setDraftUpdatedAt((current) => ({ ...current, insights: null }));
    }

    setRestoredDrafts((current) => (isDirty ? current : { ...current, insights: false }));
  }, [editingInsightId, insightForm]);

  useEffect(() => {
    const isDirty =
      editingTestimonialId !== null ||
      JSON.stringify(testimonialForm) !== JSON.stringify(emptyTestimonialForm);

    if (isDirty) {
      const updatedAt = writeDraft(draftKeys.testimonial, {
        editingId: editingTestimonialId,
        form: testimonialForm,
      });
      setDraftUpdatedAt((current) => ({ ...current, testimonials: updatedAt }));
    } else {
      clearDraft(draftKeys.testimonial);
      setDraftUpdatedAt((current) => ({ ...current, testimonials: null }));
    }

    setRestoredDrafts((current) => (isDirty ? current : { ...current, testimonials: false }));
  }, [editingTestimonialId, testimonialForm]);

  useEffect(() => {
    if (hasEntityDraft(initialProjectDraft, emptyProjectForm)) {
      setRestoredDrafts((current) => ({ ...current, projects: true }));
    }

    if (hasEntityDraft(initialServiceDraft, emptyServiceForm)) {
      setRestoredDrafts((current) => ({ ...current, services: true }));
    }

    if (hasEntityDraft(initialInsightDraft, emptyInsightForm)) {
      setRestoredDrafts((current) => ({ ...current, insights: true }));
    }

    if (hasEntityDraft(initialTestimonialDraft, emptyTestimonialForm)) {
      setRestoredDrafts((current) => ({ ...current, testimonials: true }));
    }
  }, []);

  useEffect(() => {
    if (!content) {
      return;
    }

    const serverSettingsMap = toSettingsMap(content.settings);
    const storedDraft = readDraft<Record<string, string>>(draftKeys.settings, {});
    const hasStoredDraft = Object.keys(storedDraft).length > 0;

    if (!hasStoredDraft) {
      setSettingsForm(serverSettingsMap);
      setDidRestoreSettingsDraft(false);
      setRestoredDrafts((current) => ({ ...current, settings: false }));
      return;
    }

    if (didRestoreSettingsDraft) {
      return;
    }

    setSettingsForm(storedDraft);
    setDidRestoreSettingsDraft(true);
    setRestoredDrafts((current) => ({ ...current, settings: true }));
    onSettingsDraftRestored?.("Restored unsaved site settings draft.");
  }, [content, didRestoreSettingsDraft, onSettingsDraftRestored]);

  useEffect(() => {
    if (!content) {
      return;
    }

    const currentSettingsMap = toSettingsMap(content.settings);
    const hasSettingsDraft = Object.keys(settingsForm).some(
      (key) => (settingsForm[key] ?? "") !== (currentSettingsMap[key] ?? "")
    );

    if (hasSettingsDraft) {
      const updatedAt = writeDraft(draftKeys.settings, settingsForm);
      setDraftUpdatedAt((current) => ({ ...current, settings: updatedAt }));
    } else {
      clearDraft(draftKeys.settings);
      setDraftUpdatedAt((current) => ({ ...current, settings: null }));
      setRestoredDrafts((current) => ({ ...current, settings: false }));
    }
  }, [content, settingsForm]);

  const resetNavigationContactDraftState = () => {
    setNavigationContactDirty(false);
    setNavigationContactDraftRestored(false);
    setNavigationContactDraftUpdatedAt(null);
  };

  return {
    draftUpdatedAt,
    editingInsightId,
    editingProjectId,
    editingServiceId,
    editingTestimonialId,
    filenameFormat,
    insightForm,
    navigationContactDirty,
    navigationContactDraftRestored,
    navigationContactDraftUpdatedAt,
    projectForm,
    restoredDrafts,
    serviceForm,
    settingsForm,
    testimonialForm,
    setDraftUpdatedAt,
    setEditingInsightId,
    setEditingProjectId,
    setEditingServiceId,
    setEditingTestimonialId,
    setFilenameFormat,
    setInsightForm,
    setNavigationContactDirty,
    setNavigationContactDraftRestored,
    setNavigationContactDraftUpdatedAt,
    setProjectForm,
    setRestoredDrafts,
    setServiceForm,
    setSettingsForm,
    setTestimonialForm,
    resetNavigationContactDraftState,
  };
}
