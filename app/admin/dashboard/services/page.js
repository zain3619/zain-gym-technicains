"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Dumbbell, Layout, Wrench, 
  Truck, Heart, Activity, Loader2, Save, Upload, Eye
} from "lucide-react";
import toast from "react-hot-toast";

const ICON_MAP = {
  Dumbbell: Dumbbell,
  Layout: Layout,
  Wrench: Wrench,
  Truck: Truck,
  Heart: Heart,
  Activity: Activity,
};

export default function ServicesManagementPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal Fields
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Dumbbell");
  const [features, setFeatures] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (response.ok) {
        setServices(data);
      }
    } catch (error) {
      console.error("Fetch services error:", error);
      toast.error("Failed to load services. Display fallback mock list.");
      setServices([
        {
          _id: "s1",
          title: "Gym Layout Design",
          description: "Full professional CAD layouts engineered to scale maximize fitness space and organize equipment mapping.",
          icon: "Layout",
          features: ["2D Scale Drawings", "Equipment Alignment", "Accessibility Planning"],
          imageUrl: "https://picsum.photos/400/300?random=1",
        },
        {
          _id: "s2",
          title: "Equipment Delivery & Rigging",
          description: "Logistics and heavy rigging of standard industrial machines, lifting structures, and heavy treadmill systems.",
          icon: "Truck",
          features: ["Protected Shipping", "Heavy Rigging Lift", "Floor Ground Placement"],
          imageUrl: "https://picsum.photos/400/300?random=2",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setIcon("Dumbbell");
    setFeatures("");
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditId(service._id);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon || "Dumbbell");
    setFeatures(Array.isArray(service.features) ? service.features.join(", ") : "");
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl(service.imageUrl || "");
    setModalOpen(true);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Service deleted successfully");
        fetchServices();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("icon", icon);
    payload.append("features", features);
    
    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    const url = editId 
      ? `/api/services/${editId}` 
      : "/api/services";
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
        toast.success(editId ? "Service updated successfully" : "Service created successfully");
        setModalOpen(false);
        fetchServices();
      } else {
        throw new Error(data.message || "Submission failed");
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
            Gym Setup <span className="text-[#82cd2b]">Services CMS</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure service listings, layout designs features, icons, and pictures.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#82cd2b] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#97ff02] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          ADD SERVICE
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
        </div>
      ) : services.length > 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/45 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="p-4">Visual Icon</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Features Checklist</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {services.map((service) => {
                  const Icon = ICON_MAP[service.icon] || Dumbbell;
                  return (
                    <tr key={service._id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="h-10 w-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#82cd2b] shadow-inner">
                          <Icon className="h-5 w-5" />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white max-w-[150px] truncate">{service.title}</td>
                      <td className="p-4 max-w-[240px] truncate text-gray-400">{service.description}</td>
                      <td className="p-4 max-w-[200px]">
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(service.features) && service.features.map((feat, i) => (
                            <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(service)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg active:scale-90 transition-all cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg active:scale-90 transition-all cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No services configured yet. Get started by adding a brand new service!
        </div>
      )}

      {/* CRUD POPUP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5 shrink-0">
              <h3 className="text-sm font-black uppercase text-white tracking-widest">
                {editId ? "Modify Existing Service" : "Add Brand New Service"}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Service Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gym Layout Design"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Graphic Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255,255,255,0.4)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Layout">Layout/Design</option>
                    <option value="Wrench">Wrench/Technician</option>
                    <option value="Truck">Truck/Delivery</option>
                    <option value="Heart">Heart/Physio</option>
                    <option value="Activity">Activity/Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Features (Comma Separated)</label>
                  <input
                    type="text"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="e.g. 2D Layouts, Floor Placement"
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Service Description *</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the service offerings in details..."
                  className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Showcase Picture File</label>
                {previewUrl || existingImageUrl ? (
                  <div className="relative aspect-video w-full rounded-lg bg-black border border-white/10 overflow-hidden mb-3.5 flex items-center justify-center">
                    <img 
                      src={previewUrl || existingImageUrl} 
                      alt="Service Graphic Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <label className="flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#82cd2b]/40 rounded-lg h-12 bg-black/35 hover:bg-black/60 transition-all cursor-pointer">
                  <Upload className="h-4.5 w-4.5 text-gray-400" />
                  <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Choose Image File</span>
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
                  className="flex-1 h-11 rounded-lg bg-[#82cd2b] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#97ff02] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      SAVE CHANGES
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
