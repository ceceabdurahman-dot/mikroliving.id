import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { api } from "../services/api";
import {
  type BusyState,
  type DraftTimestampState,
  type InsightForm,
  type ProjectForm,
  type RestoredDraftState,
  type ServiceForm,
  type TestimonialForm,
  emptyInsightForm,
  emptyProjectForm,
  emptyServiceForm,
  emptyTestimonialForm,
  settingKeys,
} from "./adminPanelTypes";
import { clearDraft, draftKeys, getErrorMessage } from "./adminPanelUtils";

type EntityKind = "project" | "service" | "insight" | "testimonial";

type UseAdminContentActionsArgs = {
  editingProjectId: number | null;
  editingServiceId: number | null;
  editingInsightId: number | null;
  editingTestimonialId: number | null;
  projectForm: ProjectForm;
  serviceForm: ServiceForm;
  insightForm: InsightForm;
  testimonialForm: TestimonialForm;
  settingsForm: Record<string, string>;
  settingsMap: Record<string, string>;
  setBusy: (value: BusyState) => void;
  setMessage: (value: string) => void;
  refreshDashboard: () => Promise<void>;
  setDraftUpdatedAt: Dispatch<SetStateAction<DraftTimestampState>>;
  setRestoredDrafts: Dispatch<SetStateAction<RestoredDraftState>>;
  setEditingProjectId: Dispatch<SetStateAction<number | null>>;
  setEditingServiceId: Dispatch<SetStateAction<number | null>>;
  setEditingInsightId: Dispatch<SetStateAction<number | null>>;
  setEditingTestimonialId: Dispatch<SetStateAction<number | null>>;
  setProjectForm: Dispatch<SetStateAction<ProjectForm>>;
  setServiceForm: Dispatch<SetStateAction<ServiceForm>>;
  setInsightForm: Dispatch<SetStateAction<InsightForm>>;
  setTestimonialForm: Dispatch<SetStateAction<TestimonialForm>>;
  setSettingsForm: Dispatch<SetStateAction<Record<string, string>>>;
  resetNavigationContactDraftState: () => void;
};

export default function useAdminContentActions({
  editingProjectId,
  editingServiceId,
  editingInsightId,
  editingTestimonialId,
  projectForm,
  serviceForm,
  insightForm,
  testimonialForm,
  settingsForm,
  settingsMap,
  setBusy,
  setMessage,
  refreshDashboard,
  setDraftUpdatedAt,
  setRestoredDrafts,
  setEditingProjectId,
  setEditingServiceId,
  setEditingInsightId,
  setEditingTestimonialId,
  setProjectForm,
  setServiceForm,
  setInsightForm,
  setTestimonialForm,
  setSettingsForm,
  resetNavigationContactDraftState,
}: UseAdminContentActionsArgs) {
  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
    onSuccess: (imageUrl: string, publicId: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setBusy("uploading");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read image."));
        reader.readAsDataURL(file);
      });
      const upload = await api.uploadAdminImage({ fileName: file.name, dataUrl });
      onSuccess(upload.imageUrl, upload.publicId);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't upload the image right now."));
    } finally {
      setBusy("idle");
      event.target.value = "";
    }
  };

  const resetProjectChanges = (message = "Project changes discarded.") => {
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
    clearDraft(draftKeys.project);
    setRestoredDrafts((current) => ({ ...current, projects: false }));
    setMessage(message);
  };

  const resetServiceChanges = (message = "Service changes discarded.") => {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    clearDraft(draftKeys.service);
    setRestoredDrafts((current) => ({ ...current, services: false }));
    setMessage(message);
  };

  const resetInsightChanges = (message = "Insight changes discarded.") => {
    setEditingInsightId(null);
    setInsightForm(emptyInsightForm);
    clearDraft(draftKeys.insight);
    setRestoredDrafts((current) => ({ ...current, insights: false }));
    setMessage(message);
  };

  const resetTestimonialChanges = (message = "Testimonial changes discarded.") => {
    setEditingTestimonialId(null);
    setTestimonialForm(emptyTestimonialForm);
    clearDraft(draftKeys.testimonial);
    setRestoredDrafts((current) => ({ ...current, testimonials: false }));
    setMessage(message);
  };

  const discardProjectChanges = () => {
    if (!window.confirm("Discard the unsaved project changes?")) {
      return;
    }
    resetProjectChanges();
  };

  const discardServiceChanges = () => {
    if (!window.confirm("Discard the unsaved service changes?")) {
      return;
    }
    resetServiceChanges();
  };

  const discardInsightChanges = () => {
    if (!window.confirm("Discard the unsaved insight changes?")) {
      return;
    }
    resetInsightChanges();
  };

  const discardTestimonialChanges = () => {
    if (!window.confirm("Discard the unsaved testimonial changes?")) {
      return;
    }
    resetTestimonialChanges();
  };

  const discardSettingsChanges = () => {
    if (!window.confirm("Discard the unsaved site settings changes?")) {
      return;
    }
    setSettingsForm(settingsMap);
    clearDraft(draftKeys.settings);
    setRestoredDrafts((current) => ({ ...current, settings: false }));
    setMessage("Site settings changes discarded.");
  };

  const saveProject = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      if (editingProjectId) {
        await api.updateProject(editingProjectId, projectForm);
        setMessage("Project updated successfully.");
      } else {
        await api.createProject(projectForm);
        setMessage("Project created successfully.");
      }
      setEditingProjectId(null);
      setProjectForm(emptyProjectForm);
      clearDraft(draftKeys.project);
      setRestoredDrafts((current) => ({ ...current, projects: false }));
      await refreshDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't save the project right now."));
    } finally {
      setBusy("idle");
    }
  };

  const saveService = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      if (editingServiceId) {
        await api.updateService(editingServiceId, serviceForm);
        setMessage("Service updated successfully.");
      } else {
        await api.createService(serviceForm);
        setMessage("Service created successfully.");
      }
      setEditingServiceId(null);
      setServiceForm(emptyServiceForm);
      clearDraft(draftKeys.service);
      setRestoredDrafts((current) => ({ ...current, services: false }));
      await refreshDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't save the service right now."));
    } finally {
      setBusy("idle");
    }
  };

  const saveInsight = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      const payload = {
        ...insightForm,
        published_at: insightForm.published_at
          ? new Date(insightForm.published_at).toISOString().slice(0, 19).replace("T", " ")
          : null,
      };
      if (editingInsightId) {
        await api.updateInsight(editingInsightId, payload);
        setMessage("Insight updated successfully.");
      } else {
        await api.createInsight(payload);
        setMessage("Insight created successfully.");
      }
      setEditingInsightId(null);
      setInsightForm(emptyInsightForm);
      clearDraft(draftKeys.insight);
      setRestoredDrafts((current) => ({ ...current, insights: false }));
      await refreshDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't save the insight right now."));
    } finally {
      setBusy("idle");
    }
  };

  const saveTestimonial = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      if (editingTestimonialId) {
        await api.updateTestimonial(editingTestimonialId, testimonialForm);
        setMessage("Testimonial updated successfully.");
      } else {
        await api.createTestimonial(testimonialForm);
        setMessage("Testimonial created successfully.");
      }
      setEditingTestimonialId(null);
      setTestimonialForm(emptyTestimonialForm);
      clearDraft(draftKeys.testimonial);
      setRestoredDrafts((current) => ({ ...current, testimonials: false }));
      await refreshDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't save the testimonial right now."));
    } finally {
      setBusy("idle");
    }
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("saving");
    try {
      await api.updateSiteSettings(
        settingKeys.map((setting_key) => ({
          setting_key,
          setting_value: settingsForm[setting_key] ?? "",
        }))
      );
      setMessage("Site settings updated successfully.");
      clearDraft(draftKeys.settings);
      setRestoredDrafts((current) => ({ ...current, settings: false }));
      await refreshDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error, "We couldn't save the site settings right now."));
    } finally {
      setBusy("idle");
    }
  };

  const removeItem = async (kind: EntityKind, id: number) => {
    if (!window.confirm(`Delete this ${kind}?`)) {
      return;
    }

    setBusy("deleting");
    try {
      if (kind === "project") await api.deleteProject(id);
      if (kind === "service") await api.deleteService(id);
      if (kind === "insight") await api.deleteInsight(id);
      if (kind === "testimonial") await api.deleteTestimonial(id);
      setMessage(`${kind[0].toUpperCase()}${kind.slice(1)} deleted successfully.`);
      await refreshDashboard();
    } catch (error) {
      setMessage(getErrorMessage(error, `We couldn't delete the ${kind} right now.`));
    } finally {
      setBusy("idle");
    }
  };

  const formatHeroStats = (fallbackValue: string) => {
    try {
      const parsed = JSON.parse(settingsForm.hero_stats ?? fallbackValue ?? "[]");
      setSettingsForm((current) => ({ ...current, hero_stats: JSON.stringify(parsed, null, 2) }));
      setMessage("Hero stats JSON formatted successfully.");
    } catch {
      setMessage("Hero stats JSON could not be formatted because the current value is invalid.");
    }
  };

  const resetSiteSettingsToDefaults = (defaultValues: Record<string, string>) => {
    setSettingsForm(defaultValues);
    setMessage("Editable site settings reset to defaults. Save to apply the reset.");
  };

  const clearSettingsRestoredDraft = async () => {
    clearDraft(draftKeys.settings);
    clearDraft(draftKeys.navigation);
    clearDraft(draftKeys.contact);
    resetNavigationContactDraftState();
    setDraftUpdatedAt((current) => ({ ...current, settings: null }));
    setRestoredDrafts((current) => ({ ...current, settings: false }));
    await refreshDashboard();
    setMessage("Restored draft cleared. Showing the latest saved settings.");
  };

  return {
    clearSettingsRestoredDraft,
    discardInsightChanges,
    discardProjectChanges,
    discardServiceChanges,
    discardSettingsChanges,
    discardTestimonialChanges,
    formatHeroStats,
    removeItem,
    resetInsightChanges,
    resetProjectChanges,
    resetServiceChanges,
    resetSiteSettingsToDefaults,
    resetTestimonialChanges,
    saveInsight,
    saveProject,
    saveService,
    saveSettings,
    saveTestimonial,
    uploadImage,
  };
}
