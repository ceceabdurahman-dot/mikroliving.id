import { FormEvent } from "react";
import { InquiryItem } from "../services/api";
import { BusyState, InquiryForm, inquiryStatuses } from "./adminPanelTypes";

type Props = {
  editingInquiryId: number | null;
  inquiryDirty: boolean;
  inquiryForm: InquiryForm;
  inquiries: InquiryItem[];
  busy: BusyState;
  onDiscardChanges: () => void;
  onSubmit: (event: FormEvent) => void;
  onInquiryFormChange: (updater: (current: InquiryForm) => InquiryForm) => void;
  onEditInquiry: (inquiry: InquiryItem) => void;
  onDeleteInquiry: (id: number) => void;
};

function formatTimestamp(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminInquiriesSection({
  editingInquiryId,
  inquiryDirty,
  inquiryForm,
  inquiries,
  busy,
  onDiscardChanges,
  onSubmit,
  onInquiryFormChange,
  onEditInquiry,
  onDeleteInquiry,
}: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Lead Editor</p>
            <h2 className="mt-2 text-2xl font-headline text-stone-950">{editingInquiryId ? "Edit inquiry" : "Select an inquiry"}</h2>
          </div>
          {(editingInquiryId || inquiryDirty) ? (
            <button type="button" onClick={onDiscardChanges} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700">
              Discard
            </button>
          ) : null}
        </div>

        {editingInquiryId ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input value={inquiryForm.name} onChange={(event) => onInquiryFormChange((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Name" />
              <input value={inquiryForm.email} onChange={(event) => onInquiryFormChange((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Email" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input value={inquiryForm.phone} onChange={(event) => onInquiryFormChange((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Phone" />
              <input value={inquiryForm.source} onChange={(event) => onInquiryFormChange((current) => ({ ...current, source: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Source" />
            </div>
            <select value={inquiryForm.status} onChange={(event) => onInquiryFormChange((current) => ({ ...current, status: event.target.value as InquiryForm["status"] }))} className="w-full rounded-xl border border-stone-200 px-4 py-3">
              {inquiryStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <textarea value={inquiryForm.message} onChange={(event) => onInquiryFormChange((current) => ({ ...current, message: event.target.value }))} rows={5} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Message" />
            <textarea value={inquiryForm.admin_note} onChange={(event) => onInquiryFormChange((current) => ({ ...current, admin_note: event.target.value }))} rows={4} className="w-full rounded-xl border border-stone-200 px-4 py-3" placeholder="Internal note" />
            <div className="grid gap-4 md:grid-cols-2">
              <input type="datetime-local" value={inquiryForm.replied_at} onChange={(event) => onInquiryFormChange((current) => ({ ...current, replied_at: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" />
              <input type="datetime-local" value={inquiryForm.resolved_at} onChange={(event) => onInquiryFormChange((current) => ({ ...current, resolved_at: event.target.value }))} className="w-full rounded-xl border border-stone-200 px-4 py-3" />
            </div>
            <button type="submit" disabled={busy !== "idle"} className="rounded-xl bg-stone-950 px-5 py-3 font-semibold text-white disabled:opacity-60">
              {editingInquiryId ? "Save Inquiry" : "Update Inquiry"}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm leading-7 text-stone-500">
            Pilih inquiry dari panel kanan untuk melihat detail, mengubah status, menambahkan catatan internal, atau menghapus data yang sudah selesai ditangani.
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Inbox</p>
            <h2 className="mt-2 text-2xl font-headline text-stone-950">Inquiries masuk</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{inquiries.filter((item) => item.status === "new").length} new</span>
        </div>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-950">{inquiry.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{inquiry.source}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${inquiry.status === "new" ? "bg-amber-100 text-amber-700" : inquiry.status === "replied" ? "bg-emerald-100 text-emerald-700" : inquiry.status === "archived" ? "bg-stone-200 text-stone-600" : "bg-sky-100 text-sky-700"}`}>
                  {inquiry.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-stone-600">{inquiry.email}{inquiry.phone ? ` • ${inquiry.phone}` : ""}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-700">{inquiry.message}</p>
              <p className="mt-3 text-xs text-stone-400">Masuk {formatTimestamp(inquiry.created_at)}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => onEditInquiry(inquiry)} className="rounded-xl bg-stone-950 px-4 py-2 text-sm text-white">Open</button>
                <button type="button" onClick={() => onDeleteInquiry(inquiry.id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
