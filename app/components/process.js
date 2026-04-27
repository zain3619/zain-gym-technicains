"use client";
import { Search, PenTool, Dumbbell, UserCheck, Rocket } from "lucide-react";

export default function Process() {
  const steps = [
    {
      id: 1,
      title: "Consultation",
      desc: "We understand your goals, space and requirements.",
      icon: <Search className="w-6 h-6 text-black" />,
    },
    {
      id: 2,
      title: "Design Planning",
      desc: "Our team creates 3D layout and design for your gym.",
      icon: <PenTool className="w-6 h-6 text-black" />,
    },
    {
      id: 3,
      title: "Equipment Setup",
      desc: "We supply and install premium quality equipment.",
      icon: <Dumbbell className="w-6 h-6 text-black" />,
    },
    {
      id: 4,
      title: "Staff Hiring",
      desc: "We provide certified trainers and supporting staff.",
      icon: <UserCheck className="w-6 h-6 text-black" />,
    },
    {
      id: 5,
      title: "Launch & Support",
      desc: "We launch your gym and provide ongoing support.",
      icon: <Rocket className="w-6 h-6 text-black" />,
    },
  ];

  return (
    <section className="bg-gray-950 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-18">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">
          Our Process
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">
          From Concept to Completion
        </h2>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Horizontal Line (Desktop Only) */}
        <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] border-t-2 border-dashed border-gym-green/30 z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-4 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="w-24 h-24 bg-gym-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(151,255,2,0.3)] hover:scale-110 transition-transform duration-300 border-4 border-black">
                {step.icon}
              </div>

              {/* Text Content */}
              <h4 className="text-white text-lg font-bold mb-3 italic">
                {step.id}. {step.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}