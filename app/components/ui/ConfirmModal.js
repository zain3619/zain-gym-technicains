"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";

/**
 * Reusable delete / confirm dialog — replaces browser window.confirm.
 */
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  tone = "danger", // danger | default
}) {
  if (!open) return null;

  const isDanger = tone === "danger";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0D0D0D] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full border ${
            isDanger
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-white/15 bg-white/5 text-[#D9D9D9]"
          }`}
        >
          {isDanger ? (
            <Trash2 className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
        </div>

        <h3
          id="confirm-modal-title"
          className="font-display text-lg font-bold uppercase tracking-[-0.02em] text-white"
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">{message}</p>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="flex h-11 flex-1 items-center justify-center rounded-lg border border-white/15 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-xs font-extrabold uppercase tracking-[0.16em] transition disabled:opacity-50 ${
              isDanger
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-[#D9D9D9] text-[#050505] hover:bg-[#F5F5F5]"
            }`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
