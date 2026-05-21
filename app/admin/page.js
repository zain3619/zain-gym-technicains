"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, ShieldAlert, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data));
      
      toast.success("Welcome back! Loading your dashboard...");
      
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-[#82cd2b]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        {/* Logo Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111] border border-white/10 text-[#82cd2b] shadow-[0_0_25px_rgba(130,205,43,0.15)] mb-3">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-white text-2xl font-black tracking-tighter uppercase text-center leading-none">
            ZAIN GYM <span className="text-[#82cd2b]">TECHNICIANS</span>
          </h1>
          <span className="text-[10px] text-gray-500 tracking-[3px] uppercase mt-1">
            Secure Admin Gateway
          </span>
        </div>

        {/* Card */}
        <div className="rounded-[20px] border border-white/10 bg-[#0d0d0d] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Administrator Login</h2>
            <p className="text-xs text-gray-400 mt-1">Enter your credentials below to enter the cockpit.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@zaingym.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-lg border border-white/10 bg-black/45 px-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 focus:ring-1 focus:ring-[#82cd2b]/25 transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Master account seeded in server.js by default.");
                  }}
                  className="text-[10px] text-[#82cd2b] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-lg border border-white/10 bg-black/45 pl-4 pr-10 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#82cd2b]/55 focus:ring-1 focus:ring-[#82cd2b]/25 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#82cd2b] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#97ff02] disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer shadow-[0_12px_24px_rgba(130,205,43,0.15)] hover:shadow-[0_12px_32px_rgba(130,205,43,0.25)]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-[10px] text-gray-600">
          &copy; {new Date().getFullYear()} Zain Gym Technicians. Powered by Admin Core v1.0.
        </div>
      </div>
    </div>
  );
}
