"use client";

import React, { useEffect, useState } from "react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

/** Unique program banners — not reused by hero/about/contact/equipment gallery */
const PROGRAM_BANNERS = [
  "/equipment-strength-1.webp",
  "/equipment-strength-2.webp",
  "/equipment-strength-3.webp",
  "/equipment-strength-4.webp",
];

const SERVICES_INTRO = "/services-intro.webp";

const FALLBACK_SERVICES = [
  {
    title: "Gym Design & Planning",
    desc: "Innovative layouts and 3D designs customized to your space, goals, and budget.",
    banner: PROGRAM_BANNERS[0],
  },
  {
    title: "Fitness Equipment Supply",
    desc: "High-quality cardio, strength, and functional training equipment for commercial and private gyms.",
    banner: PROGRAM_BANNERS[1],
  },
  {
    title: "Trainers & Staff",
    desc: "Certified trainers and staff to manage and grow your gym efficiently.",
    banner: PROGRAM_BANNERS[2],
  },
  {
    title: "Maintenance & Support",
    desc: "Ongoing maintenance and technical support to keep your gym running smoothly.",
    banner: PROGRAM_BANNERS[3],
  },
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) return;
        const resData = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setServices(
            resData.map((s, i) => ({
              title: s.title,
              desc: s.description,
              banner:
                s.imageUrl ||
                PROGRAM_BANNERS[i % PROGRAM_BANNERS.length] ||
                PROGRAM_BANNERS[0],
            }))
          );
        }
      } catch {
        // keep fallbacks
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <StackPanel id="services" z={3} className="bg-[#080808] scroll-mt-24">
        <div className="absolute inset-0">
          <MediaImage
            src={SERVICES_INTRO}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
            fallback={SERVICES_INTRO}
          />
          <div className="absolute inset-0 bg-[#080808]/72" />
          <div className="cinema-overlay" />
          <div className="grain-overlay hidden lg:block" />
        </div>
        <div className="panel-copy panel-copy--center">
          <p className="scene-label mb-3 md:mb-4">02 — Services</p>
          <h2 className="display-xl max-w-4xl text-[clamp(1.75rem,5vw,5.5rem)] text-[#F5F5F5]">
            Complete Gym Design and Setup Solutions
          </h2>
        </div>
      </StackPanel>

      {services.map((service, index) => (
        <StackPanel
          key={`${service.title}-${index}`}
          z={4 + index}
          className="border-t border-white/8 bg-[#0A0A0A]"
        >
          <div className="absolute inset-0">
            <MediaImage
              src={
                service.banner ||
                PROGRAM_BANNERS[index % PROGRAM_BANNERS.length]
              }
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center"
              fallback={PROGRAM_BANNERS[index % PROGRAM_BANNERS.length]}
            />
            <div className="absolute inset-0 bg-[#0A0A0A]/62" />
            <div className="cinema-overlay" />
            <div className="grain-overlay hidden lg:block" />
          </div>
          <div className="panel-copy panel-copy--center">
            <p className="scene-label mb-4 md:mb-6">
              Program / {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="panel-title font-display max-w-4xl text-[clamp(1.55rem,5vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[#F5F5F5]">
              {service.title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#C8C8C8] md:mt-8 md:text-base">
              {service.desc}
            </p>
          </div>
        </StackPanel>
      ))}
    </>
  );
}
