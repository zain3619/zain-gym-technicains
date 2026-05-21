"use client";

import React, { useState, useEffect } from 'react';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    title: "About Us",
    heading: "We Build More Than Gyms \n We Build Experiences.",
    description: "From concept to completion, we deliver gym design, gym building, gym setup services, top-tier fitness equipment, and expert support. Our mission is to build powerful fitness environments that drive performance and lasting results.",
    experienceYears: "14+",
    gymsSetup: "30+",
    satisfactionRate: "100%",
    showcaseImage: "/about-team.png"
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/sections/about");
        if (response.ok) {
          const resData = await response.json();
          if (resData) {
            setData({
              title: "About Us",
              heading: resData.title || "We Build More Than Gyms \n We Build Experiences.",
              description: resData.description || "From concept to completion, we deliver gym design, gym building, gym setup services, top-tier fitness equipment, and expert support. Our mission is to build powerful fitness environments that drive performance and lasting results.",
              experienceYears: resData.experienceYears ? `${resData.experienceYears}+` : "14+",
              gymsSetup: resData.gymsBuilt ? `${resData.gymsBuilt}+` : "30+",
              satisfactionRate: resData.clientSatisfaction || "100%",
              showcaseImage: resData.imageUrl || "/about-team.png"
            });
          }
        }
      } catch (error) {
        console.log("Failed to fetch About settings, using fallback static data.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section className="bg-black py-30 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 flex flex-col">
            <div className="h-6 w-32 rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-4" />
            <div className="h-10 w-full max-w-[400px] rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-2" />
            <div className="h-10 w-full max-w-[300px] rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-6" />
            <div className="h-24 w-full rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-10" />
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="h-12 w-full rounded bg-neutral-900/80 animate-pulse border border-white/5" />
              <div className="h-12 w-full rounded bg-neutral-900/80 animate-pulse border border-white/5" />
              <div className="h-12 w-full rounded bg-neutral-900/80 animate-pulse border border-white/5" />
            </div>
          </div>
          {/* Right Side: Image Placeholder */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative aspect-video w-full rounded bg-neutral-900/80 animate-pulse border border-white/5 min-h-[300px]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="bg-black py-30 px-6 md:px-12 lg:px-24 scroll-mt-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">
            {data.title}
          </h3>
          <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-6 whitespace-pre-line">
            {data.heading}
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
            {data.description}
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-gym-green text-2xl md:text-4xl font-black">
                {data.experienceYears}
              </h4>
              <p className="text-white text-[10px] md:text-xs uppercase tracking-wider mt-1">
                Years Experience
              </p>
            </div>
            <div>
              <h4 className="text-gym-green text-2xl md:text-4xl font-black">
                {data.gymsSetup}
              </h4>
              <p className="text-white text-[10px] md:text-xs uppercase tracking-wider mt-1">
                Gyms Built
              </p>
            </div>
            <div>
              <h4 className="text-gym-green text-2xl md:text-4xl font-black">
                {data.satisfactionRate}
              </h4>
              <p className="text-white text-[10px] md:text-xs uppercase tracking-wider mt-1">
                Client Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image with Design Element */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <div className="relative group">
            {/* Green Border Offset */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gym-green z-0"></div>

            {/* Main Image */}
            <div className="relative z-10 overflow-hidden">
              <img
                src={data.showcaseImage}
                alt="Gym design and setup by Zain Gym Technicians"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
