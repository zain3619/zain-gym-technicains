"use client";

import { useEffect } from "react";

/**
 * One deliberate flick → exactly one panel.
 * Trackpad inertia must NOT chain into the next section.
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
    let pointsCache = [];
    let pointsAt = 0;

    const ANIM_MS = 420;
    /** After landing, ignore wheels so trackpad inertia can't skip ahead */
    const SETTLE_MS = 380;
    /** No-wheel gap required before the next gesture is accepted */
    const QUIET_MS = 220;
    const THRESHOLD = 60;
    const TOUCH_MIN = 40;

    const panels = () =>
      Array.from(document.querySelectorAll("[data-stack-panel]"));

    const measurePoints = () => {
      const els = panels();
      const pts = els.map((el) => {
        const rectTop = el.getBoundingClientRect().top + window.scrollY;
        return Math.max(0, Math.round(rectTop));
      });
      pointsCache = pts;
      pointsAt = performance.now();
      return pts;
    };

    const getPoints = () => {
      if (performance.now() - pointsAt > 120 || !pointsCache.length) {
        return measurePoints();
      }
      return pointsCache;
    };

    const nearestIndex = () => {
      const pts = getPoints();
      if (!pts.length) return 0;
      const y = window.scrollY;
      const gate = y + window.innerHeight * 0.28;
      let i = 0;
      for (let n = 0; n < pts.length; n++) {
        if (pts[n] <= gate + 1) i = n;
        else break;
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

    const armQuiet = () => {
      needQuiet = true;
      acc = 0;
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        // Only release quiet if wheels truly stopped
        if (performance.now() - lastWheelAt >= QUIET_MS - 10) {
          needQuiet = false;
          acc = 0;
        } else {
          armQuiet();
        }
      }, QUIET_MS);
    };

    const finish = (toIndex) => {
      const pts = measurePoints();
      const target = pts[toIndex] ?? window.scrollY;
      window.scrollTo(0, target);
      targetIndex = toIndex;
      animating = false;
      acc = 0;
      lockedUntil = performance.now() + SETTLE_MS;
      clearMotionClasses();
      markPanels(toIndex, toIndex);
      armQuiet();
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
      targetIndex = toIndex;
      lockedUntil = performance.now() + ANIM_MS + SETTLE_MS;
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

    const go = (dir) => {
      if (!dir) return false;
      if (animating || performance.now() < lockedUntil) return false;

      const pts = measurePoints();
      if (!pts.length) return false;

      const nearTarget =
        pts[targetIndex] != null &&
        Math.abs(window.scrollY - pts[targetIndex]) < window.innerHeight * 0.45;
      const from = nearTarget
        ? targetIndex
        : Math.max(0, Math.min(nearestIndex(), pts.length - 1));

      const next = Math.max(0, Math.min(from + dir, pts.length - 1));
      if (next === from) return false;

      animateTo(pts[next], from, next);
      return true;
    };

    const goToIndex = (index) => {
      const pts = measurePoints();
      if (!pts.length) return false;
      const next = Math.max(0, Math.min(index, pts.length - 1));
      const from = nearestIndex();
      if (next === from && Math.abs(window.scrollY - pts[next]) < 2) {
        targetIndex = next;
        markPanels(next, next);
        return true;
      }
      needQuiet = false;
      acc = 0;
      lockedUntil = 0;
      animateTo(pts[next], from, next);
      return true;
    };

    const goToId = (id) => {
      if (!id) return false;
      const els = panels();
      const index = els.findIndex((el) => el.id === id);
      if (index < 0) return false;
      return goToIndex(index);
    };

    window.__zainSectionGo = go;
    window.__zainSectionGoTo = goToIndex;
    window.__zainSectionGoToId = goToId;

    const ignoreForm = (t) =>
      t instanceof Element &&
      !!t.closest("textarea,input,select,[data-lenis-prevent]");

    const nestedScrollConsumes = (target, dy) => {
      if (!(target instanceof Element)) return false;
      const el = target.closest(
        "[data-scroll-ignore], .overflow-y-auto, .overflow-y-scroll"
      );
      if (!el) return false;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 4) return false;
      if (dy > 0 && el.scrollTop < max - 2) return true;
      if (dy < 0 && el.scrollTop > 2) return true;
      return false;
    };

    const nearTargetIndex = (pts) => {
      if (
        pts[targetIndex] != null &&
        Math.abs(window.scrollY - pts[targetIndex]) < window.innerHeight * 0.45
      ) {
        return targetIndex;
      }
      return nearestIndex();
    };

    const onWheel = (e) => {
      if (ignoreForm(e.target)) return;
      const dy = e.deltaY;
      if (Math.abs(dy) < 3) return;

      if (nestedScrollConsumes(e.target, dy)) return;

      lastWheelAt = performance.now();
      const pts = getPoints();
      if (!pts.length) return;

      const y = window.scrollY;
      const lastTop = pts[pts.length - 1];
      const pastLast = y > lastTop + 12;
      const idx = nearTargetIndex(pts);
      const onLast = idx >= pts.length - 1;

      if (pastLast) {
        if (dy < 0 && y - lastTop < window.innerHeight * 0.4) {
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

      // Last panel + down → native footer scroll (after settle)
      if (onLast && dy > 0 && !animating) {
        if (performance.now() < lockedUntil || needQuiet) {
          e.preventDefault();
          e.stopPropagation();
          armQuiet();
          return;
        }
        acc = 0;
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Swallow everything while tweening / settling — no queue (prevents skip)
      if (animating || performance.now() < lockedUntil) {
        return;
      }

      // Wait for trackpad inertia to die before accepting the next flick
      if (needQuiet) {
        armQuiet();
        return;
      }

      if (acc !== 0 && Math.sign(acc) !== Math.sign(dy)) acc = 0;
      acc += dy;

      if (Math.abs(acc) < THRESHOLD) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0;
      go(dir);
    };

    const onKey = (e) => {
      if (ignoreForm(e.target)) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " ") dir = e.shiftKey ? -1 : 1;
      else return;

      const pts = getPoints();
      const idx = nearTargetIndex(pts);
      const onLast = idx >= pts.length - 1;
      const pastLast = pts.length && window.scrollY > pts[pts.length - 1] + 12;

      if ((onLast || pastLast) && dir > 0) {
        if (performance.now() < lockedUntil || needQuiet) {
          e.preventDefault();
          return;
        }
        window.scrollBy({
          top: Math.min(window.innerHeight * 0.85, 600),
          left: 0,
          behavior: "smooth",
        });
        e.preventDefault();
        return;
      }

      e.preventDefault();
      if (animating || performance.now() < lockedUntil || needQuiet) return;
      acc = 0;
      go(dir);
    };

    const onTouchStart = (e) => {
      touchY = e.touches[0]?.clientY ?? 0;
      touchMoved = false;
    };
    const onTouchMove = (e) => {
      if (ignoreForm(e.target)) return;
      const dy = (e.touches[0]?.clientY ?? touchY) - touchY;
      if (Math.abs(dy) <= 8) return;

      if (nestedScrollConsumes(e.target, -dy)) return;

      touchMoved = true;
      const pts = getPoints();
      const y = window.scrollY;
      const lastTop = pts[pts.length - 1] ?? 0;
      const pastLast = y > lastTop + 12;
      const onLast = nearTargetIndex(pts) >= pts.length - 1;

      if (pastLast) return;
      if (onLast && dy < 0 && performance.now() >= lockedUntil && !needQuiet)
        return;

      e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (ignoreForm(e.target) || !touchMoved) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      if (Math.abs(dy) < TOUCH_MIN) return;

      const pts = getPoints();
      const y = window.scrollY;
      const lastTop = pts[pts.length - 1] ?? 0;
      if (y > lastTop + 12) return;
      if (nearTargetIndex(pts) >= pts.length - 1 && dy > 0) return;

      if (animating || performance.now() < lockedUntil || needQuiet) return;
      acc = 0;
      go(dy > 0 ? 1 : -1);
    };

    const onResize = () => {
      measurePoints();
      if (!animating && pointsCache[targetIndex] != null) {
        window.scrollTo(0, pointsCache[targetIndex]);
      }
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
    window.addEventListener("resize", onResize);

    const boot = window.setTimeout(() => {
      const hashId = window.location.hash.replace(/^#/, "");
      const els = panels();
      const hashIndex = hashId
        ? els.findIndex((el) => el.id === hashId)
        : -1;
      measurePoints();
      targetIndex = hashIndex >= 0 ? hashIndex : nearestIndex();
      const pts = pointsCache;
      if (pts[targetIndex] != null) {
        window.scrollTo(0, pts[targetIndex]);
        markPanels(targetIndex, targetIndex);
      }
    }, 50);

    return () => {
      delete window.__zainSectionGo;
      delete window.__zainSectionGoTo;
      delete window.__zainSectionGoToId;
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
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
