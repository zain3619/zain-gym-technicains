"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Upload, Sparkles, Eye, EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

export default function BannersManagementPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("homepage");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/banners");
      const data = await response.json();
      if (response.ok) {
        setBanners(data);
      }
    } catch (error) {
      console.error("Fetch banners error:", error);
      toast.error("Failed to load banners. Loaded developer defaults.");
      setBanners([
        {
          _id: "b1",
          title: "Eid Promo Offer - Free Rigging Assembly",
          imageUrl: "https://picsum.photos/1200/500?random=51",
          type: "homepage",
          order: 0,
          isActive: true,
        },
        {
          _id: "b2",
          title: "New Cable Machines Arriving Soon",
          imageUrl: "https://picsum.photos/1200/500?random=52",
          type: "promotional",
          order: 1,
          isActive: false,
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
    setTitle("");
    setType("homepage");
    setOrder(0);
    setIsActive(true);
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditId(b._id);
    setTitle(b.title || "");
    setType(b.type || "homepage");
    setOrder(b.order || 0);
    setIsActive(b.isActive !== undefined ? b.isActive : true);
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl(b.imageUrl || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this banner layout slide?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("title", title);
    payload.append("type", type);
    payload.append("order", order);
    payload.append("isActive", isActive);

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    const url = editId 
      ? `/api/banners/${editId}` 
      : "/api/banners";
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
        toast.success(editId ? "Banner updated" : "Banner created!");
        setModalOpen(false);
        fetchBanners();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit banner");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black uppercase text-white tracking-wider">
            Promotional <span className="text-[#82cd2b]">Banners & Sliders</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure layout carousel banners, promotional discount cards, and sliders order.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#82cd2b] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#97ff02] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          ADD BANNER
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
        </div>
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-4 flex flex-col justify-between group hover:border-[#82cd2b]/30 transition-all duration-300 relative shadow-xl">
              <div>
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-black border border-white/5 group-hover:scale-[1.01] transition-transform duration-300">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 flex h-5 items-center rounded bg-black/85 px-2 text-[8px] font-black uppercase tracking-wider text-[#82cd2b] border border-[#82cd2b]/25">
                    {banner.type}
                  </span>
                  
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(banner)}
                      className="h-8 w-8 rounded-lg bg-black/85 hover:bg-black border border-white/10 text-gray-300 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(banner._id)}
                      className="h-8 w-8 rounded-lg bg-black/85 hover:bg-red-500 border border-white/10 hover:border-red-500 text-gray-300 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 px-1 flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">{banner.title}</h4>
                    <span className="text-[10px] text-gray-500 font-bold block mt-0.5">Order priority index: {banner.order}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    banner.isActive 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  }`}>
                    {banner.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No banners defined yet. Start by uploading a slider banner!
        </div>
      )}

      {/* CRUD POPUP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5 shrink-0">
              <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#82cd2b]" />
                {editId ? "Modify Banner Properties" : "Register Banner Promo"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Banner Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Eid Promo Offer - Free Assembly"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Display Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value="homepage">Homepage Main Carousel</option>
                    <option value="promotional">Promo Inline Block</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Sort Priority Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Banner Picture File *</label>
                {previewUrl || existingImageUrl ? (
                  <div className="relative aspect-[21/9] w-full rounded-lg bg-black border border-white/10 overflow-hidden mb-3.5 flex items-center justify-center">
                    <img 
                      src={previewUrl || existingImageUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <label className="flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#82cd2b]/40 rounded-lg h-11 bg-black/35 hover:bg-black/60 transition-all cursor-pointer">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Choose Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editId}
                  />
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Status Visibility</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`h-11 w-full rounded-lg border transition-all flex items-center justify-center gap-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer ${
                    isActive 
                      ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400" 
                      : "bg-gray-500/10 border-white/15 text-gray-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Eye className="h-4.5 w-4.5" />
                      ACTIVE (VISIBLE SITE)
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4.5 w-4.5" />
                      DISABLED (HIDDEN)
                    </>
                  )}
                </button>
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
                  className="flex-1 h-11 rounded-lg bg-[#82cd2b] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#97ff02] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      SAVE BANNER
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
