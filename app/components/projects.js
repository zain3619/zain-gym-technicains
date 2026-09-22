"use client";

import { useState } from "react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

const PROJECTS_Z = 24;

export default function Projects() {
  const [showAll, setShowAll] = useState(true);

  const projectData = [
    {
      id: 1,
      name: "Allied Bank (Corporate Gym)",
      location: "Lahore",
      area: "3500 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
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
        "https://t4.ftcdn.net/jpg/12/47/96/37/360_F_1247963773_JZzt7NYQ7LTpixqdJmy77uC0wtvwcLjK.jpg",
      afterImg:
        "https://cdn.prod.website-files.com/634053de3cf351fe4c9ff01b/634053de3cf351777f9ff4fd_fitness-center-gym-3d-model-max.jpg",
    },
    {
      id: 4,
      name: "Sukh Chayn Luxury Gym",
      location: "Lahore",
      area: "6000 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?q=80&w=1200",
      afterImg:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
    },
    {
      id: 5,
      name: "Indigo Hotel Fitness",
      location: "Lahore",
      area: "2800 Sqft",
      beforeImg:
        "https://s3-media0.fl.yelpcdn.com/bphoto/Wgy-g4ximdvTHEww2Zd0_Q/ls.jpg",
      afterImg:
        "https://s3-media0.fl.yelpcdn.com/bphoto/F4hHpNrQ6zn4n5AU53-PUw/348s.jpg",
    },
    {
      id: 6,
      name: "Private Farm House Gym",
      location: "Bedian Road",
      area: "1500 Sqft",
      beforeImg:
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=1200",
      afterImg:
        "https://thefitnessoutlet.com/cdn/shop/articles/8ffdd791-88e7-4320-a4ae-d3644ca5da77_16e47585-539f-4d8b-a289-9db8dbcf7012.jpg?v=1770214853",
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
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            fallback="/hero-gym.png"
          />
          <div className="absolute inset-0 bg-[#050505]/68" />
          <div className="cinema-overlay" />
          <div className="grain-overlay hidden lg:block" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <p className="scene-label mb-4">05 — Projects</p>
          <h2 className="display-xl max-w-3xl text-[clamp(2rem,6vw,5.5rem)] text-[#F5F5F5]">
            Gyms We&apos;re Proud Of
          </h2>
        </div>
      </StackPanel>

      {displayedProjects.map((project, index) => (
        <StackPanel
          key={project.id}
          z={PROJECTS_Z + 1 + index}
          className="bg-[#080808]"
        >
          <div className="absolute inset-0 lg:grid lg:grid-cols-2">
            {/* After — primary (same images as original project data) */}
            <div className="absolute inset-0 lg:relative lg:inset-auto">
              <MediaImage
                src={project.afterImg}
                alt={`${project.name} after`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                fallback={project.beforeImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#080808]/85" />
              <span className="absolute left-5 top-5 z-10 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D9D9D9]">
                After
              </span>
            </div>

            {/* Before — original before image */}
            <div className="relative z-10 hidden lg:block">
              <div className="absolute inset-0">
                <MediaImage
                  src={project.beforeImg}
                  alt={`${project.name} before`}
                  fill
                  sizes="50vw"
                  className="object-cover opacity-80 grayscale"
                  fallback={project.afterImg}
                />
                <div className="absolute inset-0 bg-[#080808]/45" />
              </div>
              <span className="absolute left-5 top-5 z-10 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/80">
                Before
              </span>
            </div>
          </div>

          <div className="relative z-20 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24 lg:pointer-events-none lg:px-14">
            <div className="lg:max-w-[48%]">
              <p className="scene-label mb-4">
                Project / {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display max-w-4xl text-[clamp(2rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-[#F5F5F5]">
                {project.name}
              </h3>
              <div className="mt-8 flex flex-wrap gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                <span>{project.location}</span>
                <span>{project.area}</span>
              </div>
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
