"use client";

import { useEffect, useState } from "react";

/**
 * Soft page enter animation on route changes (Home ↔ Contact, etc.).
 * Class is removed after the animation so it cannot leave a transform
 * containing-block that would break the fixed navbar.
 * Skipped while the brand intro lock is active so the splash paints fully opaque.
 */
export default function Template({ children }) {
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introLock = document.documentElement.classList.contains(
      "brand-intro-lock"
    );
    if (reduce || introLock) {
      setEnter(false);
      return undefined;
    }

    const root = document.documentElement;
    root.classList.remove("page-leave");
    root.classList.add("page-enter");
    setEnter(true);
    const t = window.setTimeout(() => {
      root.classList.remove("page-enter");
      setEnter(false);
    }, 520);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={enter ? "page-shell animate-page-in" : "page-shell"}>
      {children}
    </div>
  );
}
