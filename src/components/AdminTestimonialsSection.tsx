import { ChangeEvent, FormEvent } from "react";
import { TestimonialItem } from "../services/api";
import { type BusyState, type TestimonialForm } from "./adminPanelTypes";

type AdminTestimonialsSectionProps = {
  editingTestimonialId: number | null;
  testimonialDirty: boolean;
  testimonialForm: TestimonialForm;
  testimonials: TestimonialItem[];
  busy: BusyState;
  onDiscardChanges: () => void;
  onSubmit: (event: FormEvent) => void;
  onTestimonialFormChange: (updater: (current: TestimonialForm) => TestimonialForm) => void;
  onUploadImage: (event: ChangeEvent<HTMLInputElement>, onSuccess: (imageUrl: string, publicId: string) => void) => void;
  onEditTestimonial: (testimonial: TestimonialItem) => void;
  onDeleteTestimonial: (id: number) => void;
};

export default function AdminTestimonialsSection({
  editingTestimonialId,
  testimonialDirty,
  testimonialForm,
  testimonials,
  busy,
  onDiscardChanges,
  onSubmit,
  onTestimonialFormChange,
  onUploadImage,
  onEditTestimonial,
  onDeleteTestimonial,
}: AdminTestimonialsSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-headline">{editingTestimonialId ? "Edit Testimonial" : "Create Testimonial"}</h2>
          <div className="flex gap-3">
            {testimonialDirty ? <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Discard Changes</button> : null}
            {editingTestimonialId ? <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Cancel</button> : null}
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input value={testimonialForm.client_name} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, client_name: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Client name" />
          <input value={testimonialForm.client_label} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, client_label: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Client label" />
          <textarea value={testimonialForm.quote} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, quote: event.target.value }))} rows={5} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Quote" />
          <input value={testimonialForm.image_url} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, image_url: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Image URL" />
          <input type="file" accept="image/*" onChange={(event) => onUploadImage(event, (imageUrl, publicId) => onTestimonialFormChange((current) => ({ ...current, image_url: imageUrl, image_public_id: publicId })))} className="w-full rounded-xl border border-dashed border-stone-300 px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" min={1} max={5} value={testimonialForm.rating} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, rating: Number(event.target.value) || 5 }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Rating" />
            <input type="number" value={testimonialForm.sort_order} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Sort order" />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-3"><input type="checkbox" checked={testimonialForm.is_featured} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, is_featured: event.target.checked }))} /> Featured</label>
            <label className="inline-flex items-center gap-3"><input type="checkbox" checked={testimonialForm.is_active} onChange={(event) => onTestimonialFormChange((current) => ({ ...current, is_active: event.target.checked }))} /> Active</label>
          </div>
          <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{editingTestimonialId ? "Update Testimonial" : "Create Testimonial"}</button>
        </form>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-headline">Testimonial List</h2>
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="rounded-2xl border border-stone-200 p-4">
            <h3 className="text-lg font-headline">{testimonial.client_name}</h3>
            <p className="mt-2 text-sm text-stone-500">{testimonial.client_label}</p>
            <p className="mt-2 text-sm text-stone-600">{testimonial.quote}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => onEditTestimonial(testimonial)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => onDeleteTestimonial(testimonial.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
