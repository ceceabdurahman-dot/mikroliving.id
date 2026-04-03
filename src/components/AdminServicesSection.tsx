import { FormEvent } from "react";
import { ServiceItem } from "../services/api";
import { type BusyState, type ServiceForm } from "./adminPanelTypes";

type AdminServicesSectionProps = {
  editingServiceId: number | null;
  serviceDirty: boolean;
  serviceForm: ServiceForm;
  serviceIcons: string[];
  services: ServiceItem[];
  busy: BusyState;
  onDiscardChanges: () => void;
  onSubmit: (event: FormEvent) => void;
  onServiceFormChange: (updater: (current: ServiceForm) => ServiceForm) => void;
  onEditService: (service: ServiceItem) => void;
  onDeleteService: (id: number) => void;
};

export default function AdminServicesSection({
  editingServiceId,
  serviceDirty,
  serviceForm,
  serviceIcons,
  services,
  busy,
  onDiscardChanges,
  onSubmit,
  onServiceFormChange,
  onEditService,
  onDeleteService,
}: AdminServicesSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-headline">{editingServiceId ? "Edit Service" : "Create Service"}</h2>
          <div className="flex gap-3">
            {serviceDirty ? <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Discard Changes</button> : null}
            {editingServiceId ? <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Cancel</button> : null}
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <select value={serviceForm.icon_key} onChange={(event) => onServiceFormChange((current) => ({ ...current, icon_key: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3">{serviceIcons.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select>
          <input value={serviceForm.title} onChange={(event) => onServiceFormChange((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Service title" />
          <textarea value={serviceForm.description} onChange={(event) => onServiceFormChange((current) => ({ ...current, description: event.target.value }))} rows={4} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Description" />
          <input type="number" value={serviceForm.sort_order} onChange={(event) => onServiceFormChange((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Sort order" />
          <label className="inline-flex items-center gap-3"><input type="checkbox" checked={serviceForm.is_active} onChange={(event) => onServiceFormChange((current) => ({ ...current, is_active: event.target.checked }))} /> Active</label>
          <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{editingServiceId ? "Update Service" : "Create Service"}</button>
        </form>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-headline">Service List</h2>
        {services.map((service) => (
          <article key={service.id} className="rounded-2xl border border-stone-200 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{service.icon_key}</p>
            <h3 className="mt-2 text-lg font-headline">{service.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{service.description}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => onEditService(service)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => onDeleteService(service.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
