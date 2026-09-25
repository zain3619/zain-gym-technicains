"use client";

import { useEffect } from "react";

/**
 * One flick → exactly one section.
 * After the last panel, native scroll continues into the footer.
 */
export default function SectionScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.remove("section-snap");
    root.classList.add("section-js");

    let animating = false;
    let raf = 0;
    let quiet = 0;
    let lockedUntil = 0;
    let targetIndex = 0;
    let acc = 0;
    let needQuiet = false;
    let lastWheelAt = 0;
    let touchY = 0;
    let touchMoved = false;

    const ANIM_MS = 400;
    const INERTIA_LOCK_MS = 260;
    const QUIET_MS = 140;
    const THRESHOLD = 64;
    const ACTIVE = 36;

    const panels = () =>
      Array.from(document.querySelectorAll("[data-stack-panel]"));

    const getPoints = () => {
      const y = window.scrollY;
      return panels().map((el) =>
        Math.max(0, el.getBoundingClientRect().top + y)
      );
    };

    const nearestIndex = () => {
      const pts = getPoints();
      if (!pts.length) return 0;
      const y = window.scrollY;
      let i = 0;
      let best = Infinity;
      for (let n = 0; n < pts.length; n++) {
        const d = Math.abs(y - pts[n]);
        if (d < best) {
          best = d;
          i = n;
        }
      }
      return i;
    };

    const markPanels = (from, to) => {
      panels().forEach((el, n) => {
        el.classList.toggle("is-active-panel", n === to);
        el.classList.toggle("is-leaving-panel", n === from && from !== to);
        el.classList.toggle("is-entering-panel", n === to && from !== to);
      });
    };

    const clearMotionClasses = () => {
      root.classList.remove("is-section-moving");
      panels().forEach((el) => {
        el.classList.remove("is-leaving-panel", "is-entering-panel");
      });
    };

    const ease = (t) => {
      const x = Math.min(1, Math.max(0, t));
      return 1 - Math.pow(1 - x, 3);
    };

    const scheduleQuietClear = () => {
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        if (performance.now() - lastWheelAt >= QUIET_MS - 8) {
          needQuiet = false;
          acc = 0;
        }
      }, QUIET_MS);
    };

    const finish = (toIndex) => {
      targetIndex = toIndex;
      animating = false;
      acc = 0;
      needQuiet = true;
      lockedUntil = performance.now() + INERTIA_LOCK_MS;
      clearMotionClasses();
      markPanels(toIndex, toIndex);
      scheduleQuietClear();
    };

    const animateTo = (target, fromIndex, toIndex) => {
      cancelAnimationFrame(raf);
      const start = window.scrollY;
      const dist = target - start;

      if (Math.abs(dist) < 1.5) {
        window.scrollTo(0, target);
        finish(toIndex);
        return;
      }

      animating = true;
      acc = 0;
      needQuiet = true;
      lockedUntil = performance.now() + ANIM_MS + INERTIA_LOCK_MS;
      root.classList.add("is-section-moving");
      markPanels(fromIndex, toIndex);

      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / ANIM_MS);
        window.scrollTo(0, start + dist * ease(t));
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          window.scrollTo(0, target);
          finish(toIndex);
        }
      };
      raf = requestAnimationFrame(step);
    };

    const go = (dir, sync = true) => {
      if (!dir) return false;
      if (animating || performance.now() < lockedUntil) return false;

      const pts = getPoints();
      if (!pts.length) return false;

      if (sync) targetIndex = nearestIndex();

      const from = Math.max(0, Math.min(targetIndex, pts.length - 1));
      const next = Math.max(0, Math.min(from + dir, pts.length - 1));
      if (next === from) return false;

      animateTo(pts[next], from, next);
      return true;
    };

    window.__zainSectionGo = go;

    const ignore = (t) =>
      t instanceof Element &&
      !!t.closest(
        "textarea,input,select,[data-lenis-prevent],[data-scroll-ignore]"
      );

    const onWheel = (e) => {
      if (ignore(e.target)) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 5) return;

      lastWheelAt = performance.now();
      const pts = getPoints();
      if (!pts.length) return;

      const y = window.scrollY;
      const lastTop = pts[pts.length - 1];
      const pastLast = y > lastTop + 12;
      const idx = nearestIndex();
      const onLast = idx >= pts.length - 1;

      // Already in footer / page tail — native scroll (snap back near last panel).
      if (pastLast) {
        if (dy < 0 && y - lastTop < window.innerHeight * 0.35) {
          e.preventDefault();
          e.stopPropagation();
          if (!animating && performance.now() >= lockedUntil) {
            needQuiet = false;
            acc = 0;
            targetIndex = pts.length - 1;
            animateTo(lastTop, pts.length - 1, pts.length - 1);
          }
        }
        return;
      }

      // Last section + scroll down → release into footer (Pricing / Footer).
      if (onLast && dy > 0 && !animating) {
        if (performance.now() < lockedUntil) {
          e.preventDefault();
          e.stopPropagation();
          scheduleQuietClear();
          return;
        }
        if (needQuiet && Math.abs(dy) < ACTIVE) {
          e.preventDefault();
          e.stopPropagation();
          scheduleQuietClear();
          return;
        }
        needQuiet = false;
        acc = 0;
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (animating || performance.now() < lockedUntil) {
        scheduleQuietClear();
        return;
      }

      if (needQuiet) {
        if (Math.abs(dy) >= ACTIVE) {
          needQuiet = false;
          acc = dy;
        } else {
          scheduleQuietClear();
          return;
        }
      } else {
        if (acc !== 0 && Math.sign(acc) !== Math.sign(dy)) acc = 0;
        acc += dy;
      }

      if (Math.abs(acc) < THRESHOLD) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      go(dir);
    };

    const onKey = (e) => {
      if (ignore(e.target)) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " ") dir = e.shiftKey ? -1 : 1;
      else return;

      const pts = getPoints();
      const onLast = nearestIndex() >= pts.length - 1;
      const pastLast = pts.length && window.scrollY > pts[pts.length - 1] + 12;

      if ((onLast || pastLast) && dir > 0) {
        // Let page scroll into footer naturally via a nudge.
        window.scrollBy({ top: Math.min(window.innerHeight * 0.85, 600), left: 0, behavior: "smooth" });
        e.preventDefault();
        return;
      }

      e.preventDefault();
      needQuiet = false;
      acc = 0;
      go(dir);
    };

    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? 0;
      touchMoved = false;
    };
    const onTouchMove = (e) => {
      if (ignore(e.target)) return;
      const dy = (e.touches[0]?.clientY ?? touchY) - touchY;
      if (Math.abs(dy) <= 8) return;

      touchMoved = true;
      const pts = getPoints();
      const y = window.scrollY;
      const lastTop = pts[pts.length - 1] ?? 0;
      const pastLast = y > lastTop + 12;
      const onLast = nearestIndex() >= pts.length - 1;

      // Allow native touch scroll in footer / off the last panel downward.
      if (pastLast) return;
      if (onLast && dy < 0 && performance.now() >= lockedUntil) return;

      e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (ignore(e.target) || !touchMoved) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      if (Math.abs(dy) < 36) return;

      const pts = getPoints();
      const y = window.scrollY;
      const lastTop = pts[pts.length - 1] ?? 0;
      if (y > lastTop + 12) return;
      if (nearestIndex() >= pts.length - 1 && dy > 0) return;

      needQuiet = false;
      acc = 0;
      go(dy > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchend", onTouchEnd, {
      passive: true,
      capture: true,
    });

    const boot = window.setTimeout(() => {
      targetIndex = nearestIndex();
      const pts = getPoints();
      if (pts[targetIndex] != null) {
        window.scrollTo(0, pts[targetIndex]);
        markPanels(targetIndex, targetIndex);
      }
    }, 50);

    return () => {
      delete window.__zainSectionGo;
      window.clearTimeout(boot);
      window.clearTimeout(quiet);
      cancelAnimationFrame(raf);
      clearMotionClasses();
      root.classList.remove("section-js", "is-section-moving");
      root.classList.add("section-snap");
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("touchend", onTouchEnd, true);
    };
  }, []);

  return null;
}
