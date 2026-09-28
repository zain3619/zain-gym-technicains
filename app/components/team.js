"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";
import { resolveLocalMedia } from "../lib/localMedia";

/** Full local roster — used when Mongo/API returns empty */
const LOCAL_FALLBACK = [
  {
    id: "local-qaiser",
    name: "Muhammad Qaiser",
    role: "CEO",
    experience: "Leading gym design and complete setup projects across Pakistan.",
    img: "/media/team-muhammad-qaiser-7bd62d.webp",
  },
  {
    id: "local-ali",
    name: "Ali Sher",
    role: "Trainer",
    experience: "Certified trainer focused on commercial gym floor programming.",
    img: "/media/team-ali-shier-06cdaa.webp",
  },
  {
    id: "local-omer",
    name: "Muhammad Omer",
    role: "Technicians",
    experience: "Equipment installation and on-site technical supervision.",
    img: "/media/team-muhammad-omer-ef48d6.webp",
  },
  {
    id: "local-shamraiz",
    name: "Muhammad Shamraiz",
    role: "Technicians",
    experience: "Rigging, assembly, and precision machine placement.",
    img: "/media/team-muhammad-shamraiz-24830b.webp",
  },
  {
    id: "local-aakash",
    name: "Aakash Mukhtar",
    role: "Technicians",
    experience: "Cardio and strength line setup with clean finishes.",
    img: "/media/team-aakash-mukhtar-61da2d.webp",
  },
  {
    id: "local-hafiz",
    name: "Hafiz Umer",
    role: "Technicians",
    experience: "Maintenance support and after-sales service coordination.",
    img: "/media/team-hafiz-umer-61d9f8.webp",
  },
  {
    id: "local-arshia",
    name: "Arshia Sheikh",
    role: "Ladies Trainer",
    experience: "Ladies gym layouts and member experience planning.",
    img: "/media/team-arshia-sheikh-7bd638.webp",
  },
  {
    id: "local-fatima",
    name: "Fatima Taimoor",
    role: "Ladies Trainer",
    experience: "Women-focused training zones and studio programming.",
    img: "/media/team-fatima-taimoor-07090e.webp",
  },
];

const TEAM_INTRO = "/team-intro.webp";
const TEAM_PANEL_BG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600";

export default function Team() {
  const [teamList, setTeamList] = useState(LOCAL_FALLBACK);
  const [active, setActive] = useState(0);

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
          sorted.map((t, idx) => ({
            id: t._id,
            name: t.name,
            role: t.role || "Trainer",
            experience: t.experience || "",
            img:
              resolveLocalMedia(t.imageUrl) ||
              t.imageUrl ||
              LOCAL_FALLBACK[idx % LOCAL_FALLBACK.length].img,
          }))
        );
      } catch {
        // keep local fallback roster
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    if (teamList.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % teamList.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [teamList.length]);

  const prev = () => {
    setActive((i) => (i === 0 ? teamList.length - 1 : i - 1));
  };

  const next = () => {
    setActive((i) => (i === teamList.length - 1 ? 0 : i + 1));
  };

  const member = teamList[active] || teamList[0];

  return (
    <>
      <StackPanel id="team" className="bg-[#080808] scroll-mt-24">
        <div className="absolute inset-0">
          <MediaImage
            src={TEAM_INTRO}
            alt=""
            fill
            className="object-cover object-center"
            fallback="/media/team-muhammad-qaiser-7bd62d.webp"
          />
          <div className="absolute inset-0 bg-[#080808]/70" />
          <div className="cinema-overlay" />
        </div>
        <div className="panel-copy panel-copy--center">
          <p className="scene-label mb-3 md:mb-4">06 — Team</p>
          <h2 className="display-xl max-w-3xl text-[clamp(1.75rem,5vw,5.5rem)] text-[#F5F5F5]">
            Our Team
          </h2>
        </div>
      </StackPanel>

      <StackPanel className="bg-[#050505]">
        <div className="absolute inset-0">
          <MediaImage
            src={TEAM_PANEL_BG}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
            fallback="/projects-intro.webp"
          />
          <div className="absolute inset-0 bg-[#050505]/78" />
          <div className="cinema-overlay" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-16 text-center md:px-10 md:text-left lg:px-14">
          <p className="scene-label mb-6 md:mb-8">
            Team / {String(active + 1).padStart(2, "0")} —{" "}
            {String(teamList.length).padStart(2, "0")}
          </p>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden border border-white/10 bg-[#0a0a0a] lg:max-w-none">
              <MediaImage
                key={member.id || member.name}
                src={member.img}
                alt={member.name}
                fill
                className="object-cover object-top"
                priority
                fallback="/media/team-ali-shier-06cdaa.webp"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col items-center md:items-start">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#BDBDBD]">
                {member.role}
              </p>
              <h3 className="font-display text-[clamp(1.85rem,5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-[#F5F5F5]">
                {member.name}
              </h3>
              {member.experience ? (
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#A0A0A0] md:mt-6 md:text-base">
                  {member.experience}
                </p>
              ) : null}

              {teamList.length > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-5 md:mt-10 md:justify-start">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous team member"
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#F5F5F5] transition hover:border-[#D9D9D9] hover:bg-white/5"
                    data-cursor="PREV"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex max-w-[180px] flex-wrap gap-2 sm:max-w-none">
                    {teamList.map((t, i) => (
                      <button
                        key={t.id || t.name}
                        type="button"
                        aria-label={`Show ${t.name}`}
                        onClick={() => setActive(i)}
                        className={`h-px transition-all ${
                          i === active ? "w-8 bg-[#D9D9D9]" : "w-4 bg-white/25"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next team member"
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#F5F5F5] transition hover:border-[#D9D9D9] hover:bg-white/5"
                    data-cursor="NEXT"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </StackPanel>
    </>
  );
}
