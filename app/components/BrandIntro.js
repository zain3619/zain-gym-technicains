"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { COMPANY_NAME } from "../lib/seo";

const INTRO_MS = 5600;

function navType() {
  try {
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    if (nav?.type) return nav.type;
    if (typeof performance !== "undefined" && performance.navigation) {
      const t = performance.navigation.type;
      if (t === 1) return "reload";
      if (t === 2) return "back_forward";
      return "navigate";
    }
  } catch {
    // ignore
  }
  return "navigate";
}

/**
 * Welcome intro on fresh link entry to home.
 * Skipped on refresh / back-forward / in-app return to home.
 */
export default function BrandIntro() {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.__zainIntroHandled) return undefined;

    const type = navType();
    window.__zainIntroHandled = true;

    if (type === "reload" || type === "back_forward") {
      document.documentElement.classList.remove("brand-intro-lock");
      return undefined;
    }

    document.documentElement.classList.add("brand-intro-lock");
    setOpen(true);

    const exitAt = window.setTimeout(() => setExiting(true), INTRO_MS - 900);
    const doneAt = window.setTimeout(() => {
      document.documentElement.classList.remove("brand-intro-lock");
      setOpen(false);
    }, INTRO_MS);

    return () => {
      window.clearTimeout(exitAt);
      window.clearTimeout(doneAt);
      document.documentElement.classList.remove("brand-intro-lock");
    };
  }, []);

  const skip = () => {
    document.documentElement.classList.remove("brand-intro-lock");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className={`brand-intro is-play ${exiting ? "is-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Welcome to ${COMPANY_NAME}`}
    >
      <div className="brand-intro__veil" aria-hidden />
      <div className="brand-intro__grain" aria-hidden />
      <div className="brand-intro__ring" aria-hidden />

      <div className="brand-intro__stage">
        <div className="brand-intro__logo">
          <Image
            src="/icon.png"
            alt=""
            width={104}
            height={104}
            priority
            className="brand-intro__logo-img"
          />
        </div>

        <p className="brand-intro__eyebrow">Welcome to</p>

        <h1 className="brand-intro__title">
          <span className="brand-intro__line">Zain Gym</span>
          <span className="brand-intro__line brand-intro__line--accent">
            Technicians
          </span>
        </h1>

        <div className="brand-intro__rule" aria-hidden />

        <p className="brand-intro__sub">Portfolio</p>
      </div>

      <button type="button" className="brand-intro__skip" onClick={skip}>
        Skip
      </button>
    </div>
  );
}
