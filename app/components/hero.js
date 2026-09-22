"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./ui/MagneticButton";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";
import { COMPANY_NAME } from "../lib/seo";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_DATA = {
  subheading: "Gym Designers and Builders",
  heading: "Complete Gym Setup",
  subheading2: "From Design to Equipment Supply",
  description:
    "Gym setup services, fitness equipment supply, trainers, and full support all in one place.",
  backgroundImage: "/hero-gym.png",
  ctaText1: "GET STARTED",
  ctaLink1: "/contact",
  ctaText2: "CONTACT US",
  ctaLink2: "/contact",
};

export default function Hero() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const contentRef = useRef(null);
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch("/api/sections/hero");
        if (!response.ok) return;
        const resData = await response.json();
        if (!resData) return;
        setData({
          subheading: resData.subheading || DEFAULT_DATA.subheading,
          heading: resData.heading || DEFAULT_DATA.heading,
          subheading2: resData.subheading2 || DEFAULT_DATA.subheading2,
          description: resData.description || DEFAULT_DATA.description,
          backgroundImage:
            resData.backgroundImage || DEFAULT_DATA.backgroundImage,
          ctaText1: resData.ctaText1 || DEFAULT_DATA.ctaText1,
          ctaLink1: resData.ctaLink1 || DEFAULT_DATA.ctaLink1,
          ctaText2: resData.ctaText2 || DEFAULT_DATA.ctaText2,
          ctaLink2: resData.ctaLink2 || DEFAULT_DATA.ctaLink2,
        });
      } catch {
        // keep defaults
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.3,
          },
        })
        .to(mediaRef.current, { scale: 1.1, yPercent: 5, ease: "none" }, 0)
        .to(contentRef.current, { y: -50, opacity: 0.25, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, [data.backgroundImage]);

  const isVideo =
    data.backgroundImage &&
    (data.backgroundImage.endsWith(".mp4") ||
      data.backgroundImage.endsWith(".webm") ||
      data.backgroundImage.includes("video/upload"));

  return (
    <StackPanel id="home" z={1} className="bg-[#050505]">
      <div ref={sectionRef} className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <div ref={mediaRef} className="absolute inset-0 will-change-transform">
            {isVideo ? (
              <video
                src={data.backgroundImage}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <MediaImage
                src={data.backgroundImage}
                alt={`${COMPANY_NAME} — ${data.heading}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                fallback="/hero-gym.png"
              />
            )}
          </div>
          <div className="cinema-overlay" />
          <div className="vignette-overlay" />
          <div className="grain-overlay" />
        </div>

        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 pt-28 will-change-transform md:justify-center md:px-10 md:pb-20 lg:px-14"
        >
          <div className="max-w-5xl">
            <p className="scene-label mb-6 md:mb-8">
              {COMPANY_NAME} · {data.subheading}
            </p>
            <h1 className="display-xl text-[clamp(3.2rem,12vw,9.5rem)] text-[#F5F5F5]">
              {data.heading}
            </h1>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.1rem,3.2vw,2.4rem)] font-semibold uppercase tracking-[0.04em] text-[#D9D9D9] md:mt-6">
              {data.subheading2}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#A0A0A0] md:mt-8 md:text-base">
              {data.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 md:mt-12">
              <MagneticButton
                href={data.ctaLink1}
                className="btn-silver-fill"
                data-cursor="EXPLORE"
              >
                {data.ctaText1}
              </MagneticButton>
              <MagneticButton
                href={data.ctaLink2}
                className="btn-silver"
                data-cursor="OPEN"
              >
                {data.ctaText2}
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#A0A0A0]">
            Scroll
          </span>
          <span className="h-10 w-px overflow-hidden bg-white/15">
            <span className="block h-full w-full origin-top animate-[scrollLine_1.6s_ease-in-out_infinite] bg-[#D9D9D9]" />
          </span>
        </div>
      </div>
    </StackPanel>
  );
}
