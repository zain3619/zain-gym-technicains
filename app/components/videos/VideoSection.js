"use client";

import React, { useEffect, useState } from "react";
import VideoCarousel from "./VideoCarousel";
import StackPanel from "../ui/StackPanel";

const VIDEO_Z = 55;

export default function VideoSection() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setVideos(data);
      } catch {
        // hide section when unavailable
      }
    }
    loadVideos();
  }, []);

  if (!videos || videos.length === 0) return null;

  return (
    <StackPanel id="videos" z={VIDEO_Z} className="bg-[#070707]">
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-4 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mb-8 max-w-3xl md:mb-12">
          <p className="scene-label mb-3 md:mb-4">Video</p>
          <h2 className="display-xl text-[clamp(1.75rem,5vw,4.5rem)] text-[#F5F5F5]">
            Watch Our Gym In Action
          </h2>
        </div>
        <VideoCarousel videos={videos} />
      </div>
    </StackPanel>
  );
}
