"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MediaImage from "./ui/MediaImage";
import StackPanel from "./ui/StackPanel";

const PRICING_Z = 70;
const PRICING_BG = "/pricing-bg.webp";

const LOCAL_PLANS = [
  {
    _id: "p1",
    name: "Starter Setup",
    price: "PKR 2.5M+",
    billingPeriod: "project",
    isFeatured: false,
    features: ["Layout consult", "Core equipment package", "Basic install"],
  },
  {
    _id: "p2",
    name: "Commercial Build",
    price: "PKR 5M+",
    billingPeriod: "project",
    isFeatured: true,
    features: [
      "3D design",
      "Full equipment supply",
      "Install + staff plan",
    ],
  },
  {
    _id: "p3",
    name: "Turnkey Elite",
    price: "Custom",
    billingPeriod: "quote",
    isFeatured: false,
    features: [
      "End-to-end gym build",
      "Premium lines",
      "Launch + after-sales",
    ],
  },
];

export default function Pricing() {
  const [plans, setPlans] = useState(LOCAL_PLANS);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/pricing");
        if (!response.ok) return;
        const resData = await response.json();
        if (Array.isArray(resData) && resData.length > 0) {
          setPlans(resData);
        }
      } catch {
        // keep local plans
      }
    };
    fetchPlans();
  }, []);

  return (
    <StackPanel id="membership" z={PRICING_Z} className="bg-[#080808]">
      <div className="absolute inset-0">
        <MediaImage
          src={PRICING_BG}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          fallback={PRICING_BG}
        />
        <div className="absolute inset-0 bg-[#080808]/80" />
        <div className="cinema-overlay" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-8 pt-20 md:justify-center md:px-10 md:py-16 lg:px-14">
        <div className="mb-5 shrink-0 text-center md:mb-10 md:text-left">
          <p className="scene-label mb-2 md:mb-4">08 — Packages</p>
          <h2 className="display-xl text-[clamp(1.9rem,6vw,5rem)] text-[#F5F5F5]">
            Pricing Packages
          </h2>
        </div>

        <div
          data-scroll-ignore
          className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto md:flex-none md:space-y-0 md:overflow-visible md:divide-y md:divide-white/10 md:border-y md:border-white/10"
        >
          {plans.map((plan) => (
            <article
              key={plan._id || plan.name}
              className="border border-white/10 bg-[#050505]/55 px-4 py-5 text-center backdrop-blur-sm md:grid md:gap-10 md:border-0 md:bg-transparent md:px-0 md:py-8 md:text-left md:backdrop-blur-none md:grid-cols-[1.1fr_0.7fr_0.9fr] md:items-center"
              data-cursor="OPEN"
            >
              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start md:gap-3">
                  <h3 className="font-display text-lg font-bold uppercase tracking-[-0.03em] text-[#F5F5F5] md:text-3xl">
                    {plan.name}
                  </h3>
                  {plan.isFeatured ? (
                    <span className="border border-[#BDBDBD]/50 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#D9D9D9] md:text-[9px]">
                      Featured
                    </span>
                  ) : null}
                </div>
                {Array.isArray(plan.features) && plan.features.length > 0 ? (
                  <ul className="mt-3 space-y-1.5 md:mt-4 md:space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-[13px] text-[#A0A0A0] before:mr-2 before:text-[#BDBDBD] before:content-['—'] md:text-sm before:md:mr-3"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="mt-4 md:mt-0">
                <p className="font-body text-[1.65rem] font-bold leading-none tracking-tight text-[#D9D9D9] tabular-nums md:text-5xl md:leading-none">
                  {plan.price}
                </p>
                {plan.billingPeriod ? (
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-[#A0A0A0] md:mt-2 md:text-[11px]">
                    / {plan.billingPeriod}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 flex justify-center md:mt-0 md:justify-self-end">
                <Link
                  href="/contact"
                  className="btn-silver inline-flex min-w-[140px] justify-center px-6 py-2.5 text-[10px]"
                >
                  Inquire
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </StackPanel>
  );
}
