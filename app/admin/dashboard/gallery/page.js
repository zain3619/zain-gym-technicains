"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, Trash2, Edit2, Loader2, Save, X, 
  Image as ImageIcon, CheckCircle, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/ui/ConfirmModal";

const CATEGORIES = ["All", "Cardio Machines", "Strength Equipment", "Free Weights", "Functional Training"];

export default function GalleryManagementPage() {
  const [images, setImages] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Multi Upload States
  const [uploadCategory, setUploadCategory] = useState("Strength Equipment");
  const [uploadProgress, setUploadProgress] = useState(null); // null, 'uploading', 'success', 'error'
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Rename States
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "All" 
        ? "/api/gallery" 
        : `/api/gallery?category=${encodeURIComponent(selectedCategory)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setImages(data);
      }
    } catch (error) {
      console.error("Gallery fetch error:", error);
      toast.error("Failed to load gallery images. Display fallback mocks.");
      setImages([
        { _id: "g1", title: "Commercial Power Cage", imageUrl: "https://picsum.photos/600/500?random=11", category: "Strength Equipment" },
        { _id: "g2", title: "Dual Pulley Functional Trainer", imageUrl: "https://picsum.photos/600/500?random=12", category: "Functional Training" },
        { _id: "g3", title: "Self-Powered Curve Treadmill", imageUrl: "https://picsum.photos/600/500?random=13", category: "Cardio Machines" },
        { _id: "g4", title: "Rubber Hex Dumbbell Deck", imageUrl: "https://picsum.photos/600/500?random=14", category: "Free Weights" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
    if (files.length > 0) {
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const removeUploadFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearUploadQueue = () => {
    setUploadFiles([]);
    setUploadProgress(null);
  };

  const handleBulkUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    setUploadProgress("uploading");
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("category", uploadCategory);
    
    uploadFiles.forEach(file => {
      payload.append("images", file);
    });

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Images uploaded successfully!");
        setUploadProgress("success");
        setUploadFiles([]);
        fetchGallery();
      } else {
        throw new Error(data.message || "Failed to upload");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Upload failed");
      setUploadProgress("error");
    }
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
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Image removed from gallery");
        setDeleteTarget(null);
        fetchGallery();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const startRename = (img) => {
    setEditId(img._id);
    setEditTitle(img.title || "");
    setEditCategory(img.category || "Strength Equipment");
  };

  const handleRenameSave = async () => {
    if (!editTitle) return;
    
    setRenaming(true);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(`/api/gallery/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, category: editCategory }),
      });

      if (response.ok) {
        toast.success("Image updated successfully");
        setEditId(null);
        fetchGallery();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Rename failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRenaming(false);
    }
  };

  return (
    <>
    <div className="space-y-8">
      
      {/* 1. Header Info */}
      <div>
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          Gallery Stream & <span className="text-[#D9D9D9]">Media CMS</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Directly sync gym machine layout pictures via bulk Cloudinary upload pipelines.</p>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all bg-[#0d0d0d] shadow-xl ${
            isDragOver 
              ? "border-[#D9D9D9] bg-[#D9D9D9]/5" 
              : "border-white/10 hover:border-white/20 bg-black/45"
          }`}
        >
          <Upload className={`h-10 w-10 mb-3 transition-colors ${isDragOver ? "text-[#D9D9D9]" : "text-gray-400"}`} />
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Drag & Drop Images Here</h3>
          <p className="text-[10px] text-gray-500 mt-1 mb-4">Supported: JPEG, PNG, WEBP (Maximum 5MB per file)</p>
          
          <label className="flex h-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 px-4 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept="image/*" 
              onChange={handleFileSelect} 
            />
          </label>
        </div>

        {/* Upload Control Center Panel */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Upload Settings</h3>
              {uploadFiles.length > 0 && (
                <button onClick={clearUploadQueue} className="text-[9px] text-red-400 font-bold uppercase tracking-wider hover:underline">
                  Clear Queue
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Category Assignment</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
              >
                {CATEGORIES.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* In-Queue uploads logs */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar mb-4">
              {uploadFiles.length > 0 ? (
                uploadFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-black/45 border border-white/5 rounded-lg p-2 text-xs">
                    <span className="truncate text-gray-400 pr-4">{file.name}</span>
                    <button onClick={() => removeUploadFile(idx)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[10px] text-gray-600 border border-dashed border-white/5 rounded-lg italic">
                  Queue is empty. Select files above to upload.
                </div>
              )}
            </div>
          </div>

          {/* Submission Indicators */}
          <div className="space-y-4">
            {uploadProgress === "uploading" && (
              <div className="flex items-center gap-2 text-xs text-[#D9D9D9] bg-[#D9D9D9]/5 border border-[#D9D9D9]/15 p-3 rounded-lg font-bold">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Uploading files directly to Cloudinary CDN...</span>
              </div>
            )}
            {uploadProgress === "success" && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/5 border border-emerald-400/15 p-3 rounded-lg font-bold">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Upload successful! Queue cleared.</span>
              </div>
            )}
            {uploadProgress === "error" && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/5 border border-red-500/15 p-3 rounded-lg font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Upload pipeline encountered errors. Please retry.</span>
              </div>
            )}

            <button
              onClick={handleBulkUpload}
              disabled={uploadFiles.length === 0 || uploadProgress === "uploading"}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5F5F5] disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              START BULK UPLOAD ({uploadFiles.length} FILES)
            </button>
          </div>

        </div>

      </div>

      {/* 3. Category Selector Filter */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-white/5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`h-9 px-4.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#D9D9D9] text-black shadow-md"
                : "bg-[#0d0d0d] border border-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Gallery Photo Stream Grid */}
      {loading ? (
        <div className="flex h-[30vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D9D9D9]" />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {images.map((img) => (
            <div 
              key={img._id} 
              className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-3 shadow-lg flex flex-col justify-between group hover:border-white/10 transition-all duration-300 relative"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/5 group-hover:scale-[1.01] transition-transform duration-300">
                  <img 
                    src={img.imageUrl} 
                    alt={img.title || "Gallery Item"} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startRename(img)}
                      className="h-8 w-8 rounded-lg bg-black/80 hover:bg-black border border-white/15 text-gray-300 hover:text-white flex items-center justify-center active:scale-90 transition-all"
                      title="Edit details"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => askDelete(img._id)}
                      className="h-8 w-8 rounded-lg bg-black/80 hover:bg-red-500 border border-white/15 hover:border-red-500 text-gray-300 hover:text-white flex items-center justify-center active:scale-90 transition-all"
                      title="Delete Image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info Text */}
                <div className="mt-3 px-1">
                  <h4 className="text-xs font-bold text-white truncate uppercase tracking-wider">{img.title}</h4>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block truncate">
                    {img.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No showcase graphics uploaded under the selected category yet.
        </div>
      )}

      {/* RENAME POPUP MODAL */}
      {editId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5">
              <h3 className="text-xs font-black uppercase text-white tracking-widest">Edit Image Parameters</h3>
              <button onClick={() => setEditId(null)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Image Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Category Assignment</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                >
                  {CATEGORIES.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="flex-1 h-11 rounded-lg border border-white/15 bg-transparent text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleRenameSave}
                  disabled={renaming}
                  className="flex-1 h-11 rounded-lg bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5F5F5] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  {renaming ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      SAVE PARAMETERS
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this image?"
        message="This image will be permanently removed from the gallery."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}
