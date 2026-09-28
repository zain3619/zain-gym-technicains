"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Upload, Save, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AboutManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    experienceYears: "",
    gymsBuilt: "",
    clientSatisfaction: "",
  });
  const [aboutImage, setAboutImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sections/about");
      const data = await response.json();
      if (response.ok) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          experienceYears: data.experienceYears !== undefined ? data.experienceYears : "",
          gymsBuilt: data.gymsBuilt !== undefined ? data.gymsBuilt : "",
          clientSatisfaction: data.clientSatisfaction || "",
        });
        setAboutImage(data.imageUrl || "");
      }
    } catch (error) {
      console.error("About fetch error:", error);
      toast.error("Failed to load about data from server. Load fallback values.");
      setFormData({
        title: "We Build More Than Gyms We Build Experiences.",
        description: "From concept to completion, we deliver gym design, gym building, gym setup services, top-tier fitness equipment, and expert support.",
        experienceYears: 14,
        gymsBuilt: 30,
        clientSatisfaction: "100%",
      });
      setAboutImage("/about-team.png");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const token = localStorage.getItem("admin_token");
    const updateData = new FormData();
    
    Object.keys(formData).forEach(key => {
      updateData.append(key, formData[key]);
    });
    
    if (selectedFile) {
      updateData.append("image", selectedFile);
    }

    try {
      const response = await fetch("/api/sections/about", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: updateData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update about section");
      }

      setAboutImage(data.imageUrl);
      setSelectedFile(null);
      setPreviewUrl("");
      toast.success("About section updated successfully!");
    } catch (error) {
      console.error("About save error:", error);
      toast.error(error.message || "Failed to save updates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D9D9D9]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          About Us Section <span className="text-[#D9D9D9]">Management</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Fields */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5">Text & Profile</h3>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Section Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#D9D9D9]/55 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Detailed Biography / Description</label>
            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#D9D9D9]/55 transition-all resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Years of Exp.</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Gyms Setup</label>
              <input
                type="number"
                name="gymsBuilt"
                value={formData.gymsBuilt}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Satisfaction</label>
              <input
                type="text"
                name="clientSatisfaction"
                value={formData.clientSatisfaction}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Side: File Upload Preview */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5">Showcase Graphic</h3>
            
            {/* Image Preview Box */}
            <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center group mb-4">
              {previewUrl || aboutImage ? (
                <img 
                  src={previewUrl || aboutImage} 
                  alt="About Showcase Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500 gap-1.5 text-xs">
                  <ImageIcon className="h-8 w-8 text-gray-600" />
                  No image loaded
                </div>
              )}
            </div>

            {/* Drop Zone Input */}
            <label className="flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-[#D9D9D9]/40 rounded-xl p-5 bg-black/35 hover:bg-black/60 transition-all cursor-pointer">
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Choose New Showcase Image</span>
              <span className="text-[9px] text-gray-500 mt-1">Recommended: 800x600px PNG format (under 5MB)</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5F5F5] disabled:opacity-50 transition-all cursor-pointer shadow-md"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <>
                <Save className="h-4.5 w-4.5" />
                SAVE ABOUT SETTINGS
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
