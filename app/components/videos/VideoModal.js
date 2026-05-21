"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function VideoModal({ isOpen, onClose, videoUrl, videoTitle }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in transition-all duration-300">
      {/* Click Outside to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl aspect-video rounded-3xl bg-[#090909] border border-white/10 overflow-hidden shadow-2xl z-10 transition-transform duration-300 scale-100">
        
        {/* Header Overlay (visible on hover) */}
        <div className="absolute top-0 inset-x-0 p-5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            {videoTitle || "Zain Gym Training"}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-[#82cd2b] text-white hover:text-black transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Element */}
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
