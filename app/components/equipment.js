"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

/** Unique titles + local gallery images (no repeated "Strength Equipment") */
const ORIGINAL_GALLERY = [
  {
    id: "g1",
    title: "Commercial Power Cage",
    category: "Strength",
    img: "/media/gallery-strength-equipment-61da4a.webp",
  },
  {
    id: "g2",
    title: "Dual Cable Station",
    category: "Functional",
    img: "/media/gallery-strength-equipment-61da48.webp",
  },
  {
    id: "g3",
    title: "Plate-Loaded Machines",
    category: "Strength",
    img: "/media/gallery-strength-equipment-61da46.webp",
  },
  {
    id: "g4",
    title: "Free Weight Zone",
    category: "Free Weights",
    img: "/media/gallery-strength-equipment-61da44.webp",
  },
  {
    id: "g5",
    title: "Cardio Performance Deck",
    category: "Cardio",
    img: "/media/gallery-cardio-machines-61da40.webp",
  },
  {
    id: "g6",
    title: "Selectorized Strength Line",
    category: "Strength",
    img: "/media/gallery-strength-equipment-61da3b.webp",
  },
];

const EQUIP_INTRO = "/equipment-cardio-1.webp";
const EQUIP_BASE_Z = 12;

const TITLE_BANK = [
  "Commercial Power Cage",
  "Dual Cable Station",
  "Plate-Loaded Machines",
  "Free Weight Zone",
  "Cardio Performance Deck",
  "Selectorized Strength Line",
  "Functional Training Rig",
  "Olympic Lifting Platform",
];

function cleanGalleryTitle(title, category, idx = 0) {
  const raw = String(title || "").trim();
  if (
    !raw ||
    /chatgpt/i.test(raw) ||
    /^image\s+/i.test(raw) ||
    /^strength\s+equipment$/i.test(raw)
  ) {
    return TITLE_BANK[idx % TITLE_BANK.length] || category || "Equipment";
  }
  return raw;
}

export default function Equipment() {
  const [equipmentData, setEquipmentData] = useState(ORIGINAL_GALLERY);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) return;
        const resData = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setEquipmentData(
            resData.map((item, idx) => {
              const category = item.category || "Equipment";
              return {
                id: item._id || idx,
                title: cleanGalleryTitle(item.title, category, idx),
                category,
                img:
                  item.imageUrl ||
                  ORIGINAL_GALLERY[idx % ORIGINAL_GALLERY.length].img,
              };
            })
          );
        }
      } catch {
        // keep seed gallery
      }
    };
    fetchGallery();
  }, []);

  const showcase = equipmentData.slice(0, 8);
  const item = showcase[active] || showcase[0];
  const total = showcase.length;

  useEffect(() => {
    if (total <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [total]);

  useEffect(() => {
    setActive(0);
  }, [total]);

  const prev = () => {
    setActive((i) => (i === 0 ? showcase.length - 1 : i - 1));
  };

  const next = () => {
    setActive((i) => (i === showcase.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      <StackPanel
        id="equipment"
        z={EQUIP_BASE_Z}
        className="bg-[#050505] scroll-mt-24"
      >
        <div className="absolute inset-0">
          <MediaImage
            src={EQUIP_INTRO}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
            fallback={EQUIP_INTRO}
          />
          <div className="absolute inset-0 bg-[#050505]/68" />
          <div className="cinema-overlay" />
        </div>
        <div className="panel-copy panel-copy--center">
          <p className="scene-label mb-3 md:mb-4">03 — Equipment</p>
          <h2 className="display-xl max-w-4xl text-[clamp(1.75rem,5vw,5.5rem)] text-[#F5F5F5]">
            Equipment
          </h2>
        </div>
      </StackPanel>

      <StackPanel z={EQUIP_BASE_Z + 1} className="bg-[#050505]">
        <div className="absolute inset-0">
          <MediaImage
            key={item?.id || active}
            src={item?.img}
            alt={item?.title || "Equipment"}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
            fallback={ORIGINAL_GALLERY[active % ORIGINAL_GALLERY.length].img}
          />
          <div className="absolute inset-0 bg-[#050505]/50" />
          <div className="cinema-overlay" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col items-center justify-center px-5 py-16 text-center md:items-start md:justify-center md:px-10 md:pb-24 md:pt-24 md:text-left lg:px-14">
          <p className="scene-label mb-4 md:mb-5">
            Equipment / {String(active + 1).padStart(2, "0")} —{" "}
            {String(showcase.length).padStart(2, "0")} · {item?.category}
          </p>
          <h3 className="font-display max-w-4xl text-[clamp(1.7rem,5vw,5rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[#F5F5F5]">
            {item?.title}
          </h3>

          {showcase.length > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-5 md:mt-10 md:justify-start">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous equipment"
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#F5F5F5] transition hover:border-[#D9D9D9] hover:bg-white/5"
                data-cursor="PREV"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {showcase.map((eq, i) => (
                  <button
                    key={eq.id}
                    type="button"
                    aria-label={`Show ${eq.title}`}
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
                aria-label="Next equipment"
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#F5F5F5] transition hover:border-[#D9D9D9] hover:bg-white/5"
                data-cursor="NEXT"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </StackPanel>
    </>
  );
}
