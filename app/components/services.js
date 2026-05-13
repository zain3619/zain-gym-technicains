"use client";
import { Layout, Dumbbell, Users, Settings } from "lucide-react"; // Icons ke liye

export default function Services() {
  const serviceList = [
    {
      title: "Gym Design & Planning",
      desc: "Innovative layouts and 3D designs customized to your space, goals, and budget.",
      icon: <Layout className="h-8 w-8 text-gym-green sm:h-9 sm:w-9 lg:h-10 lg:w-10" />,
    },
    {
      title: "Fitness Equipment Supply",
      desc: "High-quality cardio, strength, and functional training equipment for commercial and private gyms.",
      icon: <Dumbbell className="h-8 w-8 text-gym-green sm:h-9 sm:w-9 lg:h-10 lg:w-10" />,
    },
    {
      title: "Trainers & Staff",
      desc: "Certified trainers and staff to manage and grow your gym efficiently.",
      icon: <Users className="h-8 w-8 text-gym-green sm:h-9 sm:w-9 lg:h-10 lg:w-10" />,
    },
    {
      title: "Maintenance & Support",
      desc: "Ongoing maintenance and technical support to keep your gym running smoothly.",
      icon: <Settings className="h-8 w-8 text-gym-green sm:h-9 sm:w-9 lg:h-10 lg:w-10" />,
    },
  ];

  return (
    <section
      id="services"
      className="bg-gray-950 px-6 py-20 sm:py-24 md:px-12 md:py-30 lg:px-24 scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl text-center mb-12 sm:mb-14 md:mb-16">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-gym-green sm:text-base md:text-lg">
          Our Services
        </h3>
        <h2 className="text-balance text-[1.9rem] font-black leading-tight text-white sm:text-4xl md:text-5xl">
          Complete Gym Design and Setup Solutions
        </h2>
      </div>

      {/* Grid: Mobile 1 column, Tablet 2, Desktop 4 */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {serviceList.map((service, index) => (
          <div 
            key={index} 
            className="group flex flex-col items-center rounded-xl border border-white/5 bg-[#111111] p-6 text-center transition-all duration-300 hover:border-gym-green/50 sm:p-7 lg:p-8"
          >
            <div className="mb-4 rounded-lg bg-black p-3 transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:p-3.5 lg:mb-6 lg:p-4">
              {service.icon}
            </div>
            <h4 className="mb-3 text-lg font-bold text-white sm:text-[1.15rem] lg:mb-4 lg:text-xl">
              {service.title}
            </h4>
            <p className="text-sm leading-relaxed text-gray-400 sm:text-[0.95rem]">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
