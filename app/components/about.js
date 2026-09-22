"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_DATA = {
  title: "About Us",
  heading: "We Build More Than Gyms \n We Build Experiences.",
  description:
    "From concept to completion, we deliver gym design, gym building, gym setup services, top-tier fitness equipment, and expert support. Our mission is to build powerful fitness environments that drive performance and lasting results.",
  experienceYears: "14+",
  gymsSetup: "30+",
  satisfactionRate: "100%",
  showcaseImage: "/about-team.png",
};

export default function About() {
  const sectionRef = useRef(null);
  const imageWrapRef = useRef(null);
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/sections/about");
        if (!response.ok) return;
        const resData = await response.json();
        if (!resData) return;
        setData({
          title: "About Us",
          heading: resData.title || DEFAULT_DATA.heading,
          description: resData.description || DEFAULT_DATA.description,
          experienceYears: resData.experienceYears
            ? `${resData.experienceYears}+`
            : "14+",
          gymsSetup: resData.gymsBuilt ? `${resData.gymsBuilt}+` : "30+",
          satisfactionRate: resData.clientSatisfaction || "100%",
          showcaseImage: resData.imageUrl || "/about-team.png",
        });
      } catch {
        // keep defaults
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      gsap.fromTo(
        imageWrapRef.current,
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.35,
          },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const headingLines = String(data.heading)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const stats = [
    { value: data.experienceYears, label: "Years Experience" },
    { value: data.gymsSetup, label: "Gyms Built" },
    { value: data.satisfactionRate, label: "Client Satisfaction" },
  ];

  return (
    <StackPanel id="about" z={2} className="bg-[#050505] scroll-mt-24">
      <div ref={sectionRef} className="absolute inset-0">
        <div className="absolute inset-0">
          <div ref={imageWrapRef} className="absolute inset-0 will-change-transform">
            <MediaImage
              src={data.showcaseImage}
              alt="About Zain Gym Technicians"
              fill
              sizes="100vw"
              className="object-cover"
              fallback="/about-team.png"
            />
          </div>
          <div className="absolute inset-0 bg-[#050505]/72" />
          <div className="vignette-overlay" />
          <div className="grain-overlay" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <p className="scene-label mb-6">01 — {data.title}</p>
          <div className="max-w-5xl">
            {headingLines.map((line, lineIndex) => (
              <h2
                key={lineIndex}
                className="display-xl text-[clamp(2.4rem,7vw,6.5rem)] text-[#F5F5F5]"
              >
                {line}
              </h2>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-[#D8D8D8] md:mt-10 md:text-base">
            {data.description}
          </p>
          <div className="mt-12 grid max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-8 md:mt-16 md:gap-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold tracking-tight text-[#D9D9D9] md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StackPanel>
  );
}
