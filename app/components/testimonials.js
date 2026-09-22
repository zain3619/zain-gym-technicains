"use client";

import React, { useEffect, useState } from "react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

const TESTIMONIALS_Z = 58;

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) return;
        const resData = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setReviews(
            resData.map((item, idx) => ({
              id: item._id || idx,
              name: item.name || "Client Partner",
              role: item.role || "Satisfied Gym Owner",
              text: item.text || "",
              imageUrl: item.imageUrl || "",
            }))
          );
        }
      } catch {
        // hide when unavailable
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  const showcase = reviews.slice(0, 6);

  return (
    <>
      <StackPanel z={TESTIMONIALS_Z} className="bg-[#050505]">
        <div className="absolute inset-0">
          <MediaImage
            src="/contact-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            fallback="/hero-gym.png"
          />
          <div className="absolute inset-0 bg-[#050505]/72" />
          <div className="cinema-overlay" />
          <div className="grain-overlay hidden lg:block" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <p className="scene-label mb-4">07 — Testimonials</p>
          <h2 className="display-xl max-w-3xl text-[clamp(2rem,6vw,5rem)] text-[#F5F5F5]">
            What Our Clients Say
          </h2>
        </div>
      </StackPanel>

      {showcase.map((review, index) => (
        <StackPanel
          key={review.id}
          z={TESTIMONIALS_Z + 1 + index}
          className="bg-[#080808]"
        >
          <div className="absolute inset-0">
            <MediaImage
              src={review.imageUrl || "/hero-gym.png"}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-40"
              fallback="/hero-gym.png"
            />
            <div className="absolute inset-0 bg-[#080808]/78" />
            <div className="cinema-overlay" />
          </div>
          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 md:py-24 lg:px-14">
            <p className="scene-label mb-6 md:mb-8">
              Quote / {String(index + 1).padStart(2, "0")}
            </p>
            <blockquote className="max-w-5xl">
              <p className="font-display text-[clamp(1.25rem,3.8vw,3.4rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-[#F5F5F5]">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6 md:mt-10">
                {review.imageUrl ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-white/10">
                    <MediaImage
                      src={review.imageUrl}
                      alt={review.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      fallback=""
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/15 text-[11px] font-bold uppercase tracking-widest text-[#D9D9D9]">
                    {review.name?.substring(0, 2) || "CL"}
                  </div>
                )}
                <div className="min-w-0">
                  <cite className="not-italic text-sm font-semibold uppercase tracking-[0.16em] text-[#F5F5F5]">
                    {review.name}
                  </cite>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0]">
                    {review.role}
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </StackPanel>
      ))}
    </>
  );
}
