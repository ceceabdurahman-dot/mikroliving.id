import { ChangeEvent, FormEvent } from "react";
import { InsightItem } from "../services/api";
import { type BusyState, type InsightForm } from "./adminPanelTypes";

type AdminInsightsSectionProps = {
  editingInsightId: number | null;
  insightDirty: boolean;
  insightForm: InsightForm;
  insights: InsightItem[];
  busy: BusyState;
  onDiscardChanges: () => void;
  onSubmit: (event: FormEvent) => void;
  onInsightFormChange: (updater: (current: InsightForm) => InsightForm) => void;
  onUploadImage: (event: ChangeEvent<HTMLInputElement>, onSuccess: (imageUrl: string, publicId: string) => void) => void;
  onEditInsight: (insight: InsightItem) => void;
  onDeleteInsight: (id: number) => void;
};

export default function AdminInsightsSection({
  editingInsightId,
  insightDirty,
  insightForm,
  insights,
  busy,
  onDiscardChanges,
  onSubmit,
  onInsightFormChange,
  onUploadImage,
  onEditInsight,
  onDeleteInsight,
}: AdminInsightsSectionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-headline">{editingInsightId ? "Edit Insight" : "Create Insight"}</h2>
          <div className="flex gap-3">
            {insightDirty ? <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Discard Changes</button> : null}
            {editingInsightId ? <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm">Cancel</button> : null}
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input value={insightForm.tag} onChange={(event) => onInsightFormChange((current) => ({ ...current, tag: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Tag" />
          <input value={insightForm.title} onChange={(event) => onInsightFormChange((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Title" />
          <textarea value={insightForm.excerpt} onChange={(event) => onInsightFormChange((current) => ({ ...current, excerpt: event.target.value }))} rows={3} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Excerpt" />
          <textarea value={insightForm.content} onChange={(event) => onInsightFormChange((current) => ({ ...current, content: event.target.value }))} rows={5} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Long content" />
          <input value={insightForm.author_name} onChange={(event) => onInsightFormChange((current) => ({ ...current, author_name: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Author name" />
          <input value={insightForm.image_url} onChange={(event) => onInsightFormChange((current) => ({ ...current, image_url: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Image URL" />
          <input type="file" accept="image/*" onChange={(event) => onUploadImage(event, (imageUrl, publicId) => onInsightFormChange((current) => ({ ...current, image_url: imageUrl, image_public_id: publicId })))} className="w-full rounded-xl border border-dashed border-stone-300 px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-2">
            <input type="number" value={insightForm.sort_order} onChange={(event) => onInsightFormChange((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Sort order" />
            <input type="datetime-local" value={insightForm.published_at} onChange={(event) => onInsightFormChange((current) => ({ ...current, published_at: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" />
          </div>
          <label className="inline-flex items-center gap-3"><input type="checkbox" checked={insightForm.is_published} onChange={(event) => onInsightFormChange((current) => ({ ...current, is_published: event.target.checked }))} /> Published</label>
          <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">{editingInsightId ? "Update Insight" : "Create Insight"}</button>
        </form>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-2xl font-headline">Insight List</h2>
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-2xl border border-stone-200 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">{insight.tag}</p>
            <h3 className="mt-2 text-lg font-headline">{insight.title}</h3>
            <p className="mt-2 text-sm text-stone-600">{insight.excerpt}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => onEditInsight(insight)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Edit</button>
              <button type="button" onClick={() => onDeleteInsight(insight.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
