"use client";

import React, { useState, useEffect } from "react";
import { Film } from "lucide-react";
import VideoCarousel from "./VideoCarousel";

export default function VideoSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-[#070707] py-24 border-t border-white/5 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-6 w-32 bg-white/5 rounded"></div>
          <div className="h-10 w-64 bg-white/5 rounded"></div>
          <div className="h-[350px] w-[320px] sm:w-[480px] md:w-[640px] bg-white/5 rounded-3xl mt-8"></div>
        </div>
      </section>
    );
  }

  // If there are no active videos, gracefully hide the section to avoid blank spots
  if (!videos || videos.length === 0) return null;

  return (
    <section id="videos" className="relative bg-[#070707] py-24 border-t border-white/5 overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#82cd2b]/5 blur-[120px] pointer-events-none z-0"></div>

      <div className="container relative mx-auto px-4 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.25em] text-[#82cd2b] mb-3 bg-[#82cd2b]/5 border border-[#82cd2b]/15 px-3 py-1 rounded-full">
            <Film className="h-3 w-3" /> VIDEO SECTION
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight leading-none mt-2">
            Watch Our Gym <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">In Action</span>
          </h2>
          <div className="h-1 w-20 bg-[#82cd2b] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Dynamic Video Carousel */}
        <VideoCarousel videos={videos} />

      </div>
    </section>
  );
}
