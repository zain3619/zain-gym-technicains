"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Upload, Film, Sparkles, ArrowUpDown
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function VideoManagementPage() {
  const [videos, setVideos] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);

  // File States & Previews
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [existingVideoUrl, setExistingVideoUrl] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/videos?admin=true");
      const data = await response.json();
      if (response.ok) {
        setVideos(data);
      } else {
        throw new Error(data.message || "Failed to load");
      }
    } catch (error) {
      console.error("Fetch videos error:", error);
      toast.error("Failed to load video list.");
      setVideos([
        {
          _id: "v1",
          title: "Strength. Discipline. Progress.",
          videoUrl: "https://res.cloudinary.com/dpfeinyyb/video/upload/v1779368324/mock-video.mp4",
          thumbnailUrl: "https://picsum.photos/800/600?random=41",
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file (e.g. mp4, webm, mov)");
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setIsActive(true);
    setVideoFile(null);
    setVideoPreviewUrl("");
    setExistingVideoUrl("");
    setModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditId(video._id || video.id);
    setTitle(video.title || "");
    setIsActive(video.isActive);
    setVideoFile(null);
    setVideoPreviewUrl("");
    setExistingVideoUrl(video.videoUrl || "");
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
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Video deleted successfully!");
        setDeleteTarget(null);
        fetchVideos();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete video");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required!");
      return;
    }
    if (!editId && !videoFile && !existingVideoUrl) {
      toast.error("Please upload a video file!");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("title", title);
    payload.append("isActive", String(isActive));
    
    // Default values to keep schema properties fully happy
    payload.append("category", "General");
    payload.append("description", "Premium Training Session");
    payload.append("duration", "0:00");
    payload.append("sortOrder", "0");

    if (videoFile) {
      payload.append("video", videoFile);
    }

    const url = editId ? `/api/videos/${editId}` : "/api/videos";
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
        toast.success(editId ? "Video updated successfully!" : "New video added!");
        setModalOpen(false);
        fetchVideos();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save video changes");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#D9D9D9] mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Core CMS
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight leading-none">
            Video Section <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9D9D9] to-white">Gallery</span>
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Upload and toggle active display videos on the main page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#F5F5F5] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#D9D9D9]/15 self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5 stroke-[3]" /> Add New Video
        </button>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#D9D9D9]" />
          <p className="text-xs text-gray-400">Loading video library...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/10 bg-[#070707] text-center p-6">
          <Film className="h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-sm font-extrabold uppercase text-white">No Videos Registered</h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1.5">
            You haven't uploaded any training video segments yet. Click the button above to begin!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div 
              key={video._id}
              className={`group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border ${
                video.isActive ? "border-white/5" : "border-red-500/10 opacity-70"
              } hover:border-[#D9D9D9]/35 shadow-2xl transition-all duration-300`}
            >
              {/* Card Media Preview */}
              <div className="relative h-48 w-full bg-black overflow-hidden">
                <video 
                  src={video.videoUrl} 
                  poster={video.thumbnailUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80 pointer-events-none" />
                
                {/* Status Indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${video.isActive ? "bg-[#D9D9D9]" : "bg-red-500"}`} />
                </div>
              </div>

              {/* Description & Caption Info */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-[#D9D9D9] transition-colors line-clamp-1 leading-snug">
                    {video.title}
                  </h3>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="text-[10px] text-gray-500">
                    Status: <span className={video.isActive ? "text-[#D9D9D9] font-bold" : "text-red-400 font-bold"}>{video.isActive ? "Active" : "Inactive"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(video)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-[#D9D9D9] hover:bg-white/10 transition-all cursor-pointer"
                      title="Edit Video"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => askDelete(video._id)}
                      className="p-2 rounded-lg bg-red-500/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Delete Video"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Form Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#090909] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-[#D9D9D9]" />
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
                  {editId ? "Modify Video" : "Register Video"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Scroll Container */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Form Grid */}
              <div className="space-y-5">
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Video Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Strength. Discipline. Progress."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:border-[#D9D9D9] focus:outline-none transition-colors"
                  />
                </div>

                {/* Video Upload Block */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Upload Video File <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-[#D9D9D9]/40 rounded-xl p-6 bg-black cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="h-7 w-7 text-gray-500 group-hover:text-[#D9D9D9] mb-2" />
                    <span className="text-[10px] text-gray-400 text-center truncate w-full">
                      {videoFile ? videoFile.name : "Select or drag Video file"}
                    </span>
                    <span className="text-[8px] text-gray-600 mt-0.5">MP4, MOV, or WEBM format</span>
                  </div>

                  {/* Video Live Preview */}
                  {(videoPreviewUrl || existingVideoUrl) && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/5 bg-black p-2">
                      <p className="text-[9px] font-bold text-[#D9D9D9] mb-1 uppercase">Video Preview:</p>
                      <video
                        src={videoPreviewUrl || existingVideoUrl}
                        controls
                        className="w-full max-h-32 object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Active Toggle Switch */}
                <div className="flex items-center justify-between bg-black/45 border border-white/5 rounded-xl px-4 py-3 h-[46px]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Publish Active state
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D9D9D9]"></div>
                  </label>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/15 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-extrabold uppercase tracking-widest active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5F5F5] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#D9D9D9]/15 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin stroke-[3]" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Video
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
        title="Delete this video?"
        message="This video will be permanently removed from the site."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  );
}
