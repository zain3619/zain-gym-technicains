"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Upload, Eye, PenTool, CheckCircle, EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

export default function BlogCMSPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs?all=true");
      const data = await response.json();
      if (response.ok) {
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error("Blogs fetch error:", error);
      toast.error("Failed to load blog database. Rendering fallbacks.");
      setBlogs([
        {
          _id: "b1",
          title: "How to Design a High-Yield Commercial Gym Setup",
          slug: "high-yield-commercial-gym-setup",
          content: "Designing a gym layout requires a balance of safety, traffic organization, and equipment sequencing. First, partition strength zones away from cardio zones to prevent crowding. Next...",
          category: "Gym Design",
          isPublished: true,
          featuredImage: "https://picsum.photos/600/400?random=21",
        },
        {
          _id: "b2",
          title: "Maintaining Plate-Loaded Machines: Professional Checklist",
          slug: "plate-loaded-machines-maintenance",
          content: "Plate-loaded mechanisms are built for maximum weight tolerances, but they require periodic rod lubricating and weld tracking. Follow these simple daily cleaning checks...",
          category: "Maintenance",
          isPublished: false,
          featuredImage: "https://picsum.photos/600/400?random=22",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateAutoSlug = (text) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!editId) {
      setSlug(generateAutoSlug(val));
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
    setSlug("");
    setContent("");
    setCategory("Fitness");
    setSeoTitle("");
    setSeoDescription("");
    setIsPublished(true);
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditId(blog._id);
    setTitle(blog.title || "");
    setSlug(blog.slug || "");
    setContent(blog.content || "");
    setCategory(blog.category || "Fitness");
    setSeoTitle(blog.seoTitle || "");
    setSeoDescription(blog.seoDescription || "");
    setIsPublished(blog.isPublished !== undefined ? blog.isPublished : true);
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl(blog.featuredImage || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Blog article deleted successfully");
        fetchBlogs();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error("Please fill in required inputs: title, slug, content");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("title", title);
    payload.append("slug", slug);
    payload.append("content", content);
    payload.append("category", category);
    payload.append("seoTitle", seoTitle || title);
    payload.append("seoDescription", seoDescription || content.substring(0, 150));
    payload.append("isPublished", isPublished);

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    const url = editId 
      ? `/api/blogs/${editId}` 
      : "/api/blogs";
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editId ? "Blog updated successfully" : "Blog article created!");
        setModalOpen(false);
        fetchBlogs();
      } else {
        throw new Error(data.message || "Failed to submit blog");
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
            Blog & Articles <span className="text-[#82cd2b]">CMS Portal</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Publish fitness guides, gym setup tutorials, and technical machines checklists.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#82cd2b] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#97ff02] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          WRITE ARTICLE
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
        </div>
      ) : blogs.length > 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/45 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="p-4">Featured Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">URL Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="h-14 w-20 rounded-lg bg-black border border-white/5 overflow-hidden flex items-center justify-center">
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white max-w-[200px] truncate">{blog.title}</td>
                    <td className="p-4 text-gray-400">{blog.category}</td>
                    <td className="p-4 text-gray-500 font-mono text-[10px]">{blog.slug}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        blog.isPublished 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg active:scale-90 transition-all cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg active:scale-90 transition-all cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No blog posts found. Get started by writing a brand new technical or fitness guide!
        </div>
      )}

      {/* RICH MODAL PORTAL EDITOR */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[700px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5 shrink-0">
              <h3 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                <PenTool className="h-4.5 w-4.5 text-[#82cd2b]" />
                {editId ? "Edit Article Details" : "Compose Technical Article"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Article Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. How to Design a High-Yield Commercial Gym Setup"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">URL Route Slug *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateAutoSlug(e.target.value))}
                    placeholder="high-yield-commercial-gym-setup"
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value="Fitness">Fitness & Health</option>
                    <option value="Gym Design">Gym Layout & Design</option>
                    <option value="Maintenance">Machines Maintenance</option>
                    <option value="Business">Commercial Gym Planning</option>
                    <option value="Equipment">Equipment Supply Reviews</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Article Body (Supports raw HTML) *</label>
                <textarea
                  rows="8"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full content of the blog article here..."
                  className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all font-sans"
                  required
                />
              </div>

              {/* SEO parameters */}
              <div className="p-4 rounded-xl border border-white/5 bg-black/45 space-y-3">
                <span className="text-[9px] text-[#82cd2b] font-black uppercase tracking-wider block mb-1">SEO Dynamic Tags</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">SEO Title (Tab Header)</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || "Google tab title..."}
                      className="h-10 w-full rounded-lg border border-white/10 bg-black px-4.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">SEO Description (Meta Tag)</label>
                    <input
                      type="text"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Google search summary..."
                      className="h-10 w-full rounded-lg border border-white/10 bg-black px-4.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Image & Publish Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Featured Image File</label>
                  {previewUrl || existingImageUrl ? (
                    <div className="relative aspect-video w-full rounded-lg bg-black border border-white/10 overflow-hidden mb-3 flex items-center justify-center">
                      <img 
                        src={previewUrl || existingImageUrl} 
                        alt="Featured Preview" 
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
                    />
                  </label>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Publishing State</label>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`h-11 w-full rounded-lg border transition-all flex items-center justify-center gap-2 font-extrabold text-[10px] uppercase tracking-wider cursor-pointer ${
                      isPublished 
                        ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400" 
                        : "bg-gray-500/10 border-white/15 text-gray-400 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {isPublished ? (
                      <>
                        <Eye className="h-4.5 w-4.5" />
                        PUBLISHED (LIVE SITE)
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4.5 w-4.5" />
                        DRAFT (HIDDEN)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
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
                      SAVE ARTICLE
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
