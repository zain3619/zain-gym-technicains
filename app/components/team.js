"use client";

import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Team() {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredTrainers = [
    {
      id: 1,
      name: "ALI SHER",
      role: "Fitness Trainer",
      experience: "Completed Level 2 Training",
      img: "/team-ali-sher.png",
    },
    {
      id: 2,
      name: "Arslan Raza",
      role: "Fitness Trainer",
      experience: "8+ Years Experience",
      img: "https://i.pinimg.com/736x/58/3d/f5/583df501a9e35e7b2e9a1abc5137cfff.jpg",
    },
  ];

  const teamMembers = [
    {
      id: 3,
      name: "Sara Khan",
      role: "Ladies Trainer / Aerobics",
      experience: "6+ Years Experience",
      img: "https://media.istockphoto.com/id/480756206/photo/sport-woman.jpg?s=612x612&w=0&k=20&c=xpcfBGdZ1WHrIU_Orz4l1l6lGTCtThVTPz45S2COEE8=",
    },
    {
      id: 4,
      name: "Aman Iqbal",
      role: "Machine Assembler",
      experience: "10+ Years Experience",
      img: "https://i.pinimg.com/736x/aa/91/57/aa915783f11c5687cb49d3d02109ae27.jpg",
    },
    {
      id: 5,
      name: "Bilal Ahmed",
      role: "Lead Technician / Electrician",
      experience: "7+ Years Experience",
      img: "https://images.unsplash.com/photo-1681812508658-12c52bf91fd8?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const featuredTrainer = featuredTrainers[featuredIndex];

  const showPreviousTrainer = () =>
    setFeaturedIndex((currentIndex) =>
      currentIndex === 0 ? featuredTrainers.length - 1 : currentIndex - 1,
    );

  const showNextTrainer = () =>
    setFeaturedIndex((currentIndex) =>
      currentIndex === featuredTrainers.length - 1 ? 0 : currentIndex + 1,
    );

  return (
    <section
      id="team"
      className="bg-gray-950 py-20 px-6 md:px-12 lg:px-24 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">
          Our Team
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">
          Experts Behind Your Success
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div className="bg-[#111] rounded-xl overflow-hidden group border border-white/5 hover:border-gym-green/30 transition-all duration-500">
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={featuredTrainer.img}
              alt={featuredTrainer.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />

            <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
              <button
                type="button"
                onClick={showPreviousTrainer}
                className="btn-hover-icon flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm active:scale-[0.98]"
                aria-label="Show previous trainer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={showNextTrainer}
                className="btn-hover-icon flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm active:scale-[0.98]"
                aria-label="Show next trainer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {featuredTrainers.map((trainer, index) => (
                <button
                  key={trainer.id}
                  type="button"
                  onClick={() => setFeaturedIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    featuredIndex === index
                      ? "w-6 bg-gym-green"
                      : "w-2.5 bg-white/45"
                  }`}
                  aria-label={`Show ${trainer.name}`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 relative -mt-10">
            <h4 className="text-white text-xl font-bold mb-1 tracking-tight">
              {featuredTrainer.name}
            </h4>

            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-gym-green text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {featuredTrainer.role}
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-gym-green/50" />
                {featuredTrainer.experience}
              </div>
            </div>
          </div>
        </div>

        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-[#111] rounded-xl overflow-hidden group border border-white/5 hover:border-gym-green/30 transition-all duration-500"
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-6 relative -mt-10">
              <h4 className="text-white text-xl font-bold mb-1 tracking-tight">
                {member.name}
              </h4>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-gym-green text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {member.role}
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-gym-green/50" />
                  {member.experience}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
