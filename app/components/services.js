"use client";
import { Layout, Dumbbell, Users, Settings } from "lucide-react"; // Icons ke liye

export default function Services() {
  const serviceList = [
    {
      title: "Gym Design & Planning",
      desc: "Innovative layouts and 3D designs customized to your space, goals and budget.",
      icon: <Layout className="w-10 h-10 text-gym-green" />,
    },
    {
      title: "Equipment Supply",
      desc: "High-quality cardio, strength and functional training equipment.",
      icon: <Dumbbell className="w-10 h-10 text-gym-green" />,
    },
    {
      title: "Trainers & Staff",
      desc: "Certified trainers and staff to manage and grow your gym efficiently.",
      icon: <Users className="w-10 h-10 text-gym-green" />,
    },
    {
      title: "Maintenance & Support",
      desc: "Ongoing maintenance and technical support to keep your gym running smoothly.",
      icon: <Settings className="w-10 h-10 text-gym-green" />,
    },
  ];

  return (
    <section id="services" className="bg-gray-950 py-30 px-6 md:px-12 lg:px-24 scroll-mt-32">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-2">
          Our Services
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">
          Complete Gym Solutions
        </h2>
      </div>

      {/* Grid: Mobile 1 column, Tablet 2, Desktop 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {serviceList.map((service, index) => (
          <div 
            key={index} 
            className="bg-[#111111] p-8 rounded-xl border border-white/5 hover:border-gym-green/50 transition-all duration-300 group text-center flex flex-col items-center"
          >
            <div className="mb-6 p-4 bg-black rounded-lg group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>
            <h4 className="text-white text-xl font-bold mb-4">{service.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}