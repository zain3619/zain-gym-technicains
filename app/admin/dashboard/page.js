"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Dumbbell, Image, Users, MessageSquare, PenTool, 
  ScrollText, Loader2, ArrowRight, Activity, PlusCircle, 
  Settings, Sparkles, Send, ShieldCheck
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import toast from "react-hot-toast";

export default function DashboardHomePage() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    services: 0,
    gallery: 0,
    team: 0,
    testimonials: 0,
    blogs: 0,
    messages: 0,
  });
  const [latestMessages, setLatestMessages] = useState([]);
  const [latestImages, setLatestImages] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      // Parallel fetch from our Express APIs
      const [resServices, resGallery, resTeam, resTestimonials, resBlogs, resMessages] = await Promise.all([
        fetch("http://localhost:5000/api/v1/services").then(r => r.json()),
        fetch("http://localhost:5000/api/v1/gallery").then(r => r.json()),
        fetch("http://localhost:5000/api/v1/team").then(r => r.json()),
        fetch("http://localhost:5000/api/v1/testimonials").then(r => r.json()),
        fetch("http://localhost:5000/api/v1/blogs?all=true").then(r => r.json()),
        fetch("http://localhost:5000/api/v1/messages", { headers }).then(r => r.json()),
      ]);

      const servicesCount = Array.isArray(resServices) ? resServices.length : 0;
      const galleryCount = Array.isArray(resGallery) ? resGallery.length : 0;
      const teamCount = Array.isArray(resTeam) ? resTeam.length : 0;
      const testimonialsCount = Array.isArray(resTestimonials) ? resTestimonials.length : 0;
      const blogsCount = resBlogs && Array.isArray(resBlogs.blogs) ? resBlogs.blogs.length : 0;
      const messagesCount = Array.isArray(resMessages) ? resMessages.length : 0;

      setStats({
        services: servicesCount,
        gallery: galleryCount,
        team: teamCount,
        testimonials: testimonialsCount,
        blogs: blogsCount,
        messages: messagesCount,
      });

      // Save latest messages and images
      if (Array.isArray(resMessages)) {
        setLatestMessages(resMessages.slice(0, 4));
        
        // Populate chart data (Group inquiries by date or project type)
        const projectGroups = resMessages.reduce((acc, msg) => {
          const type = msg.projectType || "Commercial Gym";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const mappedChart = Object.keys(projectGroups).map(key => ({
          name: key.replace(" Fitness Space", "").replace(" Gym", ""),
          inquiries: projectGroups[key]
        }));
        
        setChartData(mappedChart.length > 0 ? mappedChart : [
          { name: "Commercial", inquiries: 4 },
          { name: "Private", inquiries: 2 },
          { name: "Corporate", inquiries: 5 },
          { name: "Hotel", inquiries: 1 },
        ]);
      }

      if (Array.isArray(resGallery)) {
        setLatestImages(resGallery.slice(0, 6));
      }

    } catch (error) {
      console.error("Dashboard Stats Fetch Error:", error);
      toast.error("Connecting to local API server failed. Render fallback data.");
      
      // Seed default dashboard fallbacks in case server isn't run yet
      setStats({
        services: 4,
        gallery: 32,
        team: 5,
        testimonials: 10,
        blogs: 3,
        messages: 8,
      });
      setChartData([
        { name: "Commercial", inquiries: 3 },
        { name: "Private", inquiries: 1 },
        { name: "Corporate", inquiries: 4 },
        { name: "Hotel", inquiries: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Services", value: stats.services, icon: Dumbbell, color: "text-[#82cd2b]", bg: "bg-[#82cd2b]/5", border: "border-[#82cd2b]/15", href: "/admin/dashboard/services" },
    { title: "Gallery Images", value: stats.gallery, icon: Image, color: "text-blue-400", bg: "bg-blue-400/5", border: "border-blue-400/15", href: "/admin/dashboard/gallery" },
    { title: "Team Members", value: stats.team, icon: Users, color: "text-purple-400", bg: "bg-purple-400/5", border: "border-purple-400/15", href: "/admin/dashboard/team" },
    { title: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/15", href: "/admin/dashboard/testimonials" },
    { title: "Contact Inbox", value: stats.messages, icon: ScrollText, color: "text-rose-400", bg: "bg-rose-400/5", border: "border-rose-400/15", href: "/admin/dashboard/messages" },
    { title: "Blogs Published", value: stats.blogs, icon: PenTool, color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/15", href: "/admin/dashboard/blogs" },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#82cd2b]" />
          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Loading console metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-white/5 bg-[linear-gradient(135deg,#0d0d0d_0%,#050505_100%)] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
            Dashboard Welcome, <span className="text-[#82cd2b]">Zain Admin</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-[520px]">
            Fully control, structure, and direct your gym portfolio application dynamically. All updates sync instantly to search engines and users.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href="/" target="_blank" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-black px-4.5 text-xs font-bold uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all">
            View Live Site
          </Link>
          <button onClick={fetchDashboardStats} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#82cd2b] text-black px-4.5 text-xs font-black uppercase tracking-wider hover:bg-[#97ff02] active:scale-95 transition-all cursor-pointer">
            Refresh Core
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.title} 
              href={card.href}
              className={`rounded-2xl border ${card.border} ${card.bg} p-6 flex items-center justify-between group hover:scale-[1.01] hover:border-[#82cd2b]/40 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.15)]`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">
                  {card.title}
                </span>
                <h3 className="text-3xl font-black text-white mt-1 group-hover:text-[#82cd2b] transition-colors">
                  {card.value}
                </h3>
              </div>
              <div className={`h-14 w-14 rounded-xl bg-black border border-white/10 flex items-center justify-center ${card.color} shadow-lg group-hover:scale-105 transition-all`}>
                <Icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Graph & Activities Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        
        {/* Recharts Analytics Panel */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl flex flex-col justify-between">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Inquiry Volumes</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Distribution of lead project types</p>
            </div>
            <span className="text-[10px] bg-[#82cd2b]/10 text-[#82cd2b] border border-[#82cd2b]/20 px-2 py-0.5 rounded-full font-bold uppercase">
              Inbox Live
            </span>
          </div>

          <div className="h-[280px] w-full text-xs">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip 
                    contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#82cd2b", fontWeight: "bold" }}
                  />
                  <Bar dataKey="inquiries" fill="#82cd2b" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-600">Mounting chart nodes...</div>
            )}
          </div>
        </div>

        {/* Dynamic Inbox Messages */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl flex flex-col justify-between">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Recent Inquiries</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Quick lookup of prospective clients</p>
            </div>
            <Link href="/admin/dashboard/messages" className="text-[11px] text-[#82cd2b] font-bold hover:underline flex items-center gap-1 uppercase tracking-wider">
              Inbox
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3.5 flex-1 justify-start">
            {latestMessages.length > 0 ? (
              latestMessages.map((msg) => (
                <div key={msg._id} className="p-3.5 rounded-xl border border-white/5 bg-black/45 hover:border-white/10 transition-all flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{msg.name}</h4>
                    <span className="text-[9px] text-[#82cd2b] font-extrabold uppercase mt-0.5 block">{msg.projectType}</span>
                    <p className="text-[11px] text-gray-400 truncate mt-1.5 italic">&ldquo;{msg.message}&rdquo;</p>
                  </div>
                  <span className={`h-2 w-2 rounded-full mt-1 shrink-0 ${msg.isRead ? "bg-gray-600" : "bg-[#82cd2b]"}`} />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-600 text-xs flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="h-8 w-8 text-gray-700" />
                No inbound project queries yet. Fallback to mock inbox logs.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Latest Media Center Uploads */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Media Stream Preview</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Latest images added to the gym layout gallery</p>
          </div>
          <Link href="/admin/dashboard/gallery" className="text-[11px] text-[#82cd2b] font-bold hover:underline flex items-center gap-1 uppercase tracking-wider">
            Gallery
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {latestImages.length > 0 ? (
            latestImages.map((img) => (
              <div key={img._id} className="relative aspect-square rounded-xl overflow-hidden bg-black border border-white/5 group hover:border-[#82cd2b]/30 transition-all duration-300">
                <img 
                  src={img.imageUrl} 
                  alt={img.title || "Gallery"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 p-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-85 transition-opacity flex items-end p-2 pb-3">
                  <span className="text-[9px] font-bold text-white truncate w-full uppercase">{img.title}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-600 text-xs">
              No gallery images found. Upload dynamic machines/equipment images inside Gallery Stream!
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d0d] p-6 shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Admin Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/admin/dashboard/services" className="p-4 rounded-xl border border-white/5 bg-black/45 hover:border-[#82cd2b]/30 hover:scale-[1.01] transition-all flex flex-col items-center text-center gap-2">
            <PlusCircle className="h-5 w-5 text-[#82cd2b]" />
            <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Add Service</span>
          </Link>
          <Link href="/admin/dashboard/gallery" className="p-4 rounded-xl border border-white/5 bg-black/45 hover:border-blue-400/30 hover:scale-[1.01] transition-all flex flex-col items-center text-center gap-2">
            <Image className="h-5 w-5 text-blue-400" />
            <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Upload Media</span>
          </Link>
          <Link href="/admin/dashboard/blogs" className="p-4 rounded-xl border border-white/5 bg-black/45 hover:border-emerald-400/30 hover:scale-[1.01] transition-all flex flex-col items-center text-center gap-2">
            <PenTool className="h-5 w-5 text-emerald-400" />
            <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Write Blog</span>
          </Link>
          <Link href="/admin/dashboard/settings" className="p-4 rounded-xl border border-white/5 bg-black/45 hover:border-amber-400/30 hover:scale-[1.01] transition-all flex flex-col items-center text-center gap-2">
            <Settings className="h-5 w-5 text-amber-400" />
            <span className="text-[10px] font-extrabold uppercase text-white tracking-wider">Site Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
