"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Dumbbell,
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  Users,
  MessageSquare,
  PenTool,
  Award,
  Home,
  FolderHeart,
  Sparkles,
  LogOut,
  Menu,
  X,
  ScrollText,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";
import { COMPANY_NAME } from "../../lib/seo";

const SIDEBAR_W = 260;
const SIDEBAR_COLLAPSED_W = 76;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminUser = localStorage.getItem("admin_user");

    if (!token) {
      toast.error("Access Denied. Please log in first.");
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
      if (adminUser) {
        setUser(JSON.parse(adminUser));
      }
    }
  }, [router]);

  useEffect(() => {
    const handleUserUpdate = () => {
      const adminUser = localStorage.getItem("admin_user");
      if (adminUser) {
        setUser(JSON.parse(adminUser));
      }
    };
    window.addEventListener("admin_user_updated", handleUserUpdate);
    return () => window.removeEventListener("admin_user_updated", handleUserUpdate);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast.success("Successfully logged out.");
    router.push("/admin");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D9D9D9] border-t-transparent" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#A0A0A0]">
            Verifying access…
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Home Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Hero Section", href: "/admin/dashboard/hero", icon: Home },
    { name: "About Details", href: "/admin/dashboard/about", icon: FolderHeart },
    { name: "Services CRUD", href: "/admin/dashboard/services", icon: Dumbbell },
    { name: "Gallery Stream", href: "/admin/dashboard/gallery", icon: ImageIcon },
    { name: "Video Gallery", href: "/admin/dashboard/videos", icon: Film },
    { name: "Team & Roster", href: "/admin/dashboard/team", icon: Users },
    { name: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare },
    { name: "Pricing Packages", href: "/admin/dashboard/pricing", icon: Award },
    { name: "Blog CMS", href: "/admin/dashboard/blogs", icon: PenTool },
    { name: "Contact Messages", href: "/admin/dashboard/messages", icon: ScrollText },
    { name: "Site Banners", href: "/admin/dashboard/banners", icon: Sparkles },
    { name: "My Profile", href: "/admin/dashboard/profile", icon: Users },
    { name: "Admin Settings", href: "/admin/dashboard/admin-settings", icon: Settings },
    { name: "Global Settings", href: "/admin/dashboard/settings", icon: Settings },
  ];

  const activeName =
    menuItems.find((item) => item.href === pathname)?.name || "Control Center";
  const sidebarWidth = isSidebarOpen ? SIDEBAR_W : SIDEBAR_COLLAPSED_W;

  const BrandMark = ({ compact = false }) => (
    <Link
      href="/admin/dashboard"
      className={`flex items-center gap-3 overflow-hidden ${compact ? "" : ""}`}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-white/15 bg-[#111]">
        <Image
          src="/icon.png"
          alt={COMPANY_NAME}
          fill
          sizes="40px"
          className="object-cover"
          priority
        />
      </div>
      {isSidebarOpen || compact ? (
        <div className="min-w-0 select-none">
          <h1 className="font-display text-[11px] font-bold uppercase leading-none tracking-[-0.02em] text-[#F5F5F5]">
            Zain Gym
          </h1>
          <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
            Admin
          </span>
        </div>
      ) : null}
    </Link>
  );

  const NavLinks = ({ onNavigate, showLabels = true }) =>
    menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={onNavigate}
          title={item.name}
          className={`flex items-center gap-3 px-3.5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
            isActive
              ? "bg-[#D9D9D9] text-[#050505]"
              : "text-[#A0A0A0] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
          } ${!showLabels ? "justify-center px-0" : ""}`}
        >
          <Icon className="h-[18px] w-[18px] shrink-0" />
          {showLabels ? <span className="truncate">{item.name}</span> : null}
        </Link>
      );
    });

  return (
    <div className="h-dvh overflow-hidden bg-[#050505] text-[#F5F5F5]">
      {/* Fixed desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-white/10 bg-[#080808] transition-[width] duration-300 lg:flex"
        style={{ width: sidebarWidth }}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-4">
          <BrandMark />
        </div>

        <nav className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
          <NavLinks showLabels={isSidebarOpen} />
        </nav>

        <div className="shrink-0 border-t border-white/10 p-2">
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className={`flex w-full items-center gap-3 px-3.5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400 transition-colors hover:bg-red-500/10 ${
              !isSidebarOpen ? "justify-center px-0" : ""
            }`}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {isSidebarOpen ? <span>Log Out</span> : null}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <aside
          className={`flex h-full w-[280px] flex-col border-r border-white/10 bg-[#080808] transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
            <BrandMark compact />
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 text-[#A0A0A0] hover:text-[#F5F5F5]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
            <NavLinks onNavigate={() => setIsMobileOpen(false)} showLabels />
          </nav>

          <div className="shrink-0 border-t border-white/10 p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3.5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main column — only this scrolls */}
      <div
        className="flex h-dvh flex-col transition-[padding] duration-300 lg:pl-[var(--admin-sidebar-w)]"
        style={{
          ["--admin-sidebar-w"]: `${sidebarWidth}px`,
        }}
      >
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#080808]/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="hidden p-2 text-[#A0A0A0] transition-colors hover:bg-white/5 hover:text-[#D9D9D9] lg:flex"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-[#A0A0A0] transition-colors hover:bg-white/5 hover:text-[#D9D9D9] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="hidden h-5 w-px bg-white/10 sm:block" />

            <div className="hidden sm:block">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
                Admin
              </p>
              <h2 className="font-display text-sm font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
                {activeName}
              </h2>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="hidden text-right xs:block sm:block">
                <span className="block text-xs font-semibold capitalize text-[#F5F5F5]">
                  {user?.username || "Admin"}
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A0A0A0]">
                  {user?.role || "Console Admin"}
                </span>
              </div>

              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-[#111] text-[11px] font-bold uppercase text-[#D9D9D9]">
                {user?.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.username?.substring(0, 2) || "AD"
                )}
              </div>
            </button>

            {isDropdownOpen ? (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 z-40 mt-2 w-48 border border-white/10 bg-[#0D0D0D] p-1.5 shadow-2xl">
                  <Link
                    href="/admin/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0A0A0] transition-colors hover:bg-white/5 hover:text-[#F5F5F5]"
                  >
                    <Users className="h-4 w-4 text-[#D9D9D9]" />
                    My Profile
                  </Link>
                  <Link
                    href="/admin/dashboard/admin-settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A0A0A0] transition-colors hover:bg-white/5 hover:text-[#F5F5F5]"
                  >
                    <Settings className="h-4 w-4 text-[#D9D9D9]" />
                    Settings
                  </Link>
                  <div className="my-1.5 h-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </header>

        <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
