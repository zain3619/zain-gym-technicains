"use client";

import React, { useEffect, useState } from "react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

/** Bundled gallery images (from Cloudinary → /public/media) */
const ORIGINAL_GALLERY = [
  {
    id: "g1",
    title: "Strength Equipment",
    category: "Strength Equipment",
    img: "/media/gallery-strength-equipment-61da4a.webp",
  },
  {
    id: "g2",
    title: "Strength Equipment",
    category: "Strength Equipment",
    img: "/media/gallery-strength-equipment-61da48.webp",
  },
  {
    id: "g3",
    title: "Strength Equipment",
    category: "Strength Equipment",
    img: "/media/gallery-strength-equipment-61da46.webp",
  },
  {
    id: "g4",
    title: "Strength Equipment",
    category: "Strength Equipment",
    img: "/media/gallery-strength-equipment-61da44.webp",
  },
  {
    id: "g5",
    title: "Cardio Machines",
    category: "Cardio Machines",
    img: "/media/gallery-cardio-machines-61da40.webp",
  },
  {
    id: "g6",
    title: "Strength Equipment",
    category: "Strength Equipment",
    img: "/media/gallery-strength-equipment-61da3b.webp",
  },
];

const EQUIP_BASE_Z = 12;

function cleanGalleryTitle(title, category) {
  const raw = String(title || "").trim();
  const cat = String(category || "Equipment").trim();
  if (!raw || /chatgpt/i.test(raw) || /^image\s+/i.test(raw)) return cat;
  return raw;
}

export default function Equipment() {
  const [equipmentData, setEquipmentData] = useState(ORIGINAL_GALLERY);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) return;
        const resData = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setEquipmentData(
            resData.map((item, idx) => {
              const category = item.category || "Strength Equipment";
              return {
                id: item._id || idx,
                title: cleanGalleryTitle(item.title, category),
                category,
                // Always prefer admin/Cloudinary URL — never swap in local PNGs
                img: item.imageUrl || ORIGINAL_GALLERY[idx % ORIGINAL_GALLERY.length].img,
              };
            })
          );
        }
      } catch {
        // keep original gallery seed
      }
    };
    fetchGallery();
  }, []);

  const showcase = equipmentData.slice(0, 6);
  const introImg = showcase[0]?.img || ORIGINAL_GALLERY[0].img;

  return (
    <>
      <StackPanel
        id="equipment"
        z={EQUIP_BASE_Z}
        className="bg-[#050505] scroll-mt-24"
      >
        <div className="absolute inset-0">
          <MediaImage
            src={introImg}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
            fallback={ORIGINAL_GALLERY[0].img}
          />
          <div className="absolute inset-0 bg-[#050505]/68" />
          <div className="cinema-overlay" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <p className="scene-label mb-4">03 — Equipment</p>
          <h2 className="display-xl max-w-4xl text-[clamp(2rem,6vw,5.5rem)] text-[#F5F5F5]">
            Premium Equipment for Every Need
          </h2>
        </div>
      </StackPanel>

      {showcase.map((item, index) => (
        <StackPanel
          key={item.id}
          z={EQUIP_BASE_Z + 1 + index}
          className="bg-[#050505]"
        >
          <div className="absolute inset-0">
            <MediaImage
              src={item.img}
              alt={item.title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center"
              fallback={ORIGINAL_GALLERY[index % ORIGINAL_GALLERY.length].img}
            />
            <div className="absolute inset-0 bg-[#050505]/45" />
            <div className="cinema-overlay" />
          </div>
          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-14 pt-24 md:px-10 md:pb-24 lg:px-14">
            <p className="scene-label mb-5">
              Equipment / {String(index + 1).padStart(2, "0")} · {item.category}
            </p>
            <h3 className="font-display max-w-4xl text-[clamp(2rem,6.5vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-[#F5F5F5]">
              {item.title}
            </h3>
          </div>
        </StackPanel>
      ))}
    </>
  );
}
