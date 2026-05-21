"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    subheading: "Gym Designers and Builders",
    heading: "Complete Gym Setup",
    subheading2: "From Design to Equipment Supply",
    description: "Gym setup services, fitness equipment supply, trainers, and full support all in one place.",
    backgroundImage: "/hero-gym.png",
    ctaText1: "GET STARTED",
    ctaLink1: "/contact",
    ctaText2: "CONTACT US",
    ctaLink2: "/contact"
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch("/api/sections/hero");
        if (response.ok) {
          const resData = await response.json();
          if (resData) {
            setData({
              subheading: resData.subheading || "Gym Designers and Builders",
              heading: resData.heading || "Complete Gym Setup",
              subheading2: resData.subheading2 || "From Design to Equipment Supply",
              description: resData.description || "Gym setup services, fitness equipment supply, trainers, and full support all in one place.",
              backgroundImage: resData.backgroundImage || "/hero-gym.png",
              ctaText1: resData.ctaText1 || "GET STARTED",
              ctaLink1: resData.ctaLink1 || "/contact",
              ctaText2: resData.ctaText2 || "CONTACT US",
              ctaLink2: resData.ctaLink2 || "/contact"
            });
          }
        }
      } catch (error) {
        console.log("Failed to fetch Hero settings, using fallback static data.");
      } finally {
        // Subtle delay to feel premium
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="relative flex min-h-screen w-full items-center justify-center bg-black overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl px-5 text-center sm:px-6 w-full flex flex-col items-center">
          {/* Subheading Pulsing */}
          <div className="mb-4 h-6 w-48 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
          {/* Heading Pulsing */}
          <div className="mb-3 h-14 w-80 sm:w-[500px] rounded bg-neutral-900/80 animate-pulse border border-white/5" />
          {/* Subheading2 Pulsing */}
          <div className="mb-6 h-8 w-60 sm:w-[350px] rounded bg-neutral-900/80 animate-pulse border border-white/5" />
          {/* Description Pulsing */}
          <div className="mb-10 h-16 w-72 sm:w-[550px] rounded bg-neutral-900/80 animate-pulse border border-white/5" />
          {/* Buttons Pulsing */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <div className="h-12 w-52 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
            <div className="h-12 w-52 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Background Image or Video with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {data.backgroundImage && (data.backgroundImage.endsWith(".mp4") || data.backgroundImage.endsWith(".webm") || data.backgroundImage.includes("video/upload")) ? (
          <video
            src={data.backgroundImage}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${data.backgroundImage}')`,
            }}
          />
        )}
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 text-center sm:px-6">
        
        {/* Sub-heading: Small on mobile, Medium on Desktop */}
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gym-green sm:mb-4 sm:text-sm md:text-lg md:tracking-[5px]">
          {data.subheading}
        </h3>
        
        {/* Main Heading: Scaled from 4xl to 8xl */}
        <h1 className="mb-2 text-3xl font-black uppercase leading-[1] tracking-[-0.05em] text-white sm:text-5xl md:text-7xl lg:text-8xl">
          {data.heading}
        </h1>
        
        {/* Secondary Heading: Scaled from lg to 4xl */}
        <h2 className="mb-4 text-base font-bold uppercase tracking-[0.08em] text-gym-green sm:mb-6 sm:text-xl md:text-3xl lg:text-4xl">
          {data.subheading2}
        </h2>

        {/* Description: Hidden or smaller on very small screens to keep UI clean */}
        <p className="mx-auto mb-8 max-w-[20rem] text-sm leading-relaxed text-gray-200 sm:mb-10 sm:max-w-2xl sm:text-base md:text-lg lg:text-xl">
          {data.description}
        </p>

        {/* Buttons: Stacked on Mobile, Row on Desktop */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href={data.ctaLink1}
            className="btn-hover-fill btn-fill-white-shift w-full max-w-[220px] rounded-md bg-gym-green px-6 py-3 text-center text-xs font-extrabold tracking-[0.18em] text-black active:scale-[0.98] sm:w-52 sm:px-8 sm:py-3.5 sm:text-sm md:w-56 md:px-10 md:py-4 md:text-base md:tracking-widest"
          >
            {data.ctaText1}
          </Link>
          <Link
            href={data.ctaLink2}
            className="btn-hover-outline btn-outline-white-fill w-full max-w-[220px] rounded-md border-2 border-white px-6 py-3 text-center text-xs font-extrabold tracking-[0.18em] text-white active:scale-[0.98] sm:w-52 sm:px-8 sm:py-3.5 sm:text-sm md:w-56 md:px-10 md:py-4 md:text-base md:tracking-widest"
          >
            {data.ctaText2}
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gym-green rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
