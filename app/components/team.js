"use client";
import { CheckCircle2 } from "lucide-react";

export default function Team() {
  const teamMembers = [
    {
      id: 1,
      name: "Arsalan Raza",
      role: "Fitness Trainer",
      experience: "8+ Years Experience",
      img: "https://i.pinimg.com/736x/58/3d/f5/583df501a9e35e7b2e9a1abc5137cfff.jpg",
    },
    {
      id: 2,
      name: "Sara Khan",
      role: "Ladies Trainer / Aerobics",
      experience: "6+ Years Experience",
      img: "https://media.istockphoto.com/id/480756206/photo/sport-woman.jpg?s=612x612&w=0&k=20&c=xpcfBGdZ1WHrIU_Orz4l1l6lGTCtThVTPz45S2COEE8=",
    },
    {
      id: 3,
      name: "Aman Iqbal",
      role: "Machine Assembler",
      experience: "10+ Years Experience",
      img: "https://i.pinimg.com/736x/aa/91/57/aa915783f11c5687cb49d3d02109ae27.jpg",
    },
    {
      id: 4,
      name: "Bilal Ahmed",
      role: "Lead Technician / Electrician",
      experience: "7+ Years Experience",
      img: "https://images.unsplash.com/photo-1681812508658-12c52bf91fd8?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section id="team" className="bg-gray-950 py-20 px-6 md:px-12 lg:px-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">Our Team</h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">Experts Behind Your Success</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-[#111] rounded-xl overflow-hidden group border border-white/5 hover:border-gym-green/30 transition-all duration-500">
            {/* Image Container with Portrait Aspect Ratio */}
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src={member.img} 
                alt={member.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Subtle Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
            </div>

            {/* Content Area */}
            <div className="p-6 relative -mt-10">
              <h4 className="text-white text-xl font-bold mb-1 tracking-tight">{member.name}</h4>
              
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