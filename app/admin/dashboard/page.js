"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Image,
  Users,
  MessageSquare,
  PenTool,
  ScrollText,
  Loader2,
  ArrowRight,
  PlusCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [
        resServices,
        resGallery,
        resTeam,
        resTestimonials,
        resBlogs,
        resMessages,
      ] = await Promise.all([
        fetch("/api/services").then((r) => r.json()),
        fetch("/api/gallery").then((r) => r.json()),
        fetch("/api/team").then((r) => r.json()),
        fetch("/api/testimonials").then((r) => r.json()),
        fetch("/api/blogs?all=true").then((r) => r.json()),
        fetch("/api/contact", { headers }).then((r) => r.json()),
      ]);

      const servicesCount = Array.isArray(resServices) ? resServices.length : 0;
      const galleryCount = Array.isArray(resGallery) ? resGallery.length : 0;
      const teamCount = Array.isArray(resTeam) ? resTeam.length : 0;
      const testimonialsCount = Array.isArray(resTestimonials)
        ? resTestimonials.length
        : 0;
      const blogsCount =
        resBlogs && Array.isArray(resBlogs.blogs) ? resBlogs.blogs.length : 0;
      const messagesCount = Array.isArray(resMessages) ? resMessages.length : 0;

      setStats({
        services: servicesCount,
        gallery: galleryCount,
        team: teamCount,
        testimonials: testimonialsCount,
        blogs: blogsCount,
        messages: messagesCount,
      });

      if (Array.isArray(resMessages)) {
        setLatestMessages(resMessages.slice(0, 4));

        const projectGroups = resMessages.reduce((acc, msg) => {
          const type = msg.projectType || "Commercial Gym";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const mappedChart = Object.keys(projectGroups).map((key) => ({
          name: key.replace(" Fitness Space", "").replace(" Gym", ""),
          inquiries: projectGroups[key],
        }));

        setChartData(
          mappedChart.length > 0
            ? mappedChart
            : [
                { name: "Commercial", inquiries: 4 },
                { name: "Private", inquiries: 2 },
                { name: "Corporate", inquiries: 5 },
                { name: "Hotel", inquiries: 1 },
              ]
        );
      }

      if (Array.isArray(resGallery)) {
        setLatestImages(resGallery.slice(0, 6));
      }
    } catch (error) {
      console.error("Dashboard Stats Fetch Error:", error);
      toast.error("Connecting to API failed. Showing fallback data.");

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
    {
      title: "Total Services",
      value: stats.services,
      icon: Dumbbell,
      href: "/admin/dashboard/services",
    },
    {
      title: "Gallery Images",
      value: stats.gallery,
      icon: Image,
      href: "/admin/dashboard/gallery",
    },
    {
      title: "Team Members",
      value: stats.team,
      icon: Users,
      href: "/admin/dashboard/team",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      href: "/admin/dashboard/testimonials",
    },
    {
      title: "Contact Inbox",
      value: stats.messages,
      icon: ScrollText,
      href: "/admin/dashboard/messages",
    },
    {
      title: "Blogs Published",
      value: stats.blogs,
      icon: PenTool,
      href: "/admin/dashboard/blogs",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#D9D9D9]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
            Loading metrics…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 border border-white/10 bg-[#080808] p-6 sm:p-8 md:flex-row md:items-center">
        <div>
          <p className="scene-label mb-3">Control Center</p>
          <h1 className="font-display text-xl font-bold uppercase tracking-[-0.03em] text-[#F5F5F5] sm:text-2xl">
            Dashboard
            <span className="mt-1 block text-sm font-medium tracking-[0.2em] text-[#A0A0A0]">
              Zain Admin
            </span>
          </h1>
          <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-[#A0A0A0]">
            Manage portfolio content, media, and inquiries. Updates sync to the
            live site.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/"
            target="_blank"
            className="btn-silver flex h-11 items-center justify-center px-5 text-[10px]"
          >
            View Live Site
          </Link>
          <button
            type="button"
            onClick={fetchDashboardStats}
            className="btn-silver-fill flex h-11 items-center justify-center px-5 text-[10px]"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group flex items-center justify-between border border-white/10 bg-[#080808] p-5 transition-colors hover:border-[#D9D9D9]/35"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0] transition-colors group-hover:text-[#D9D9D9]">
                  {card.title}
                </span>
                <h3 className="mt-1 font-display text-3xl font-bold tracking-[-0.03em] text-[#F5F5F5]">
                  {card.value}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-[#050505] text-[#D9D9D9]">
                <Icon className="h-5 w-5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col justify-between border border-white/10 bg-[#080808] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
                Inquiry Volumes
              </h3>
              <p className="mt-1 text-[11px] text-[#A0A0A0]">
                Lead project type distribution
              </p>
            </div>
            <span className="border border-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D9D9D9]">
              Inbox Live
            </span>
          </div>

          <div className="h-[280px] w-full text-xs">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.35)" />
                  <YAxis stroke="rgba(255,255,255,0.35)" />
                  <Tooltip
                    contentStyle={{
                      background: "#0D0D0D",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 0,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#D9D9D9", fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="inquiries"
                    fill="#D9D9D9"
                    radius={[0, 0, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-[#666]">
                Mounting chart…
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col border border-white/10 bg-[#080808] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
                Recent Inquiries
              </h3>
              <p className="mt-1 text-[11px] text-[#A0A0A0]">
                Latest contact messages
              </p>
            </div>
            <Link
              href="/admin/dashboard/messages"
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D9D9D9] hover:underline"
            >
              Inbox
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {latestMessages.length > 0 ? (
              latestMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="flex items-start justify-between gap-4 border border-white/8 bg-[#050505] p-3.5 transition-colors hover:border-white/15"
                >
                  <div className="min-w-0">
                    <h4 className="truncate text-xs font-semibold text-[#F5F5F5]">
                      {msg.name}
                    </h4>
                    <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#D9D9D9]">
                      {msg.projectType}
                    </span>
                    <p className="mt-1.5 truncate text-[11px] italic text-[#A0A0A0]">
                      &ldquo;{msg.message}&rdquo;
                    </p>
                  </div>
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      msg.isRead ? "bg-[#444]" : "bg-[#D9D9D9]"
                    }`}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-xs text-[#666]">
                <ShieldCheck className="h-8 w-8 text-[#333]" />
                No inbound queries yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border border-white/10 bg-[#080808] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
              Media Preview
            </h3>
            <p className="mt-1 text-[11px] text-[#A0A0A0]">
              Latest gallery uploads
            </p>
          </div>
          <Link
            href="/admin/dashboard/gallery"
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D9D9D9] hover:underline"
          >
            Gallery
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {latestImages.length > 0 ? (
            latestImages.map((img) => (
              <div
                key={img._id}
                className="group relative aspect-square overflow-hidden border border-white/10 bg-[#050505]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.title || "Gallery"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="w-full truncate text-[9px] font-semibold uppercase tracking-wider text-white">
                    {img.title}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-xs text-[#666]">
              No gallery images yet. Upload from Gallery Stream.
            </div>
          )}
        </div>
      </div>

      <div className="border border-white/10 bg-[#080808] p-6">
        <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/admin/dashboard/services"
            className="flex flex-col items-center gap-2 border border-white/10 bg-[#050505] p-4 text-center transition-colors hover:border-[#D9D9D9]/35"
          >
            <PlusCircle className="h-5 w-5 text-[#D9D9D9]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5F5F5]">
              Add Service
            </span>
          </Link>
          <Link
            href="/admin/dashboard/gallery"
            className="flex flex-col items-center gap-2 border border-white/10 bg-[#050505] p-4 text-center transition-colors hover:border-[#D9D9D9]/35"
          >
            <Image className="h-5 w-5 text-[#D9D9D9]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5F5F5]">
              Upload Media
            </span>
          </Link>
          <Link
            href="/admin/dashboard/blogs"
            className="flex flex-col items-center gap-2 border border-white/10 bg-[#050505] p-4 text-center transition-colors hover:border-[#D9D9D9]/35"
          >
            <PenTool className="h-5 w-5 text-[#D9D9D9]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5F5F5]">
              Write Blog
            </span>
          </Link>
          <Link
            href="/admin/dashboard/settings"
            className="flex flex-col items-center gap-2 border border-white/10 bg-[#050505] p-4 text-center transition-colors hover:border-[#D9D9D9]/35"
          >
            <Settings className="h-5 w-5 text-[#D9D9D9]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5F5F5]">
              Site Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
