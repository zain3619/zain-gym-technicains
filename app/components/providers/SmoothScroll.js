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
      lerp: 0.1,
      smoothWheel: false,
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
    let snapPoints = [];

    const getDocumentTop = (el) => {
      // offsetTop chain — works with position:sticky (getBoundingClientRect does not)
      let top = 0;
      let node = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent;
      }
      return top;
    };

    const measureSnaps = () => {
      const panels = Array.from(
        document.querySelectorAll("[data-stack-panel]")
      );
      const points = panels.map((el) =>
        Math.max(0, Math.round(getDocumentTop(el)))
      );

      const unique = [];
      for (const y of points.sort((a, b) => a - b)) {
        if (!unique.length || Math.abs(unique[unique.length - 1] - y) > 4) {
          unique.push(y);
        }
      }

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      if (unique.length && maxScroll - unique[unique.length - 1] > 64) {
        unique.push(maxScroll);
      }

      snapPoints = unique.length ? unique : [0];
    };

    const scrollYNow = () =>
      typeof lenis.scroll === "number" ? lenis.scroll : window.scrollY;

    const currentIndex = () => {
      const y = scrollYNow();
      let idx = 0;
      for (let i = 0; i < snapPoints.length; i++) {
        if (y + 6 >= snapPoints[i]) idx = i;
        else break;
      }
      return idx;
    };

    const goTo = (index) => {
      if (!snapPoints.length) measureSnaps();
      const next = Math.max(0, Math.min(index, snapPoints.length - 1));
      const target = snapPoints[next];

      locked = true;
      window.clearTimeout(unlockTimer);

      lenis.scrollTo(target, {
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        force: true,
        lock: true,
        onComplete: () => {
          // Hard land exactly — kills half-panel drift
          window.scrollTo(0, target);
          locked = false;
        },
      });

      // Safety unlock if onComplete misses
      unlockTimer = window.setTimeout(() => {
        window.scrollTo(0, target);
        locked = false;
      }, 1000);
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
      if (window.location.pathname !== "/") return;
      if (shouldIgnore(event.target)) return;
      if (Math.abs(event.deltaY) < 8) return;

      event.preventDefault();
      event.stopPropagation();
      if (locked) return;

      measureSnaps();
      const dir = event.deltaY > 0 ? 1 : -1;
      goTo(currentIndex() + dir);
    };

    const onKey = (event) => {
      if (window.location.pathname !== "/") return;
      if (shouldIgnore(event.target)) return;

      let dir = 0;
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        dir = 1;
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        dir = -1;
      }
      if (!dir) return;

      event.preventDefault();
      if (locked) return;
      measureSnaps();
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
      if (Math.abs(delta) < 56) return;
      measureSnaps();
      goTo(currentIndex() + (delta > 0 ? 1 : -1));
    };

    measureSnaps();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    const onResize = () => {
      measureSnaps();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    const refreshTimer = window.setTimeout(() => {
      measureSnaps();
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.clearTimeout(unlockTimer);
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", onResize);
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
