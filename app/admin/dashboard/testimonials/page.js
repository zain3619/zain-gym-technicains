"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Upload, Star, MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      if (response.ok) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Fetch testimonials error:", error);
      toast.error("Failed to load testimonials. Rendering fallbacks.");
      setTestimonials([
        {
          _id: "test1",
          name: "Mohammad Usman",
          role: "Owner, Oxygen Fitness Lahore",
          text: "Zain Gym Technicians delivered phenomenal assembly support. They rigged and placed all 18 treadmills and strength stacks in 48 hours without single scratch.",
          rating: 5,
          imageUrl: "https://picsum.photos/200/200?random=41",
        },
        {
          _id: "test2",
          name: "Amna Bilal",
          role: "Co-founder, Core Studio DHA",
          text: "Superb CAD layouts. They optimized our garage floor so we could fit a smith machine, cardio climber, and free weights.",
          rating: 5,
          imageUrl: "https://picsum.photos/200/200?random=42",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setName("");
    setRole("");
    setText("");
    setRating(5);
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditId(t._id);
    setName(t.name || "");
    setRole(t.role || "");
    setText(t.text || "");
    setRating(t.rating || 5);
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl(t.imageUrl || "");
    setModalOpen(true);
  };

  const askDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleting(true);
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Testimonial removed successfully");
        setDeleteTarget(null);
        fetchTestimonials();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error(error.message || "Deletion failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !text) {
      toast.error("Please fill in required inputs: name, role, text");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("name", name);
    payload.append("role", role);
    payload.append("text", text);
    payload.append("rating", rating);

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    const url = editId 
      ? `/api/testimonials/${editId}` 
      : "/api/testimonials";
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: payload,
      });

      if (response.ok) {
        toast.success(editId ? "Testimonial updated" : "Testimonial added!");
        setModalOpen(false);
        fetchTestimonials();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit testimonial");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black uppercase text-white tracking-wider">
            Client <span className="text-[#D9D9D9]">Testimonials CMS</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage ratings, client testimonials, names, and profiles on the frontend website.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#D9D9D9] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#F5F5F5] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          ADD TESTIMONIAL
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D9D9D9]" />
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-5 flex flex-col justify-between group hover:border-[#D9D9D9]/30 transition-all duration-300 relative shadow-xl">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full overflow-hidden bg-black border border-white/10 shrink-0">
                      {t.imageUrl ? (
                        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-gray-400 font-bold uppercase text-xs">
                          {t.name?.substring(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.name}</h4>
                      <span className="text-[9px] text-[#D9D9D9] font-bold block mt-0.5">{t.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 shrink-0" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              </div>

              <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => askDelete(t._id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No feedback entries registered yet. Start by creating a glowing review!
        </div>
      )}

      {/* CRUD POPUP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5 shrink-0">
              <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-[#D9D9D9]" />
                {editId ? "Modify Client Testimonial" : "Register Testimonial"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Reviewer Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohammad Usman"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Designation / Role *</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Owner, Oxygen Gym"
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Star Rating (1 - 5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Fair)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Testimonial Description *</label>
                <textarea
                  rows="3"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the feedback comments here..."
                  className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Reviewer Avatar File</label>
                {previewUrl || existingImageUrl ? (
                  <div className="relative h-20 w-20 rounded-full bg-black border border-white/10 overflow-hidden mb-3.5 flex items-center justify-center">
                    <img 
                      src={previewUrl || existingImageUrl} 
                      alt="Reviewer Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <label className="flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#D9D9D9]/40 rounded-lg h-11 bg-black/35 hover:bg-black/60 transition-all cursor-pointer">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Choose Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-11 rounded-lg border border-white/15 bg-transparent text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 rounded-lg bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5F5F5] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      SAVE REVIEWS
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this testimonial?"
        message="This review will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}
