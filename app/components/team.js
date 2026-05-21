"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Team() {
  const [loading, setLoading] = useState(true);
  const [teamList, setTeamList] = useState([]);
  const [innerIndices, setInnerIndices] = useState({});

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team");
        if (response.ok) {
          const resData = await response.json();
          if (Array.isArray(resData)) {
            setTeamList(resData.map(t => ({
              id: t._id,
              name: t.name,
              role: t.role || "Trainer",
              experience: t.experience || "Roster Specialist",
              img: t.imageUrl
            })));
          }
        }
      } catch (error) {
        console.log("Failed to fetch Team from MERN API.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-950 py-20 px-6 md:px-12 md:py-30 lg:px-24">
        <div className="max-w-7xl mx-auto text-center mb-16 flex flex-col items-center">
          <div className="h-6 w-32 rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-4" />
          <div className="h-10 w-full max-w-[500px] rounded bg-neutral-900/80 animate-pulse border border-white/5" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111] rounded-xl overflow-hidden border border-white/5 h-[380px] w-full flex flex-col justify-between p-4">
              <div className="aspect-[3/4] w-full rounded-lg bg-neutral-900/80 animate-pulse border border-white/5" />
              <div className="h-6 w-32 rounded bg-neutral-900/80 animate-pulse border border-white/5 mt-4 mb-2" />
              <div className="h-4 w-24 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no members are added by the admin, do not render the section
  if (teamList.length === 0) {
    return null;
  }

  // Group members dynamically by their exact role from the DB
  const uniqueRoles = Array.from(new Set(teamList.map(t => t.role)));
  
  const groupedByRole = uniqueRoles.reduce((acc, roleName) => {
    acc[roleName] = teamList.filter(t => t.role === roleName);
    return acc;
  }, {});

  // Sort unique roles in requested strict order: CEO -> Trainer -> Ladies trainer -> Technicians
  const roleOrder = ["ceo", "trainer", "ladies trainer", "technicians"];
  const sortedUniqueRoles = uniqueRoles.sort((a, b) => {
    const idxA = roleOrder.indexOf(String(a).trim().toLowerCase());
    const idxB = roleOrder.indexOf(String(b).trim().toLowerCase());
    
    // If a role is not specified in order config, place it at the very end
    const valA = idxA !== -1 ? idxA : 999;
    const valB = idxB !== -1 ? idxB : 999;
    return valA - valB;
  });

  const handlePrev = (roleKey, e) => {
    e.stopPropagation();
    const list = groupedByRole[roleKey];
    const currentIndex = innerIndices[roleKey] || 0;
    setInnerIndices(prev => ({
      ...prev,
      [roleKey]: currentIndex === 0 ? list.length - 1 : currentIndex - 1
    }));
  };

  const handleNext = (roleKey, e) => {
    e.stopPropagation();
    const list = groupedByRole[roleKey];
    const currentIndex = innerIndices[roleKey] || 0;
    setInnerIndices(prev => ({
      ...prev,
      [roleKey]: (currentIndex + 1) % list.length
    }));
  };

  return (
    <section
      id="team"
      className="bg-gray-950 py-20 px-6 md:px-12 md:py-30 lg:px-24 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">
          Our Team
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">
          Experts Behind Your Success
        </h2>
      </div>

      {/* Grid displays up to 4 cards in strict custom sort order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {sortedUniqueRoles.map((roleName) => {
          const list = groupedByRole[roleName];
          const activeIndex = innerIndices[roleName] || 0;
          const member = list[activeIndex] || list[0];

          if (!member) return null;

          return (
            <div
              key={roleName}
              className="bg-[#111] rounded-xl overflow-hidden group border border-white/5 hover:border-gym-green/30 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Container with aspect-[3/4] to match original size */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />

                {/* Left/Right Inner Navigation - Only show if role has multiple members */}
                {list.length > 1 && (
                  <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4 z-30">
                    <button
                      type="button"
                      onClick={(e) => handlePrev(roleName, e)}
                      className="btn-hover-icon flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm active:scale-[0.98] cursor-pointer"
                      aria-label={`Previous ${roleName}`}
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleNext(roleName, e)}
                      className="btn-hover-icon flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm active:scale-[0.98] cursor-pointer"
                      aria-label={`Next ${roleName}`}
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                )}

                {/* Small indicator dots if multiple items exist */}
                {list.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 z-30">
                    {list.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInnerIndices(prev => ({ ...prev, [roleName]: idx }))}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeIndex === idx
                            ? "w-4 bg-gym-green"
                            : "w-2 bg-white/45"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Roster Details matching the original size */}
              <div className="p-6 relative -mt-10 bg-[#111] z-20 rounded-b-xl flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-white text-xl font-bold tracking-tight uppercase line-clamp-1">
                    {member.name}
                  </h4>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-gym-green text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {roleName}
                    </div>
                    <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-gym-green/50" />
                      {member.experience}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
