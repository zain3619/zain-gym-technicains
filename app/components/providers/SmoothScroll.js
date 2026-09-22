"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 1023px)").matches;

    // Mobile/tablet: native scroll only
    if (prefersReducedMotion || isCoarse) {
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: false, // we control wheel ourselves (one screen / gesture)
      syncTouch: false,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    let locked = false;
    let unlockTimer = 0;
    let touchStartY = 0;

    const panelHeight = () => window.innerHeight;

    const maxIndex = () => {
      const h = panelHeight();
      if (h <= 0) return 0;
      return Math.max(
        0,
        Math.round((document.documentElement.scrollHeight - h) / h)
      );
    };

    const currentIndex = () => {
      const h = panelHeight();
      return Math.round(window.scrollY / h);
    };

    const goTo = (index) => {
      const next = Math.max(0, Math.min(index, maxIndex()));
      locked = true;
      window.clearTimeout(unlockTimer);

      lenis.scrollTo(next * panelHeight(), {
        duration: 0.95,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        force: true,
        lock: true,
      });

      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, 1050);
    };

    const shouldIgnore = (target) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "textarea, input, select, [data-lenis-prevent], [data-scroll-ignore]"
        )
      );
    };

    const onWheel = (event) => {
      // Only full-page snap on the marketing home page
      if (window.location.pathname !== "/") return;
      if (shouldIgnore(event.target)) return;
      if (Math.abs(event.deltaY) < 6) return;

      event.preventDefault();
      if (locked) return;

      const dir = event.deltaY > 0 ? 1 : -1;
      goTo(currentIndex() + dir);
    };

    const onKey = (event) => {
      if (window.location.pathname !== "/") return;
      if (shouldIgnore(event.target)) return;

      let dir = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        dir = 1;
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        dir = -1;
      }
      if (!dir) return;

      event.preventDefault();
      if (locked) return;
      goTo(currentIndex() + dir);
    };

    const onTouchStart = (event) => {
      if (window.location.pathname !== "/") return;
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event) => {
      if (window.location.pathname !== "/") return;
      if (locked) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      if (Math.abs(delta) < 48) return;
      goTo(currentIndex() + (delta > 0 ? 1 : -1));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    const refreshTimer = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(unlockTimer);
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return children;
}
