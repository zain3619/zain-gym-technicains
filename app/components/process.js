"use client";

import StackPanel from "./ui/StackPanel";

const PROCESS_Z = 22;

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
      <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 lg:px-14">
        <p className="scene-label mb-4">04 — Process</p>
        <h2 className="display-xl mb-14 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-[#F5F5F5] md:mb-20">
          From Concept to Completion
        </h2>

        <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((step) => (
            <li key={step.id}>
              <span className="font-display text-5xl font-bold tracking-tight text-white/10 md:text-6xl">
                {String(step.id).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-[#A0A0A0]">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </StackPanel>
  );
}
