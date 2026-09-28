"use client";

import { useState } from "react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

const PROJECTS_Z = 24;
const PROJECTS_INTRO = "/projects-intro.webp";

export default function Projects() {
  const [showAll, setShowAll] = useState(true);

  const projectData = [
    {
      id: 1,
      name: "Allied Bank (Corporate Gym)",
      location: "Lahore",
      area: "3500 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200",
    },
    {
      id: 2,
      name: "Nestle Wellness Center",
      location: "Sheikhupura",
      area: "5000 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200",
    },
    {
      id: 3,
      name: "Coca-Cola Fitness Club",
      location: "Faisalabad",
      area: "4200 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1517963879433-6af2b31a2b76?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200",
    },
    {
      id: 4,
      name: "Sukh Chayn Luxury Gym",
      location: "Lahore",
      area: "6000 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1200",
    },
    {
      id: 5,
      name: "Indigo Hotel Fitness",
      location: "Lahore",
      area: "2800 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=1200",
    },
    {
      id: 6,
      name: "Private Farm House Gym",
      location: "Bedian Road",
      area: "1500 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200",
    },
  ];

  const displayedProjects = showAll ? projectData : projectData.slice(0, 3);

  return (
    <>
      <StackPanel
        id="projects"
        z={PROJECTS_Z}
        className="bg-[#050505] scroll-mt-24"
      >
        <div className="absolute inset-0">
          <MediaImage
            src={PROJECTS_INTRO}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            fallback={PROJECTS_INTRO}
          />
          <div className="absolute inset-0 bg-[#050505]/68" />
          <div className="cinema-overlay" />
          <div className="grain-overlay hidden lg:block" />
        </div>
        <div className="panel-copy panel-copy--center">
          <p className="scene-label mb-3 md:mb-4">05 — Projects</p>
          <h2 className="display-xl max-w-3xl text-[clamp(1.75rem,5vw,5.5rem)] text-[#F5F5F5]">
            Gyms We&apos;re Proud Of
          </h2>
        </div>
      </StackPanel>

      {displayedProjects.map((project, index) => (
        <StackPanel
          key={project.id}
          z={PROJECTS_Z + 1 + index}
          compactMobile
          className="bg-[#080808]"
        >
          <div className="absolute inset-0 grid grid-cols-2">
            {/* After — left */}
            <div className="relative h-full min-h-0 overflow-hidden">
              <MediaImage
                src={project.afterImg}
                alt={`${project.name} after`}
                fill
                sizes="50vw"
                className="object-cover object-center"
                fallback={project.beforeImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/85 via-[#080808]/25 to-transparent lg:bg-gradient-to-r lg:from-[#080808]/70 lg:via-[#080808]/35 lg:to-transparent" />
              <span className="absolute left-2.5 top-2.5 z-10 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#D9D9D9] sm:left-5 sm:top-5 sm:text-[9px] sm:tracking-[0.28em]">
                After
              </span>

              {/* Mobile: title band at bottom so image stays readable */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 lg:inset-0 lg:flex lg:flex-col lg:justify-center lg:p-8 xl:px-12">
                <p className="scene-label mb-1.5 sm:mb-2 lg:mb-4">
                  Project / {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="panel-title font-display w-full max-w-full text-[clamp(0.8rem,3.4vw,2.85rem)] font-bold uppercase leading-[1.12] tracking-[-0.03em] text-[#F5F5F5] [overflow-wrap:anywhere] lg:leading-[1.05]">
                  {project.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#A0A0A0] sm:mt-3 sm:text-[10px] sm:tracking-[0.18em] lg:mt-7 lg:gap-8 lg:text-[11px] lg:tracking-[0.2em]">
                  <span>{project.location}</span>
                  <span>{project.area}</span>
                </div>
              </div>
            </div>

            {/* Before — right */}
            <div className="relative h-full min-h-0 overflow-hidden border-l border-white/10">
              <MediaImage
                src={project.beforeImg}
                alt={`${project.name} before`}
                fill
                sizes="50vw"
                className="object-cover object-center opacity-80 grayscale"
                fallback={project.afterImg}
              />
              <div className="absolute inset-0 bg-[#080808]/45" />
              <span className="absolute left-2.5 top-2.5 z-10 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:left-5 sm:top-5 sm:text-[9px] sm:tracking-[0.28em]">
                Before
              </span>
            </div>
          </div>
        </StackPanel>
      ))}

      <div className="relative z-[31] bg-[#050505] py-10 text-center lg:hidden">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="btn-silver"
          data-cursor="OPEN"
        >
          {showAll ? "Show Less" : "View All Projects"}
        </button>
      </div>
    </>
  );
}
