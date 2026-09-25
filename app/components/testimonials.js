"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";
import { enrichTestimonial } from "../lib/testimonialCopy";

function StarRating({ value = 5 }) {
  const n = Math.min(5, Math.max(1, Math.round(value)));
  return (
    <div
      className="mb-5 flex items-center gap-1.5 md:mb-6"
      aria-label={`${n} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={1.5}
          className={
            i < n
              ? "fill-[#C9A227] text-[#C9A227]"
              : "fill-transparent text-white/25"
          }
        />
      ))}
      <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A0A0A0]">
        {n}.0
      </span>
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) return;
        const resData = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setReviews(resData.map((item, idx) => enrichTestimonial(item, idx)));
        }
      } catch {
        // hide when unavailable
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const prev = () => {
    setActive((i) => (i === 0 ? reviews.length - 1 : i - 1));
  };

  const next = () => {
    setActive((i) => (i === reviews.length - 1 ? 0 : i + 1));
  };

  const review = reviews[active] || reviews[0];

  return (
    <>
      <StackPanel className="bg-[#050505]">
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
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <p className="scene-label mb-4">07 — Testimonials</p>
          <h2 className="display-xl max-w-3xl text-[clamp(2rem,6vw,5rem)] text-[#F5F5F5]">
            What Our Clients Say
          </h2>
        </div>
      </StackPanel>

      <StackPanel className="bg-[#080808]">
        <div className="absolute inset-0">
          <MediaImage
            src={review.imageUrl || "/hero-gym.png"}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-35"
            fallback="/hero-gym.png"
          />
          <div className="absolute inset-0 bg-[#080808]/80" />
          <div className="cinema-overlay" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-16 md:px-10 md:py-24 lg:px-14">
          <p className="scene-label mb-4 md:mb-5">
            Quote / {String(active + 1).padStart(2, "0")} —{" "}
            {String(reviews.length).padStart(2, "0")}
          </p>

          <StarRating value={review.rating} />

          <blockquote className="max-w-5xl">
            <p
              key={review.id}
              className="font-display text-[clamp(1.15rem,3.2vw,2.85rem)] font-semibold leading-[1.28] tracking-[-0.03em] text-[#F5F5F5] transition-opacity duration-500"
            >
              &ldquo;{review.text}&rdquo;
            </p>

            <footer className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 md:mt-10">
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

              {reviews.length > 1 ? (
                <div className="ml-auto flex items-center gap-4">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#F5F5F5] transition hover:border-[#D9D9D9] hover:bg-white/5"
                    data-cursor="PREV"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="hidden gap-2 sm:flex">
                    {reviews.map((r, i) => (
                      <button
                        key={r.id}
                        type="button"
                        aria-label={`Show quote ${i + 1}`}
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
                    aria-label="Next testimonial"
                    className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#F5F5F5] transition hover:border-[#D9D9D9] hover:bg-white/5"
                    data-cursor="NEXT"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : null}
            </footer>
          </blockquote>
        </div>
      </StackPanel>
    </>
  );
}
