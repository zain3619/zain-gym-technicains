"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function VideoCarousel({ videos }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth automatic slider interval: advances active card every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, isTransitioning]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (!videos || videos.length === 0) return null;

  // Clone array if fewer than 5 videos to ensure our 3D layout functions correctly
  let displayVideos = [...videos];
  if (videos.length > 0 && videos.length < 5) {
    while (displayVideos.length < 5) {
      displayVideos = [...displayVideos, ...videos];
    }
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 md:px-4 py-8 select-none">
      
      {/* 3D Video Carousel Stage */}
      <div className="relative h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {displayVideos.map((video, idx) => {
          const total = displayVideos.length;
          let diff = (idx - activeIndex) % total;
          if (diff < -Math.floor(total / 2)) diff += total;
          if (diff > Math.floor(total / 2)) diff -= total;

          const isActive = diff === 0;
          const isLeft1 = diff === -1;
          const isLeft2 = diff === -2;
          const isRight1 = diff === 1;
          const isRight2 = diff === 2;
          const isVisible = isActive || isLeft1 || isLeft2 || isRight1 || isRight2;

          if (!isVisible) return null;

          // Responsive 3D transform styles to prevent cards from clipping outside boundaries
          let transformStyles = "";
          let responsiveVisibility = "block";

          if (isActive) {
            transformStyles = "translate-x-0 scale-100 z-30 opacity-100 pointer-events-auto";
          } else if (isLeft1) {
            transformStyles = "-translate-x-[28%] md:-translate-x-[24%] lg:-translate-x-[20%] -rotate-2 scale-[0.88] z-20 opacity-70 pointer-events-auto";
          } else if (isLeft2) {
            transformStyles = "-translate-x-[56%] md:-translate-x-[48%] lg:-translate-x-[40%] -rotate-6 scale-[0.75] z-10 opacity-30 pointer-events-none";
            responsiveVisibility = "hidden md:block"; // Hide second layer on mobile to fit the viewport perfectly
          } else if (isRight1) {
            transformStyles = "translate-x-[28%] md:translate-x-[24%] lg:translate-x-[20%] rotate-2 scale-[0.88] z-20 opacity-70 pointer-events-auto";
          } else if (isRight2) {
            transformStyles = "translate-x-[56%] md:translate-x-[48%] lg:translate-x-[40%] rotate-6 scale-[0.75] z-10 opacity-30 pointer-events-none";
            responsiveVisibility = "hidden md:block"; // Hide second layer on mobile to fit the viewport perfectly
          }

          return (
            <div
              key={`${video._id || video.id}-${idx}`}
              onClick={() => !isActive && handleDotClick(idx)}
              className={`absolute w-[260px] sm:w-[300px] md:w-[350px] lg:w-[390px] h-[340px] md:h-[420px] rounded-3xl overflow-hidden bg-[#0d0d0d] border border-white/5 shadow-2xl transition-all duration-500 ease-out cursor-pointer ${transformStyles} ${responsiveVisibility}`}
              style={{
                boxShadow: isActive ? "0 20px 40px -10px rgba(130, 205, 43, 0.12), 0 0 30px rgba(130, 205, 43, 0.04)" : "none",
              }}
            >
              {/* Media Container: Live video for active center, static poster for side cards */}
              <div className="relative h-2/3 w-full bg-black overflow-hidden">
                {isActive ? (
                  <video
                    src={video.videoUrl}
                    poster={video.thumbnailUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={video.thumbnailUrl || "/hero-gym.png"}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                
                {/* Visual Glass gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/20 to-black/40 z-10 pointer-events-none"></div>

                {/* upper tag */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="flex items-center gap-1 text-[8px] font-black tracking-widest text-[#82cd2b] bg-[#82cd2b]/10 border border-[#82cd2b]/30 px-2.5 py-1 rounded-full uppercase">
                    <Sparkles className="h-2.5 w-2.5" /> HD TRAINING
                  </span>
                </div>
              </div>

              {/* Video Title Block */}
              <div className="p-4 md:p-5 flex flex-col justify-center h-1/3 border-t border-white/5 bg-[#0e0e0e]">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#82cd2b] mb-1 block">
                  Active Member Session
                </span>
                <h4 className="text-xs md:text-sm font-black text-white group-hover:text-[#82cd2b] transition-colors line-clamp-2 leading-snug uppercase tracking-tight">
                  {video.title}
                </h4>
              </div>

            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4 max-w-sm mx-auto px-4">
        <button
          onClick={handlePrev}
          className="p-2.5 rounded-full border border-white/10 hover:border-[#82cd2b]/40 bg-black/40 hover:bg-[#82cd2b] text-white hover:text-black transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {videos.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => handleDotClick(dotIdx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === activeIndex ? "w-5 bg-[#82cd2b]" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2.5 rounded-full border border-white/10 hover:border-[#82cd2b]/40 bg-black/40 hover:bg-[#82cd2b] text-white hover:text-black transition-all cursor-pointer active:scale-95"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
}
