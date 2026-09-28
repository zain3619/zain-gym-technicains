"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./ui/MagneticButton";
import StackPanel from "./ui/StackPanel";
import PanelSkeleton from "./ui/PanelSkeleton";
import { COMPANY_NAME } from "../lib/seo";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_DATA = {
  subheading: "Gym Designers and Builders",
  heading: "Complete Gym Setup",
  subheading2: "From Design to Equipment Supply",
  description:
    "Gym setup services, fitness equipment supply, trainers, and full support all in one place.",
  backgroundImage: "/gym-hero-bg.mp4",
  ctaText1: "GET STARTED",
  ctaLink1: "/contact",
  ctaText2: "CONTACT US",
  ctaLink2: "/contact",
};

function isVideoUrl(url = "") {
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    url.includes("video/upload")
  );
}

function localWebmFrom(url = "") {
  if (url === "/gym-hero-bg.mp4" || url.endsWith("/gym-hero-bg.mp4")) {
    return "/gym-hero-bg.webm";
  }
  return null;
}

export default function Hero() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [data, setData] = useState(DEFAULT_DATA);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch("/api/sections/hero");
        if (!response.ok) return;
        const resData = await response.json();
        if (!resData) return;

        const bg =
          resData.backgroundImage &&
          !String(resData.backgroundImage).includes("hero-gym.png") &&
          !String(resData.backgroundImage).includes("hero-gym.webp")
            ? resData.backgroundImage
            : DEFAULT_DATA.backgroundImage;

        setData({
          subheading: resData.subheading || DEFAULT_DATA.subheading,
          heading: resData.heading || DEFAULT_DATA.heading,
          subheading2: resData.subheading2 || DEFAULT_DATA.subheading2,
          description: resData.description || DEFAULT_DATA.description,
          backgroundImage: bg,
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
    setMediaReady(false);
    const video = videoRef.current;
    if (!video || !isVideoUrl(data.backgroundImage)) {
      setMediaReady(true);
      return undefined;
    }

    const markReady = () => {
      setMediaReady(true);
      video.play?.().catch(() => {});
    };

    if (video.readyState >= 3) markReady();
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", markReady);

    try {
      video.load();
    } catch {
      // ignore
    }

    // Safety: never leave skeleton forever
    const failSafe = window.setTimeout(() => setMediaReady(true), 6000);

    return () => {
      window.clearTimeout(failSafe);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("playing", markReady);
    };
  }, [data.backgroundImage]);

  useEffect(() => {
    if (!mediaReady) return undefined;

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
        .fromTo(
          mediaRef.current,
          { scale: 1, yPercent: 0 },
          { scale: 1.1, yPercent: 5, ease: "none" },
          0
        )
        .fromTo(
          contentRef.current,
          { y: 0, opacity: 1 },
          { y: -50, opacity: 0.25, ease: "none" },
          0
        );
    }, section);

    return () => ctx.revert();
  }, [data.backgroundImage, mediaReady]);

  const useVideo = isVideoUrl(data.backgroundImage);
  const webm = localWebmFrom(data.backgroundImage);

  return (
    <StackPanel id="home" z={1} className="bg-[#050505]">
      <div ref={sectionRef} className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden bg-[#050505]">
          <div ref={mediaRef} className="absolute inset-0 will-change-transform">
            {useVideo ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  mediaReady ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={data.backgroundImage} type="video/mp4" />
                {webm ? <source src={webm} type="video/webm" /> : null}
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.backgroundImage}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  mediaReady ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setMediaReady(true)}
              />
            )}
          </div>
          <div className="cinema-overlay" />
          <div className="vignette-overlay" />
          <div className="grain-overlay" />
        </div>

        {!mediaReady ? <PanelSkeleton variant="hero" /> : null}

        <div
          ref={contentRef}
          className="panel-copy panel-copy--center will-change-transform"
          style={{ opacity: mediaReady ? undefined : 0 }}
        >
          <div className="max-w-5xl">
            <p className="scene-label mb-4 md:mb-8">
              {COMPANY_NAME} · {data.subheading}
            </p>
            <h1 className="hero-title display-xl text-[clamp(2.4rem,8vw,9.5rem)] text-[#F5F5F5]">
              {data.heading}
            </h1>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(0.95rem,2.8vw,2.4rem)] font-semibold uppercase tracking-[0.04em] text-[#D9D9D9] md:mt-6">
              {data.subheading2}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#A0A0A0] md:mt-8 md:text-base">
              {data.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-12 md:justify-start md:gap-4">
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

        <div
          className={`absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-500 md:flex ${
            mediaReady ? "opacity-100" : "opacity-0"
          }`}
        >
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
