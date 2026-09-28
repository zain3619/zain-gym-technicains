"use client";

import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

const PROCESS_Z = 22;
const PROCESS_BG = "/process-bg.webp";

export default function Process() {
  const steps = [
    {
      id: 1,
      title: "Consultation",
      desc: "We understand your goals, space and requirements.",
    },
    {
      id: 2,
      title: "Design Planning",
      desc: "Our team creates 3D layout and design for your gym.",
    },
    {
      id: 3,
      title: "Equipment Setup",
      desc: "We supply and install premium quality equipment.",
    },
    {
      id: 4,
      title: "Staff Hiring",
      desc: "We provide certified trainers and supporting staff.",
    },
    {
      id: 5,
      title: "Launch & Support",
      desc: "We launch your gym and provide ongoing support.",
    },
  ];

  return (
    <StackPanel z={PROCESS_Z} className="bg-[#0D0D0D]">
      <div className="absolute inset-0">
        <MediaImage
          src={PROCESS_BG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          fallback={PROCESS_BG}
        />
        <div className="absolute inset-0 bg-[#0D0D0D]/78" />
        <div className="cinema-overlay" />
      </div>
      <div className="panel-copy panel-copy--center">
        <p className="scene-label mb-3 md:mb-4">04 — Process</p>
        <h2 className="display-xl mb-8 max-w-3xl text-[clamp(1.75rem,5vw,5rem)] text-[#F5F5F5] md:mb-16">
          From Concept to Completion
        </h2>

        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((step) => (
            <li key={step.id}>
              <span className="font-display text-4xl font-bold tracking-tight text-white/10 md:text-6xl">
                {String(step.id).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-[-0.02em] text-[#F5F5F5] md:mt-4 md:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-[#A0A0A0] md:mt-3">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </StackPanel>
  );
}
