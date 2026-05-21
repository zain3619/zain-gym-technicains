"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Upload, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function HeroManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    ctaText1: "",
    ctaLink1: "",
    ctaText2: "",
    ctaLink2: "",
  });
  const [bgImage, setBgImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/sections/hero");
      const data = await response.json();
      if (response.ok) {
        setFormData({
          heading: data.heading || "",
          subheading: data.subheading || "",
          ctaText1: data.ctaText1 || "",
          ctaLink1: data.ctaLink1 || "",
          ctaText2: data.ctaText2 || "",
          ctaLink2: data.ctaLink2 || "",
        });
        setBgImage(data.backgroundImage || "");
      }
    } catch (error) {
      console.error("Hero fetch error:", error);
      toast.error("Failed to load hero data from server. Load fallback values.");
      setFormData({
        heading: "Complete Gym Setup",
        subheading: "From Design to Equipment Supply",
        ctaText1: "GET STARTED",
        ctaLink1: "/contact",
        ctaText2: "CONTACT US",
        ctaLink2: "/contact",
      });
      setBgImage("/hero-gym.png");
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
      const response = await fetch("http://localhost:5000/api/v1/sections/hero", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: updateData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update hero section");
      }

      setBgImage(data.backgroundImage);
      setSelectedFile(null);
      setPreviewUrl("");
      toast.success("Hero section updated successfully!");
    } catch (error) {
      console.error("Hero save error:", error);
      toast.error(error.message || "Failed to save updates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          Hero Layout Section <span className="text-[#82cd2b]">Management</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Fields */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5">Text & Captions</h3>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Subheading / Description</label>
            <textarea
              rows="3"
              name="subheading"
              value={formData.subheading}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">CTA Button 1 Text</label>
              <input
                type="text"
                name="ctaText1"
                value={formData.ctaText1}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">CTA Button 1 Link</label>
              <input
                type="text"
                name="ctaLink1"
                value={formData.ctaLink1}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">CTA Button 2 Text</label>
              <input
                type="text"
                name="ctaText2"
                value={formData.ctaText2}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">CTA Button 2 Link</label>
              <input
                type="text"
                name="ctaLink2"
                value={formData.ctaLink2}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Side: File Upload Preview */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5">Background Graphic</h3>
            
            {/* Image Preview Box */}
            <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center group mb-4">
              {previewUrl || bgImage ? (
                <img 
                  src={previewUrl || bgImage} 
                  alt="Hero Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500 gap-1.5 text-xs">
                  <ImageIcon className="h-8 w-8 text-gray-600" />
                  No background image loaded
                </div>
              )}
            </div>

            {/* Drop Zone Input */}
            <label className="flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-[#82cd2b]/40 rounded-xl p-5 bg-black/35 hover:bg-black/60 transition-all cursor-pointer">
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Choose New Background</span>
              <span className="text-[9px] text-gray-500 mt-1">Recommended: 1920x1080px (under 5MB)</span>
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
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#82cd2b] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#97ff02] disabled:opacity-50 transition-all cursor-pointer shadow-md"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <>
                <Save className="h-4.5 w-4.5" />
                SAVE HERO SETTINGS
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
