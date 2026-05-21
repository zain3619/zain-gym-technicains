"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Dumbbell, LayoutDashboard, Image, Settings, Users, 
  MessageSquare, PenTool, Award, Home, FolderHeart, 
  Sparkles, LogOut, Menu, X, ArrowLeftRight, ScrollText, ListCollapse,
  Film
} from "lucide-react";
import toast from "react-hot-toast";

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

  // Sync user updates in real-time
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

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast.success("Successfully logged out. Goodbye!");
    router.push("/admin");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#82cd2b] border-t-transparent" />
          <p className="text-sm text-gray-400">Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Home Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Hero Section", href: "/admin/dashboard/hero", icon: Home },
    { name: "About Details", href: "/admin/dashboard/about", icon: FolderHeart },
    { name: "Services CRUD", href: "/admin/dashboard/services", icon: Dumbbell },
    { name: "Gallery Stream", href: "/admin/dashboard/gallery", icon: Image },
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

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        className={`hidden lg:flex flex-col bg-[#080808] border-r border-white/5 transition-all duration-300 relative z-25 shrink-0 ${
          isSidebarOpen ? "w-[270px]" : "w-[80px]"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111] border border-white/10 text-[#82cd2b]">
              <Dumbbell className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col select-none">
                <h1 className="text-white text-xs font-black tracking-tighter uppercase leading-none">
                  ZAIN GYM <span className="text-[#82cd2b]">ADMIN</span>
                </h1>
                <span className="text-[8px] text-gray-500 tracking-[1.5px] uppercase mt-0.5">
                  Core Management
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Deck */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${
                  isActive 
                    ? "bg-[#82cd2b] text-black shadow-[0_4px_15px_rgba(130,205,43,0.22)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={item.name}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-black/30">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 active:scale-[0.98] transition-all cursor-pointer ${
              !isSidebarOpen && "justify-center"
            }`}
            title="Log Out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span>LOG OUT</span>}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <aside 
          className={`w-[280px] h-full bg-[#080808] border-r border-white/5 flex flex-col transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] border border-white/10 text-[#82cd2b]">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-xs font-black tracking-tighter uppercase leading-none">
                  ZAIN GYM <span className="text-[#82cd2b]">ADMIN</span>
                </h1>
                <span className="text-[8px] text-gray-500 tracking-[1.5px] uppercase mt-0.5">
                  Core Management
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Deck */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive 
                      ? "bg-[#82cd2b] text-black" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>LOG OUT</span>
            </button>
          </div>
        </aside>
      </div>

      {/* 3. MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-[#080808]/85 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Desktop Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 text-gray-400 hover:text-[#82cd2b] hover:bg-white/5 rounded-lg active:scale-95 transition-all cursor-pointer"
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Mobile Trigger */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-[#82cd2b] hover:bg-white/5 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="h-5 w-[1px] bg-white/10 hidden sm:block" />
            
            {/* Context title */}
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#82cd2b] hidden sm:block">
              {menuItems.find(item => item.href === pathname)?.name || "Control Center"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile widget dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer group hover:opacity-90 focus:outline-none"
              >
                <div className="flex flex-col text-right hidden xs:flex">
                  <span className="text-xs font-bold text-white capitalize group-hover:text-[#82cd2b] transition-colors">{user?.username || "Admin"}</span>
                  <span className="text-[9px] text-[#82cd2b] uppercase tracking-wider font-extrabold">{user?.role || "Console Admin"}</span>
                </div>
                
                <div className="h-10 w-10 rounded-xl overflow-hidden bg-black border border-[#82cd2b]/25 flex items-center justify-center text-black font-black text-sm uppercase shrink-0">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_35%_35%,#82cd2b,rgba(0,0,0,1))] flex items-center justify-center text-black font-black">
                      {user?.username?.substring(0, 2) || "AD"}
                    </div>
                  )}
                </div>
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/5 bg-[#0d0d0d] p-1.5 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      href="/admin/dashboard/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Users className="h-4 w-4 text-[#82cd2b]" />
                      My Profile
                    </Link>
                    <Link 
                      href="/admin/dashboard/admin-settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Settings className="h-4 w-4 text-amber-400" />
                      Settings
                    </Link>
                    <div className="h-[1px] bg-white/5 my-1.5" />
                    <button 
                      onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE SCROLL */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative no-scrollbar">
          {children}
        </main>
      </div>

    </div>
  );
}
