"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Upload, Save, Settings, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    footerText: "",
    phone: "",
    email: "",
    address: "",
    openingHours: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  });
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sections/settings");
      const data = await response.json();
      if (response.ok) {
        setFormData({
          footerText: data.footerText || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          openingHours: data.openingHours || "",
          facebook: data.socialLinks?.facebook || "",
          instagram: data.socialLinks?.instagram || "",
          youtube: data.socialLinks?.youtube || "",
          linkedin: data.socialLinks?.linkedin || "",
        });
        setLogoUrl(data.logo || "");
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
      toast.error("Failed to load settings. Loaded developer fallback values.");
      setFormData({
        footerText: "Zain Gym Technicians. All rights reserved.",
        phone: "+92 323 3334777",
        email: "m.qaiser76@yahoo.com",
        address: "120, A Block Irrigation Co-operative Housing Society Near Race Club Kot Lakhpat, Lahore, Pakistan",
        openingHours: "Mon - Sun: 9:00 AM - 8:00 PM (Sunday: By Appointment)",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        linkedin: "https://linkedin.com",
      });
      setLogoUrl("");
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
      updateData.append("logo", selectedFile);
    }

    try {
      const response = await fetch("/api/sections/settings", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: updateData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      setLogoUrl(data.logo);
      setSelectedFile(null);
      setPreviewUrl("");
      toast.success("Global website settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save settings");
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
      <div>
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          Global Website <span className="text-[#82cd2b]">Settings CMS</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Configure business address, phone, emails, operating hours, and social media handles.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Text configurations */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-2">
            <Settings className="h-4.5 w-4.5 text-[#82cd2b]" />
            Business Contacts
          </h3>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Primary Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Primary Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Business Address Details</label>
            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/10 bg-black p-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Opening Hours Schedule</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleInputChange}
              className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
            />
          </div>
        </div>

        {/* Right Side: Logos & social links */}
        <div className="space-y-6">
          
          <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 pb-2 border-b border-white/5">Site Brand Elements</h3>
            
            <div className="flex items-center gap-4.5">
              <div className="h-14 w-14 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#82cd2b] overflow-hidden shrink-0">
                {previewUrl || logoUrl ? (
                  <img src={previewUrl || logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Dumbbell className="h-7 w-7" />
                )}
              </div>
              
              <label className="flex-1 flex h-11 items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#82cd2b]/40 bg-black/45 rounded-lg px-4 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer">
                <Upload className="h-4 w-4 text-gray-400" />
                UPLOAD LOGO IMAGE
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Footer Copyright Text</label>
              <input
                type="text"
                name="footerText"
                value={formData.footerText}
                onChange={handleInputChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
              />
            </div>
          </div>

          {/* Social Handles Link Deck */}
          <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 pb-2 border-b border-white/5">Social Channels URLs</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">YouTube Channel</label>
                <input
                  type="text"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">LinkedIn Page</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#82cd2b] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#97ff02] disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              {saving ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  SAVE SITE SETTINGS
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
