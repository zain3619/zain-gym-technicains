"use client";
import { Search, PenTool, Dumbbell, UserCheck, Rocket } from "lucide-react";

export default function Process() {
  const steps = [
    {
      id: 1,
      title: "Consultation",
      desc: "We understand your goals, space and requirements.",
      icon: <Search className="h-5 w-5 text-black sm:h-6 sm:w-6" />,
    },
    {
      id: 2,
      title: "Design Planning",
      desc: "Our team creates 3D layout and design for your gym.",
      icon: <PenTool className="h-5 w-5 text-black sm:h-6 sm:w-6" />,
    },
    {
      id: 3,
      title: "Equipment Setup",
      desc: "We supply and install premium quality equipment.",
      icon: <Dumbbell className="h-5 w-5 text-black sm:h-6 sm:w-6" />,
    },
    {
      id: 4,
      title: "Staff Hiring",
      desc: "We provide certified trainers and supporting staff.",
      icon: <UserCheck className="h-5 w-5 text-black sm:h-6 sm:w-6" />,
    },
    {
      id: 5,
      title: "Launch & Support",
      desc: "We launch your gym and provide ongoing support.",
      icon: <Rocket className="h-5 w-5 text-black sm:h-6 sm:w-6" />,
    },
  ];

  return (
    <section className="bg-gray-950 px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto mb-12 max-w-7xl text-center sm:mb-14 md:mb-18">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-gym-green sm:mb-4 sm:text-base md:text-lg">
          Our Process
        </h3>
        <h2 className="text-balance text-[1.9rem] font-black leading-tight text-white sm:text-4xl md:text-5xl">
          From Concept to Completion
        </h2>
      </div>

      <div className="mx-auto max-w-7xl relative">
        {/* Horizontal Line (Desktop Only) */}
        <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] border-t-2 border-dashed border-gym-green/30 z-0"></div>

        <div className="relative z-10 grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full border-4 border-black bg-gym-green shadow-[0_0_20px_rgba(151,255,2,0.3)] transition-transform duration-300 hover:scale-110 sm:mb-5 sm:h-20 sm:w-20 md:h-22 md:w-22 lg:mb-6 lg:h-24 lg:w-24">
                {step.icon}
              </div>

              {/* Text Content */}
              <h4 className="mb-2 text-base font-bold italic text-white sm:text-lg lg:mb-3">
                {step.id}. {step.title}
              </h4>
              <p className="max-w-[220px] text-sm leading-relaxed text-gray-400 sm:text-[0.95rem]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
