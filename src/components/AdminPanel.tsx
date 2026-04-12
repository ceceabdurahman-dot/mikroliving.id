import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminDashboardShell from "./AdminDashboardShell";
import AdminInquiriesSection from "./AdminInquiriesSection";
import AdminInsightsSection from "./AdminInsightsSection";
import AdminLoginShell from "./AdminLoginShell";
import AdminOverviewSection from "./AdminOverviewSection";
import AdminProjectsSection from "./AdminProjectsSection";
import AdminServicesSection from "./AdminServicesSection";
import AdminSettingsSection from "./AdminSettingsSection";
import AdminTestimonialsSection from "./AdminTestimonialsSection";
import AdminToastViewport from "./AdminToastViewport";
import BrandMark from "./BrandMark";
import {
  categories,
  emptyInquiryForm,
  emptyInsightForm,
  emptyPasswordChangeForm,
  emptyProjectForm,
  emptyServiceForm,
  emptyTestimonialForm,
  inquiryStatuses,
  serviceIcons,
  type BusyState,
  type InquiryForm,
  type InsightForm,
  type LoginMessageTone,
  type LoginForm,
  type PasswordChangeForm,
  type ProjectForm,
  type ServiceForm,
  type TabKey,
  type TestimonialForm,
  type ToastItem,
} from "./adminPanelTypes";
import { defaultEditableSiteSettings } from "./siteSettingsConfig";
import {
  type AdminDashboardData,
  type InquiryItem,
  type InsightItem,
  type Project,
  type ServiceItem,
  type TestimonialItem,
  api,
} from "../services/api";

const initialLoginForm: LoginForm = { username: "", password: "" };

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Failed to read file."));
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function normalizeDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function mapSettings(settings: AdminDashboardData["settings"]) {
  const next = { ...defaultEditableSiteSettings };
  settings.forEach((item) => {
    next[item.setting_key] = item.setting_value ?? "";
  });
  return next;
}

function mapProjectToForm(project: Project): ProjectForm {
  return {
    title: project.title,
    category: project.category,
    location: project.location,
    size: project.size,
    image_url: project.image_url,
    description: project.description ?? "",
    is_featured: Boolean(project.is_featured),
  };
}

function mapServiceToForm(service: ServiceItem): ServiceForm {
  return {
    icon_key: service.icon_key,
    title: service.title,
    description: service.description,
    sort_order: service.sort_order,
    is_active: Boolean(service.is_active),
  };
}

function mapInsightToForm(insight: InsightItem): InsightForm {
  return {
    tag: insight.tag,
    title: insight.title,
    excerpt: insight.excerpt,
    content: insight.content ?? "",
    image_url: insight.image_url ?? "",
    image_public_id: insight.image_public_id ?? "",
    author_name: insight.author_name ?? "MikroLiving Studio",
    is_published: Boolean(insight.is_published),
    sort_order: insight.sort_order,
    published_at: normalizeDateTimeLocal(insight.published_at),
  };
}

function mapTestimonialToForm(testimonial: TestimonialItem): TestimonialForm {
  return {
    client_name: testimonial.client_name,
    client_label: testimonial.client_label ?? "",
    quote: testimonial.quote,
    image_url: testimonial.image_url ?? "",
    image_public_id: testimonial.image_public_id ?? "",
    rating: testimonial.rating ?? 5,
    is_featured: Boolean(testimonial.is_featured),
    sort_order: testimonial.sort_order,
    is_active: Boolean(testimonial.is_active),
  };
}

function mapInquiryToForm(inquiry: InquiryItem): InquiryForm {
  return {
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? "",
    message: inquiry.message,
    status: inquiry.status,
    source: inquiry.source,
    admin_note: inquiry.admin_note ?? "",
    replied_at: normalizeDateTimeLocal(inquiry.replied_at),
    resolved_at: normalizeDateTimeLocal(inquiry.resolved_at),
  };
}

function toComparable(value: unknown) {
  return JSON.stringify(value);
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(api.hasAdminSession());
  const [busy, setBusy] = useState<BusyState>("idle");
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [dashboardLoadError, setDashboardLoadError] = useState("");
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginMessageTone, setLoginMessageTone] = useState<LoginMessageTone>("error");
  const [statusMessage, setStatusMessage] = useState("");
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [projectBase, setProjectBase] = useState<ProjectForm>(emptyProjectForm);

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [serviceBase, setServiceBase] = useState<ServiceForm>(emptyServiceForm);

  const [editingInsightId, setEditingInsightId] = useState<number | null>(null);
  const [insightForm, setInsightForm] = useState<InsightForm>(emptyInsightForm);
  const [insightBase, setInsightBase] = useState<InsightForm>(emptyInsightForm);

  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(emptyTestimonialForm);
  const [testimonialBase, setTestimonialBase] = useState<TestimonialForm>(emptyTestimonialForm);

  const [editingInquiryId, setEditingInquiryId] = useState<number | null>(null);
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>(emptyInquiryForm);
  const [inquiryBase, setInquiryBase] = useState<InquiryForm>(emptyInquiryForm);

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>(defaultEditableSiteSettings);
  const [settingsBase, setSettingsBase] = useState<Record<string, string>>(defaultEditableSiteSettings);
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>(emptyPasswordChangeForm);

  const pushToast = useCallback((message: string, tone: ToastItem["tone"] = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const refreshDashboard = useCallback(async () => {
    setDashboardLoadError("");
    const data = await api.getAdminDashboard();
    setDashboard(data);
    const mappedSettings = mapSettings(data.settings);
    setSettingsForm(mappedSettings);
    setSettingsBase(mappedSettings);
    return data;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setBusy("loading");
    refreshDashboard()
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Failed to load admin dashboard.";
        setDashboardLoadError(message);
        setStatusMessage(message);
        pushToast(message, "error");
      })
      .finally(() => setBusy("idle"));
  }, [isAuthenticated, pushToast, refreshDashboard]);

  const tabMeta = useMemo(() => {
    const summary = dashboard?.summary;
    return [
      { key: "dashboard" as const, label: "Dashboard", eyebrow: "Overview", count: summary?.projects_total ?? 0 },
      { key: "projects" as const, label: "Projects", eyebrow: "Portfolio", count: summary?.projects_total ?? 0 },
      { key: "services" as const, label: "Services", eyebrow: "Offerings", count: summary?.services_total ?? 0 },
      { key: "insights" as const, label: "Insights", eyebrow: "Editorial", count: summary?.insights_total ?? 0 },
      { key: "testimonials" as const, label: "Testimonials", eyebrow: "Social Proof", count: summary?.testimonials_total ?? 0 },
      { key: "settings" as const, label: "Settings", eyebrow: "Hero & Footer", count: (dashboard?.navigation_links.length ?? 0) + (dashboard?.contact_channels.length ?? 0) },
      { key: "inquiries" as const, label: "Inquiries", eyebrow: "Inbox", count: summary?.inquiries_total ?? 0 },
    ];
  }, [dashboard]);

  const projectDirty = toComparable(projectForm) !== toComparable(projectBase);
  const serviceDirty = toComparable(serviceForm) !== toComparable(serviceBase);
  const insightDirty = toComparable(insightForm) !== toComparable(insightBase);
  const testimonialDirty = toComparable(testimonialForm) !== toComparable(testimonialBase);
  const inquiryDirty = toComparable(inquiryForm) !== toComparable(inquiryBase);
  const settingsDirty = toComparable(settingsForm) !== toComparable(settingsBase);

  const pendingChanges = [projectDirty, serviceDirty, insightDirty, testimonialDirty, inquiryDirty, settingsDirty].filter(Boolean).length;

  const resetProjectEditor = useCallback(() => {
    setEditingProjectId(null);
    setProjectForm(emptyProjectForm);
    setProjectBase(emptyProjectForm);
  }, []);

  const resetServiceEditor = useCallback(() => {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setServiceBase(emptyServiceForm);
  }, []);

  const resetInsightEditor = useCallback(() => {
    setEditingInsightId(null);
    setInsightForm(emptyInsightForm);
    setInsightBase(emptyInsightForm);
  }, []);

  const resetTestimonialEditor = useCallback(() => {
    setEditingTestimonialId(null);
    setTestimonialForm(emptyTestimonialForm);
    setTestimonialBase(emptyTestimonialForm);
  }, []);

  const resetInquiryEditor = useCallback(() => {
    setEditingInquiryId(null);
    setInquiryForm(emptyInquiryForm);
    setInquiryBase(emptyInquiryForm);
  }, []);

  const resetPasswordForm = useCallback(() => {
    setPasswordForm(emptyPasswordChangeForm);
  }, []);

  const uploadImage = useCallback(
    async (
      event: ChangeEvent<HTMLInputElement>,
      onSuccess: (imageUrl: string, publicId: string) => void,
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setBusy("uploading");
        const dataUrl = await readFileAsDataUrl(file);
        const result = await api.uploadAdminImage({ fileName: file.name, dataUrl });
        onSuccess(result.imageUrl, result.publicId);
        pushToast("Image uploaded successfully.");
      } catch (error: unknown) {
        pushToast(error instanceof Error ? error.message : "Image upload failed.", "error");
      } finally {
        event.target.value = "";
        setBusy("idle");
      }
    },
    [pushToast],
  );

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setBusy("loading");
      setLoginMessage("");
      setLoginMessageTone("error");
      await api.login(loginForm);
      setIsAuthenticated(true);
      setLoginForm(initialLoginForm);
      pushToast("Admin session started.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed.";
      setLoginMessage(message);
      setLoginMessageTone("error");
      pushToast(message, "error");
    } finally {
      setBusy("idle");
    }
  };

  const handleRefresh = async () => {
    try {
      setBusy("loading");
      await refreshDashboard();
      setStatusMessage("Dashboard refreshed.");
      pushToast("Dashboard refreshed.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to refresh dashboard.";
      setStatusMessage(message);
      pushToast(message, "error");
    } finally {
      setBusy("idle");
    }
  };

  const handleLogout = async () => {
    setBusy("loading");

    try {
      await api.logout();
    } finally {
      setBusy("idle");
      setIsAuthenticated(false);
      setDashboard(null);
      setActiveTab("dashboard");
      setStatusMessage("");
      resetProjectEditor();
      resetServiceEditor();
      resetInsightEditor();
      resetTestimonialEditor();
      resetInquiryEditor();
      resetPasswordForm();
    }
  };

  const saveAndRefresh = async (work: () => Promise<unknown>, successMessage: string, onDone?: () => void) => {
    try {
      setBusy("saving");
      await work();
      await refreshDashboard();
      onDone?.();
      setStatusMessage(successMessage);
      pushToast(successMessage);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Action failed.";
      setStatusMessage(message);
      pushToast(message, "error");
    } finally {
      setBusy("idle");
    }
  };

  const deleteAndRefresh = async (work: () => Promise<unknown>, successMessage: string, onDone?: () => void) => {
    try {
      setBusy("deleting");
      await work();
      await refreshDashboard();
      onDone?.();
      setStatusMessage(successMessage);
      pushToast(successMessage);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Delete failed.";
      setStatusMessage(message);
      pushToast(message, "error");
    } finally {
      setBusy("idle");
    }
  };

  const handleProjectSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...projectForm };
    return saveAndRefresh(
      () => (editingProjectId ? api.updateProject(editingProjectId, payload) : api.createProject(payload)),
      editingProjectId ? "Project updated." : "Project created.",
      resetProjectEditor,
    );
  };

  const handleServiceSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...serviceForm };
    return saveAndRefresh(
      () => (editingServiceId ? api.updateService(editingServiceId, payload) : api.createService(payload)),
      editingServiceId ? "Service updated." : "Service created.",
      resetServiceEditor,
    );
  };

  const handleInsightSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...insightForm };
    return saveAndRefresh(
      () =>
        editingInsightId
          ? api.updateInsight(editingInsightId, payload)
          : api.createInsight(payload),
      editingInsightId ? "Insight updated." : "Insight created.",
      resetInsightEditor,
    );
  };

  const handleTestimonialSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...testimonialForm };
    return saveAndRefresh(
      () =>
        editingTestimonialId
          ? api.updateTestimonial(editingTestimonialId, payload)
          : api.createTestimonial(payload),
      editingTestimonialId ? "Testimonial updated." : "Testimonial created.",
      resetTestimonialEditor,
    );
  };

  const handleInquirySubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingInquiryId) return Promise.resolve();
    const payload = { ...inquiryForm };
    return saveAndRefresh(
      () => api.updateInquiry(editingInquiryId, payload),
      "Inquiry updated.",
      resetInquiryEditor,
    );
  };

  const handleSettingsSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = Object.entries(settingsForm).map(([setting_key, setting_value]) => ({ setting_key, setting_value }));
    return saveAndRefresh(() => api.updateSiteSettings(payload), "Site settings updated.");
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setBusy("saving");
      await api.changePassword(passwordForm);
      api.clearAdminSession();
      setLoginForm(initialLoginForm);
      setLoginMessage("Password updated. Please sign in again with your new password.");
      setLoginMessageTone("success");
      setIsAuthenticated(false);
      setDashboard(null);
      setActiveTab("dashboard");
      setStatusMessage("");
      resetProjectEditor();
      resetServiceEditor();
      resetInsightEditor();
      resetTestimonialEditor();
      resetInquiryEditor();
      resetPasswordForm();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Password update failed.";
      setStatusMessage(message);
      pushToast(message, "error");
    } finally {
      setBusy("idle");
    }
  };

  const handleFormatHeroStats = () => {
    try {
      const parsed = JSON.parse(settingsForm.hero_stats || "[]");
      const formatted = JSON.stringify(parsed, null, 2);
      setSettingsForm((current) => ({ ...current, hero_stats: formatted }));
      pushToast("Hero stats JSON formatted.");
    } catch {
      pushToast("Hero stats JSON is invalid.", "error");
    }
  };

  const handleResetDefaults = () => {
    setSettingsForm(defaultEditableSiteSettings);
    pushToast("Settings reset to defaults.");
  };

  const openProjectEditor = (project: Project) => {
    const next = mapProjectToForm(project);
    setEditingProjectId(project.id);
    setProjectForm(next);
    setProjectBase(next);
  };

  const openServiceEditor = (service: ServiceItem) => {
    const next = mapServiceToForm(service);
    setEditingServiceId(service.id);
    setServiceForm(next);
    setServiceBase(next);
  };

  const openInsightEditor = (insight: InsightItem) => {
    const next = mapInsightToForm(insight);
    setEditingInsightId(insight.id);
    setInsightForm(next);
    setInsightBase(next);
  };

  const openTestimonialEditor = (testimonial: TestimonialItem) => {
    const next = mapTestimonialToForm(testimonial);
    setEditingTestimonialId(testimonial.id);
    setTestimonialForm(next);
    setTestimonialBase(next);
  };

  const openInquiryEditor = (inquiry: InquiryItem) => {
    const next = mapInquiryToForm(inquiry);
    setEditingInquiryId(inquiry.id);
    setInquiryForm(next);
    setInquiryBase(next);
  };

  const handleDeleteProject = (id: number) => {
    if (!window.confirm("Delete this project?")) return;
    return deleteAndRefresh(() => api.deleteProject(id), "Project deleted.", resetProjectEditor);
  };

  const handleDeleteService = (id: number) => {
    if (!window.confirm("Delete this service?")) return;
    return deleteAndRefresh(() => api.deleteService(id), "Service deleted.", resetServiceEditor);
  };

  const handleDeleteInsight = (id: number) => {
    if (!window.confirm("Delete this insight?")) return;
    return deleteAndRefresh(() => api.deleteInsight(id), "Insight deleted.", resetInsightEditor);
  };

  const handleDeleteTestimonial = (id: number) => {
    if (!window.confirm("Delete this testimonial?")) return;
    return deleteAndRefresh(() => api.deleteTestimonial(id), "Testimonial deleted.", resetTestimonialEditor);
  };

  const handleDeleteInquiry = (id: number) => {
    if (!window.confirm("Delete this inquiry?")) return;
    return deleteAndRefresh(() => api.deleteInquiry(id), "Inquiry deleted.", resetInquiryEditor);
  };

  if (!isAuthenticated) {
    return (
      <AdminLoginShell
        busy={busy !== "idle"}
        loginForm={loginForm}
        loginMessage={loginMessage}
        loginMessageTone={loginMessageTone}
        onSubmit={handleLogin}
        onLoginFormChange={setLoginForm}
      />
    );
  }

  const data = dashboard;
  if (!data) {
    return (
      <AdminDashboardShell>
        {dashboardLoadError ? (
          <div className="rounded-[2rem] border border-red-200 bg-white/85 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-red-500">Admin Error</p>
            <h1 className="mt-4 text-3xl font-headline text-stone-950">Dashboard admin gagal dimuat.</h1>
            <p className="mt-4 text-sm leading-7 text-stone-600">{dashboardLoadError}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={handleRefresh} className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white">
                Coba Lagi
              </button>
              <button type="button" onClick={handleLogout} className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/40 bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-400">Loading</p>
            <h1 className="mt-4 text-3xl font-headline text-stone-950">Preparing MikroLiving control room...</h1>
          </div>
        )}
      </AdminDashboardShell>
    );
  }

  const activeTabMeta = tabMeta.find((item) => item.key === activeTab);

  return (
    <AdminDashboardShell>
      <AdminToastViewport toasts={toasts} />
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-white/50 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-md">
          <div className="rounded-[1.75rem] bg-stone-950 p-5 text-white">
            <BrandMark tone="light" size="md" compact />
            <h1 className="mt-5 text-3xl font-headline">Control Room</h1>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Kelola konten publik, inbound inquiries, dan struktur halaman depan dari satu dashboard premium.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-white/45">Inbox</p>
                <p className="mt-2 text-2xl font-headline">{data.summary.new_inquiries}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.25em] text-white/45">Pending</p>
                <p className="mt-2 text-2xl font-headline">{pendingChanges}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {tabMeta.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full rounded-[1.4rem] px-4 py-4 text-left transition ${activeTab === tab.key ? "bg-stone-950 text-white shadow-[0_18px_48px_rgba(15,23,42,0.22)]" : "bg-white text-stone-700 hover:bg-stone-100"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className={`text-[11px] uppercase tracking-[0.3em] ${activeTab === tab.key ? "text-white/45" : "text-stone-400"}`}>{tab.eyebrow}</p>
                    <p className="mt-2 text-base font-semibold">{tab.label}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeTab === tab.key ? "bg-white/10 text-white" : "bg-stone-100 text-stone-600"}`}>{tab.count}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-400">Workspace</p>
                <h2 className="mt-3 text-3xl font-headline text-stone-950">{activeTabMeta?.label ?? "Dashboard"}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                  {activeTab === "dashboard"
                    ? "Lihat ringkasan performa konten publik dan alur lead masuk, lalu lompat ke fitur yang perlu dirapikan hari ini."
                    : activeTab === "settings"
                      ? "Kelola hero, footer, navigation, dan contact channel agar seluruh struktur halaman depan tetap sinkron."
                      : activeTab === "inquiries"
                        ? "Buka inquiry untuk melihat detail lead, memperbarui status follow-up, dan menyimpan catatan internal tim."
                        : "Setiap item di fitur ini bisa dibuka, diedit, dihapus, dan disimpan langsung dari satu workspace."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={handleRefresh} className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700">
                  Refresh Data
                </button>
                <button type="button" onClick={handleLogout} className="rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white">
                  Logout
                </button>
              </div>
            </div>
            {statusMessage ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {statusMessage}
              </div>
            ) : null}
          </section>

          {activeTab === "dashboard" ? (
            <AdminOverviewSection
              summary={data.summary}
              services={data.services}
              insights={data.insights}
              navigationLinks={data.navigation_links}
              contactChannels={data.contact_channels}
            />
          ) : null}

          {activeTab === "projects" ? (
            <AdminProjectsSection
              editingProjectId={editingProjectId}
              projectDirty={projectDirty}
              projectForm={projectForm}
              categories={categories}
              projects={data.projects}
              busy={busy}
              onDiscardChanges={resetProjectEditor}
              onSubmit={handleProjectSubmit}
              onProjectFormChange={setProjectForm}
              onUploadImage={(event, onSuccess) => uploadImage(event, (imageUrl) => onSuccess(imageUrl))}
              onEditProject={openProjectEditor}
              onDeleteProject={handleDeleteProject}
            />
          ) : null}

          {activeTab === "services" ? (
            <AdminServicesSection
              editingServiceId={editingServiceId}
              serviceDirty={serviceDirty}
              serviceForm={serviceForm}
              serviceIcons={serviceIcons}
              services={data.services}
              busy={busy}
              onDiscardChanges={resetServiceEditor}
              onSubmit={handleServiceSubmit}
              onServiceFormChange={setServiceForm}
              onEditService={openServiceEditor}
              onDeleteService={handleDeleteService}
            />
          ) : null}

          {activeTab === "insights" ? (
            <AdminInsightsSection
              editingInsightId={editingInsightId}
              insightDirty={insightDirty}
              insightForm={insightForm}
              insights={data.insights}
              busy={busy}
              onDiscardChanges={resetInsightEditor}
              onSubmit={handleInsightSubmit}
              onInsightFormChange={setInsightForm}
              onUploadImage={(event, onSuccess) => uploadImage(event, onSuccess)}
              onEditInsight={openInsightEditor}
              onDeleteInsight={handleDeleteInsight}
            />
          ) : null}

          {activeTab === "testimonials" ? (
            <AdminTestimonialsSection
              editingTestimonialId={editingTestimonialId}
              testimonialDirty={testimonialDirty}
              testimonialForm={testimonialForm}
              testimonials={data.testimonials}
              busy={busy}
              onDiscardChanges={resetTestimonialEditor}
              onSubmit={handleTestimonialSubmit}
              onTestimonialFormChange={setTestimonialForm}
              onUploadImage={(event, onSuccess) => uploadImage(event, onSuccess)}
              onEditTestimonial={openTestimonialEditor}
              onDeleteTestimonial={handleDeleteTestimonial}
            />
          ) : null}

          {activeTab === "settings" ? (
            <AdminSettingsSection
              settingsDirty={settingsDirty}
              settings={settingsForm}
              passwordForm={passwordForm}
              navigationLinks={data.navigation_links}
              contactChannels={data.contact_channels}
              busy={busy !== "idle"}
              onDiscardChanges={() => setSettingsForm(settingsBase)}
              onSettingsChange={(key, value) => setSettingsForm((current) => ({ ...current, [key]: value }))}
              onPasswordFormChange={setPasswordForm}
              onPasswordSubmit={handlePasswordSubmit}
              onSubmit={handleSettingsSubmit}
              onFormatHeroStats={handleFormatHeroStats}
              onResetDefaults={handleResetDefaults}
              onRefresh={handleRefresh}
              onMessage={(value) => setStatusMessage(value)}
              onNavigationDirtyChange={() => undefined}
              onNavigationDraftRestoredChange={() => undefined}
              onNavigationDraftAutosavedAtChange={() => undefined}
            />
          ) : null}

          {activeTab === "inquiries" ? (
            <AdminInquiriesSection
              editingInquiryId={editingInquiryId}
              inquiryDirty={inquiryDirty}
              inquiryForm={inquiryForm}
              inquiries={data.inquiries}
              busy={busy}
              onDiscardChanges={resetInquiryEditor}
              onSubmit={handleInquirySubmit}
              onInquiryFormChange={setInquiryForm}
              onEditInquiry={openInquiryEditor}
              onDeleteInquiry={handleDeleteInquiry}
            />
          ) : null}
        </main>
      </div>
    </AdminDashboardShell>
  );
}

