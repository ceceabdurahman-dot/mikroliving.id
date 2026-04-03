import { ChangeEvent, FormEvent } from "react";
import { Project } from "../services/api";
import { type BusyState, type ProjectForm } from "./adminPanelTypes";

type AdminProjectsSectionProps = {
  editingProjectId: number | null;
  projectDirty: boolean;
  projectForm: ProjectForm;
  categories: string[];
  projects: Project[];
  busy: BusyState;
  onDiscardChanges: () => void;
  onSubmit: (event: FormEvent) => void;
  onProjectFormChange: (updater: (current: ProjectForm) => ProjectForm) => void;
  onUploadImage: (event: ChangeEvent<HTMLInputElement>, onSuccess: (imageUrl: string) => void) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
};

export default function AdminProjectsSection({
  editingProjectId,
  projectDirty,
  projectForm,
  categories,
  projects,
  busy,
  onDiscardChanges,
  onSubmit,
  onProjectFormChange,
  onUploadImage,
  onEditProject,
  onDeleteProject,
}: AdminProjectsSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-headline">{editingProjectId ? "Edit Project" : "Create Project"}</h2>
          <div className="flex gap-3">
            {projectDirty ? (
              <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">
                Discard Changes
              </button>
            ) : null}
            {editingProjectId ? (
              <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">
                Cancel
              </button>
            ) : null}
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input value={projectForm.title} onChange={(event) => onProjectFormChange((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Project title" />
          <select value={projectForm.category} onChange={(event) => onProjectFormChange((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3">{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
          <input value={projectForm.location} onChange={(event) => onProjectFormChange((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Location" />
          <input value={projectForm.size} onChange={(event) => onProjectFormChange((current) => ({ ...current, size: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Size" />
          <input value={projectForm.image_url} onChange={(event) => onProjectFormChange((current) => ({ ...current, image_url: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Image URL" />
          <input type="file" accept="image/*" onChange={(event) => onUploadImage(event, (imageUrl) => onProjectFormChange((current) => ({ ...current, image_url: imageUrl })))} className="w-full rounded-xl border border-dashed border-stone-300 px-4 py-3" />
          <textarea value={projectForm.description} onChange={(event) => onProjectFormChange((current) => ({ ...current, description: event.target.value }))} rows={5} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Description" />
          <label className="inline-flex items-center gap-3"><input type="checkbox" checked={projectForm.is_featured} onChange={(event) => onProjectFormChange((current) => ({ ...current, is_featured: event.target.checked }))} /> Featured</label>
          <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{editingProjectId ? "Update Project" : "Create Project"}</button>
        </form>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-headline">Published Projects</h2>
        {projects.map((project) => (
          <article key={project.id} className="rounded-2xl border border-stone-200 p-4">
            <h3 className="text-lg font-headline">{project.title}</h3>
            <p className="mt-2 text-sm text-stone-500">{project.category} | {project.location} | {project.size}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => onEditProject(project)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => onDeleteProject(project.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
