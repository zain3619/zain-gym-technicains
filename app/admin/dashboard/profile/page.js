"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Upload, Save, User, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await fetch("/api/auth/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAdminUser(data);
          // Sync localStorage
          localStorage.setItem("admin_user", JSON.stringify(data));
          window.dispatchEvent(new Event("admin_user_updated"));
        } else {
          // fallback to localStorage
          const localUser = localStorage.getItem("admin_user");
          if (localUser) {
            setAdminUser(JSON.parse(localUser));
          }
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        const localUser = localStorage.getItem("admin_user");
        if (localUser) {
          setAdminUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    if (!selectedFile) {
      toast.error("Please select a profile image to upload first!");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("image", selectedFile);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: payload
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile avatar image updated successfully!");
        const nextUser = data.user || {
          ...(adminUser || {}),
          profileImage: data.profileImage,
        };
        setAdminUser(nextUser);
        setSelectedFile(null);
        setPreviewUrl("");

        localStorage.setItem("admin_user", JSON.stringify(nextUser));
        window.dispatchEvent(new Event("admin_user_updated"));
      } else {
        throw new Error(data.message || "Failed to update profile image");
      }
    } catch (error) {
      toast.error(error.message);
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

  const avatarSrc = previewUrl || adminUser?.profileImage || "";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          My <span className="text-[#D9D9D9]">Admin Profile</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Manage your administrative credentials and customize your profile avatar picture.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Picture Frame */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
            <div className="relative h-28 w-28 rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-lg group">
              {avatarSrc ? (
                <img 
                  src={avatarSrc} 
                  alt="Admin Avatar Preview" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(circle_at_35%_35%,#D9D9D9,rgba(0,0,0,1))] flex items-center justify-center text-black text-2xl font-black uppercase">
                  {adminUser?.username?.substring(0, 2) || "AD"}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full text-center sm:text-left">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">Administrator Avatar</h4>
                <p className="text-[10px] text-gray-500 mt-1">Upload a custom square avatar picture. Maximum size 5MB.</p>
              </div>
              
              <label className="flex h-10 items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#D9D9D9]/40 rounded-lg bg-black/45 hover:bg-black/60 transition-all cursor-pointer text-xs font-extrabold uppercase tracking-wider">
                <Upload className="h-4 w-4 text-gray-400" />
                CHOOSE NEW IMAGE
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Admin Metadata List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Username</span>
              <p className="text-sm font-bold text-white capitalize">{adminUser?.username || "Admin"}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Email Address</span>
              <p className="text-sm font-bold text-white">{adminUser?.email || "admin@zaingym.com"}</p>
            </div>

            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Access Authorization</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="h-4 w-4 text-[#D9D9D9]" />
                <p className="text-xs font-black uppercase text-[#D9D9D9] tracking-wider">{adminUser?.role || "Console Admin"}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-black border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Designation</span>
              <p className="text-xs font-bold text-gray-300">Zain Gym Technicians Core Administrator</p>
            </div>
          </div>

          {/* Save Button */}
          {selectedFile && (
            <button
              type="submit"
              disabled={saving}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#D9D9D9] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#F5F5F5] disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              {saving ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-black" />
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  SAVE PROFILE AVATAR
                </>
              )}
            </button>
          )}

        </form>
      </div>
    </div>
  );
}
