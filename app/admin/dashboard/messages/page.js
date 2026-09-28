"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  X,
  Loader2,
  User,
  Building,
  ShieldQuestion,
  DollarSign,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MessagesInboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [filter, setFilter] = useState("all"); // all | open | done
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      toast.error("Please log in again");
      window.location.href = "/admin";
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        toast.error("Session expired — please log in again");
        window.location.href = "/admin";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch messages");
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Messages fetch error:", error);
      toast.error(error.message || "Failed to fetch messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const patchMessage = async (msg, patch, successText) => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/contact/${msg._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to update ticket");
      }

      const updated = data.messageDoc
        ? {
            ...msg,
            ...patch,
            isRead:
              data.messageDoc.isRead ??
              patch.isRead ??
              msg.isRead,
            isDone:
              data.messageDoc.isDone ??
              patch.isDone ??
              msg.isDone,
          }
        : { ...msg, ...patch };

      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? updated : m))
      );
      if (selectedMsg && selectedMsg._id === msg._id) {
        setSelectedMsg(updated);
      }
      if (successText) toast.success(successText);
      return updated;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not update ticket");
      return null;
    }
  };

  const handleToggleDone = async (msg, e) => {
    e?.stopPropagation?.();
    const next = !msg.isDone;
    await patchMessage(
      msg,
      { isDone: next, isRead: next ? true : msg.isRead },
      next ? "Ticket marked as done" : "Ticket reopened"
    );
  };

  const askDelete = (msg, e) => {
    e?.stopPropagation?.();
    setDeleteTarget(msg);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/contact/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete ticket");
      }

      toast.success("Ticket permanently deleted");
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      if (selectedMsg?._id === deleteTarget._id) setSelectedMsg(null);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete record");
    } finally {
      setDeleting(false);
    }
  };

  const openMessageDetails = async (msg) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      await patchMessage(msg, { isRead: true });
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === "done") return Boolean(m.isDone);
    if (filter === "open") return !m.isDone;
    return true;
  });

  const openCount = messages.filter((m) => !m.isDone).length;
  const doneCount = messages.filter((m) => m.isDone).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-white">
            Contact Inquiry <span className="text-[#D9D9D9]">Tickets</span>
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Each inquiry is a ticket — view, mark done, or delete.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: `All (${messages.length})` },
            { key: "open", label: `Open (${openCount})` },
            { key: "done", label: `Done (${doneCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`h-9 px-3 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
                filter === tab.key
                  ? "bg-[#D9D9D9] text-[#050505]"
                  : "border border-white/10 text-[#A0A0A0] hover:border-white/25 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D9D9D9]" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((msg) => {
            const done = Boolean(msg.isDone);
            return (
              <article
                key={msg._id}
                onClick={() => openMessageDetails(msg)}
                className={`group relative cursor-pointer rounded-2xl border bg-[#0D0D0D] p-5 transition-colors ${
                  done
                    ? "border-[#D9D9D9]/35 bg-[#0D0D0D]/80"
                    : "border-white/10 hover:border-[#D9D9D9]/40"
                }`}
              >
                {/* Done tick — top right */}
                {done ? (
                  <div
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#D9D9D9] text-[#050505]"
                    title="Marked as done"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                ) : null}

                <div className={`mb-4 flex items-start gap-3 ${done ? "pr-12" : ""}`}>
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold uppercase ${
                      done
                        ? "border-[#D9D9D9]/30 text-[#D9D9D9]"
                        : "border-white/15 text-[#A0A0A0]"
                    }`}
                  >
                    {msg.name?.substring(0, 2) || "IN"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {msg.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#A0A0A0]">
                      {msg.business}
                    </p>
                  </div>
                </div>

                <div className="mb-4 space-y-2 border-y border-white/8 py-3 text-[11px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="uppercase tracking-[0.14em] text-[#666]">
                      Project
                    </span>
                    <span className="truncate text-right text-[#D9D9D9]">
                      {msg.projectType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="uppercase tracking-[0.14em] text-[#666]">
                      Budget
                    </span>
                    <span className="truncate text-right text-[#C8C8C8]">
                      {msg.budgetRange}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 uppercase tracking-[0.14em] text-[#666]">
                      <Calendar className="h-3 w-3" />
                      Date
                    </span>
                    <span className="text-[#A0A0A0]">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <p className="mb-5 line-clamp-2 text-xs leading-relaxed text-[#A0A0A0]">
                  {msg.message}
                </p>

                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!done ? (
                    <button
                      type="button"
                      onClick={(e) => handleToggleDone(msg, e)}
                      className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D9D9D9] text-[10px] font-bold uppercase tracking-[0.14em] text-[#050505] transition-colors hover:bg-[#F5F5F5]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark as Done
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openMessageDetails(msg)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#A0A0A0] hover:border-white/25 hover:text-white ${
                      done ? "ml-auto" : ""
                    }`}
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => askDelete(msg, e)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#A0A0A0] hover:border-red-500/40 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-white/10 bg-[#0d0d0d] py-12 text-center text-xs text-gray-500">
          {filter === "done"
            ? "No completed tickets yet."
            : filter === "open"
              ? "No open tickets — inbox is clear."
              : "Your inbox is empty. No inquiries yet."}
        </div>
      )}

      {selectedMsg ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-[550px] overflow-y-auto border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl no-scrollbar">
            <div className="mb-5 flex items-start justify-between border-b border-white/5 pb-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">
                    Ticket Details
                  </h3>
                  {selectedMsg.isDone ? (
                    <span className="inline-flex items-center gap-1 border border-[#D9D9D9]/40 bg-[#D9D9D9]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#D9D9D9]">
                      <CheckCircle2 className="h-3 w-3" />
                      Done
                    </span>
                  ) : (
                    <span className="border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-300">
                      Open
                    </span>
                  )}
                </div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-[#666]">
                  ID: {selectedMsg._id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div className="flex items-center gap-2.5 border border-white/5 bg-black p-3">
                <User className="h-4 w-4 text-[#D9D9D9]" />
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold uppercase text-gray-500">
                    Contact Name
                  </span>
                  <span className="block truncate font-bold text-white">
                    {selectedMsg.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border border-white/5 bg-black p-3">
                <Building className="h-4 w-4 text-[#D9D9D9]" />
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold uppercase text-gray-500">
                    Gym / Business
                  </span>
                  <span className="block truncate font-bold text-white">
                    {selectedMsg.business}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border border-white/5 bg-black p-3">
                <ShieldQuestion className="h-4 w-4 text-[#D9D9D9]" />
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold uppercase text-gray-500">
                    Inquiry Type
                  </span>
                  <span className="block truncate font-bold text-white">
                    {selectedMsg.projectType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border border-white/5 bg-black p-3">
                <DollarSign className="h-4 w-4 text-[#D9D9D9]" />
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold uppercase text-gray-500">
                    Budget
                  </span>
                  <span className="block truncate font-bold text-white">
                    {selectedMsg.budgetRange}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5 border border-white/5 bg-black/45 p-4 text-xs">
              <span className="mb-2 block text-[9px] font-bold uppercase tracking-wider text-gray-500">
                Message
              </span>
              <p className="leading-relaxed whitespace-pre-line text-gray-300">
                {selectedMsg.message}
              </p>
            </div>

            <div className="mb-6 space-y-2 border border-white/10 p-4 text-xs">
              <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-[#D9D9D9]">
                Reply to Sender
              </span>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Mail className="h-3.5 w-3.5" /> Email
                </span>
                <a
                  href={`mailto:${selectedMsg.email}`}
                  className="font-bold text-white hover:underline"
                >
                  {selectedMsg.email}
                </a>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </span>
                <a
                  href={`tel:${selectedMsg.phone}`}
                  className="font-bold text-white hover:underline"
                >
                  {selectedMsg.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-3 border-t border-white/5 pt-4">
              {!selectedMsg.isDone ? (
                <button
                  type="button"
                  onClick={() => handleToggleDone(selectedMsg)}
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#D9D9D9] text-xs font-bold uppercase tracking-wider text-[#050505] transition-all hover:bg-[#F5F5F5]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Done
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => askDelete(selectedMsg)}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 text-xs font-extrabold uppercase tracking-widest text-white hover:bg-red-500"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete confirmation popup */}
      {deleteTarget ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0D0D0D] p-6 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase tracking-[-0.02em] text-white">
              Delete this ticket?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
              Are you sure you want to permanently delete the inquiry from{" "}
              <span className="font-semibold text-white">
                {deleteTarget.name}
              </span>
              {deleteTarget.business ? (
                <> ({deleteTarget.business})</>
              ) : null}
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex h-11 flex-1 items-center justify-center rounded-lg border border-white/15 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
