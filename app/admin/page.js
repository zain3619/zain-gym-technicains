"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { COMPANY_NAME } from "../lib/seo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) router.push("/admin/dashboard");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data));
      toast.success("Welcome back");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,217,217,0.06),transparent_55%)]" />
      <div className="cinema-overlay pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative mb-5 h-16 w-16 overflow-hidden border border-white/15 bg-[#080808]">
            <Image
              src="/icon.png"
              alt={COMPANY_NAME}
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>
          <p className="scene-label mb-3">Admin Access</p>
          <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.03em] text-[#F5F5F5]">
            Zain Gym
            <span className="mt-1 block text-sm font-medium tracking-[0.28em] text-[#A0A0A0]">
              Technicians
            </span>
          </h1>
        </div>

        <div className="border border-white/10 bg-[#080808]/90 p-8 backdrop-blur-md">
          <div className="mb-7 border-b border-white/8 pb-5">
            <h2 className="font-display text-lg font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
              Sign In
            </h2>
            <p className="mt-2 text-xs tracking-wide text-[#A0A0A0]">
              Enter your credentials to manage the site.
            </p>
          </div>

          {error ? (
            <div className="mb-5 flex items-start gap-2.5 border border-red-500/25 bg-red-500/5 p-3.5 text-xs text-red-300">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@zaingym.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full border border-white/12 bg-[#050505] px-4 text-sm text-[#F5F5F5] outline-none placeholder:text-[#666] focus:border-[#D9D9D9]/45"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full border border-white/12 bg-[#050505] px-4 pr-11 text-sm text-[#F5F5F5] outline-none placeholder:text-[#666] focus:border-[#D9D9D9]/45"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#F5F5F5]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-silver-fill mt-2 flex h-12 w-full items-center justify-center gap-2 text-[11px] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#666]">
          <Link href="/" className="hover:text-[#D9D9D9]">
            ← Back to site
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
