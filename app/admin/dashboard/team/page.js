"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, X, Loader2, Save, 
  Upload, Users, Share2, Link
} from "lucide-react";
import toast from "react-hot-toast";

export default function TeamManagementPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/team");
      const data = await response.json();
      if (response.ok) {
        setTeam(data);
      }
    } catch (error) {
      console.error("Fetch team error:", error);
      toast.error("Failed to load team roster. Display fallback list.");
      setTeam([
        {
          _id: "t1",
          name: "Muhammad Qaiser",
          role: "Master Installation Lead",
          experience: "14 Years",
          imageUrl: "https://picsum.photos/400/400?random=31",
          socialLinks: { facebook: "https://facebook.com", instagram: "https://instagram.com" },
        },
        {
          _id: "t2",
          name: "Zain Qaiser",
          role: "Lead Assembly Technician",
          experience: "8 Years",
          imageUrl: "https://picsum.photos/400/400?random=32",
          socialLinks: { linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
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
    setExperience("");
    setFacebook("");
    setInstagram("");
    setTwitter("");
    setLinkedin("");
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl("");
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditId(member._id);
    setName(member.name || "");
    setRole(member.role || "");
    setExperience(member.experience || "");
    setFacebook(member.socialLinks?.facebook || "");
    setInstagram(member.socialLinks?.instagram || "");
    setTwitter(member.socialLinks?.twitter || "");
    setLinkedin(member.socialLinks?.linkedin || "");
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl(member.imageUrl || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff profile?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`http://localhost:5000/api/v1/team/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Roster profile deleted");
        fetchTeam();
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
    if (!name || !role) {
      toast.error("Please fill in required fields: name, role");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("admin_token");
    const payload = new FormData();
    payload.append("name", name);
    payload.append("role", role);
    payload.append("experience", experience);
    payload.append("facebook", facebook);
    payload.append("instagram", instagram);
    payload.append("twitter", twitter);
    payload.append("linkedin", linkedin);

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    const url = editId 
      ? `http://localhost:5000/api/v1/team/${editId}` 
      : "http://localhost:5000/api/v1/team";
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
        toast.success(editId ? "Profile updated successfully" : "Profile created successfully!");
        setModalOpen(false);
        fetchTeam();
      } else {
        throw new Error(data.message || "Failed to submit profile");
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
            Team & Staff <span className="text-[#82cd2b]">Roster CMS</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure profile details of master assemblers, logistics lead, and gym coaches.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#82cd2b] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#97ff02] active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          ADD TEAM MEMBER
        </button>
      </div>

      {loading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#82cd2b]" />
        </div>
      ) : team.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member._id} className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-4 flex flex-col justify-between group hover:border-[#82cd2b]/30 transition-all duration-300 relative shadow-xl">
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/5 group-hover:scale-[1.01] transition-transform duration-300">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(member)}
                      className="h-8 w-8 rounded-lg bg-black/85 hover:bg-black border border-white/10 text-gray-300 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(member._id)}
                      className="h-8 w-8 rounded-lg bg-black/85 hover:bg-red-500 border border-white/10 hover:border-red-500 text-gray-300 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{member.name}</h4>
                  <span className="text-[10px] text-[#82cd2b] font-bold uppercase tracking-wider block mt-0.5">{member.role}</span>
                  {member.experience && (
                    <span className="text-[10px] text-gray-500 font-bold block mt-1">Exp: {member.experience}</span>
                  )}
                </div>
              </div>

              {/* Social list */}
              <div className="flex gap-2.5 mt-4 pt-3 border-t border-white/5 justify-start text-gray-500">
                {member.socialLinks?.facebook && <Link className="h-4 w-4 hover:text-white transition-colors" />}
                {member.socialLinks?.instagram && <Share2 className="h-4 w-4 hover:text-white transition-colors" />}
                {member.socialLinks?.twitter && <Share2 className="h-4 w-4 hover:text-white transition-colors" />}
                {member.socialLinks?.linkedin && <Link className="h-4 w-4 hover:text-white transition-colors" />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-[#0d0d0d] text-gray-500 text-xs">
          No team profiles uploaded yet. Add a profile card to showcase your installers!
        </div>
      )}

      {/* CRUD MODAL POPUP */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[500px] rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-5 shrink-0">
              <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-[#82cd2b]" />
                {editId ? "Modify Staff Profile" : "Register Team Member"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Member Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Muhammad Qaiser"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Role / Designation *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Role / Designation</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Ladies trainer">Ladies trainer</option>
                    <option value="Technicians">Technicians</option>
                    <option value="CEO">CEO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Experience Length</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 14 Years"
                    className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 transition-all"
                  />
                </div>
              </div>

              {/* Social parameters */}
              <div className="p-4 rounded-xl border border-white/5 bg-black/45 space-y-3">
                <span className="text-[9px] text-[#82cd2b] font-black uppercase tracking-wider block mb-1">Social Handles Links</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Facebook</label>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/username"
                      className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Instagram</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/username"
                      className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Twitter (X)</label>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="h-10 w-full rounded-lg border border-white/10 bg-black px-3.5 text-xs text-white outline-none focus:border-[#82cd2b]/55 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Profile Avatar Picture *</label>
                {previewUrl || existingImageUrl ? (
                  <div className="relative h-28 w-28 rounded-xl bg-black border border-white/10 overflow-hidden mb-3 flex items-center justify-center">
                    <img 
                      src={previewUrl || existingImageUrl} 
                      alt="Roster Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <label className="flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#82cd2b]/40 rounded-lg h-11 bg-black/35 hover:bg-black/60 transition-all cursor-pointer">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Choose Image file</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editId}
                  />
                </label>
              </div>

              {/* Action Buttons */}
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
                      SAVE PROFILE
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
