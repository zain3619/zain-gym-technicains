"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StackPanel from "./ui/StackPanel";

const PRICING_Z = 70;

export default function Pricing() {
  const [plans, setPlans] = useState([]);

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
        // hide when unavailable
      }
    };
    fetchPlans();
  }, []);

  if (plans.length === 0) return null;

  return (
    <StackPanel id="membership" z={PRICING_Z} className="bg-[#080808]">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 py-20 md:px-10 lg:px-14">
        <p className="scene-label mb-4">08 — Membership / Packages</p>
        <h2 className="display-xl mb-12 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-[#F5F5F5]">
          Pricing Packages
        </h2>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {plans.map((plan) => (
            <article
              key={plan._id || plan.name}
              className="grid gap-6 py-8 md:grid-cols-[1.1fr_0.7fr_0.9fr] md:items-center md:gap-10"
              data-cursor="OPEN"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.03em] text-[#F5F5F5] md:text-3xl">
                    {plan.name}
                  </h3>
                  {plan.isFeatured ? (
                    <span className="border border-[#BDBDBD]/50 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D9D9D9]">
                      Featured
                    </span>
                  ) : null}
                </div>
                {Array.isArray(plan.features) && plan.features.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-[#A0A0A0] before:mr-3 before:text-[#BDBDBD] before:content-['—']"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div>
                <p className="font-display text-4xl font-bold tracking-tight text-[#D9D9D9] md:text-5xl">
                  {plan.price}
                </p>
                {plan.billingPeriod ? (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#A0A0A0]">
                    / {plan.billingPeriod}
                  </p>
                ) : null}
              </div>
              <div className="md:justify-self-end">
                <Link href="/contact" className="btn-silver">
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
