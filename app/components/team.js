"use client";

import React, { useEffect, useState } from "react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

const TEAM_Z = 40;

const LOCAL_FALLBACK = [
  {
    id: "local-ali",
    name: "Ali Sher",
    role: "Trainer",
    experience: "",
    img: "/team-ali-sher.png",
  },
];

export default function Team() {
  // Same first paint on server + client
  const [teamList, setTeamList] = useState(LOCAL_FALLBACK);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("/api/team");
        if (!response.ok) return;
        const resData = await response.json();
        if (!Array.isArray(resData) || resData.length === 0) return;

        const roleOrder = ["ceo", "trainer", "ladies trainer", "technicians"];
        const sorted = [...resData].sort((a, b) => {
          const idxA = roleOrder.indexOf(
            String(a.role || "").trim().toLowerCase()
          );
          const idxB = roleOrder.indexOf(
            String(b.role || "").trim().toLowerCase()
          );
          return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
        });

        setTeamList(
          sorted.map((t) => ({
            id: t._id,
            name: t.name,
            role: t.role || "Trainer",
            experience: t.experience || "",
            img: t.imageUrl,
          }))
        );
      } catch {
        // keep local fallback
      }
    };
    fetchTeam();
  }, []);

  return (
    <>
      <StackPanel id="team" z={TEAM_Z} className="bg-[#080808] scroll-mt-24">
        <div className="absolute inset-0">
          <MediaImage
            src="/about-team.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            fallback="/team-ali-sher.png"
          />
          <div className="absolute inset-0 bg-[#080808]/70" />
          <div className="cinema-overlay" />
          <div className="grain-overlay hidden lg:block" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <p className="scene-label mb-4">06 — Team</p>
          <h2 className="display-xl max-w-3xl text-[clamp(2rem,6vw,5.5rem)] text-[#F5F5F5]">
            Experts Behind Your Success
          </h2>
          <p className="mt-6 max-w-md text-sm text-[#C8C8C8] md:mt-8">
            Scroll through every team member.
          </p>
        </div>
      </StackPanel>

      {teamList.map((member, index) => (
        <StackPanel
          key={member.id || `${member.name}-${index}`}
          z={TEAM_Z + 1 + index}
          className="bg-[#080808]"
        >
          <div className="absolute inset-0 lg:grid lg:grid-cols-2">
            <div className="absolute inset-0 lg:relative lg:inset-auto">
              <MediaImage
                src={member.img}
                alt={member.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
                priority={index === 0}
                fallback="/team-ali-sher.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/20 lg:bg-gradient-to-r lg:from-transparent lg:to-[#080808]/90" />
              <div className="grain-overlay hidden lg:block" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 pt-24 md:px-10 md:pb-24 lg:justify-center lg:px-16 lg:py-24">
              <p className="scene-label mb-5 md:mb-6">
                Team / {String(index + 1).padStart(2, "0")}
                {teamList.length > 1
                  ? ` — ${String(teamList.length).padStart(2, "0")}`
                  : ""}
              </p>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#BDBDBD]">
                {member.role}
              </p>
              <h3 className="font-display text-[clamp(2.1rem,6.5vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-[#F5F5F5]">
                {member.name}
              </h3>
              {member.experience ? (
                <p className="mt-6 max-w-md text-sm leading-relaxed text-[#A0A0A0] md:text-base">
                  {member.experience}
                </p>
              ) : null}

              {teamList.length > 1 ? (
                <div className="mt-10 flex gap-2">
                  {teamList.map((_, i) => (
                    <span
                      key={i}
                      className={`h-px transition-all ${
                        i === index ? "w-8 bg-[#D9D9D9]" : "w-4 bg-white/25"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </StackPanel>
      ))}
    </>
  );
}
