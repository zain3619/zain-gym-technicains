"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save, Key, ShieldCheck, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const localUser = localStorage.getItem("admin_user");
    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUsername(parsed.username || "");
      setEmail(parsed.email || "");
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("admin_token");
    const payload = {
      username,
      email
    };
    if (password) {
      payload.password = password;
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Administrator credentials updated successfully!");
        setPassword("");
        setConfirmPassword("");
        
        // Update localStorage and fire update event to sync the sidebar/navbar
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("admin_user_updated"));
      } else {
        throw new Error(data.message || "Failed to update account details");
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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-black uppercase text-white tracking-wider">
          Admin <span className="text-[#D9D9D9]">Account Settings</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Configure your login credentials, administration email address, and access password.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-2 pb-2 border-b border-white/5 flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-[#D9D9D9]" />
            Identity Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-500"><User className="h-4 w-4" /></span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black pl-11 pr-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-500"><Mail className="h-4 w-4" /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-white/10 bg-black pl-11 pr-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <h3 className="text-xs font-black uppercase tracking-widest text-white mt-8 pb-2 border-b border-white/5 flex items-center gap-2">
            <Key className="h-4.5 w-4.5 text-[#D9D9D9]" />
            Security Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all placeholder:text-gray-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="h-11 w-full rounded-lg border border-white/10 bg-black px-4 text-xs text-white outline-none focus:border-[#D9D9D9]/55 transition-all placeholder:text-gray-700"
              />
            </div>
          </div>

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
                SAVE ACCOUNT CREDENTIALS
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
