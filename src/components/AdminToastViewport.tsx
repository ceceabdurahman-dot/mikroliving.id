type ToastItem = {
  id: number;
  message: string;
  tone: "success" | "error";
};

export default function AdminToastViewport({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
              : "border-red-200 bg-red-50/95 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
