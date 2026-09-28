"use client";

/**
 * Layout-matched loading skeletons for full-bleed stack panels.
 * variant: "hero" | "panel" | "split"
 */
export default function PanelSkeleton({ variant = "panel", className = "" }) {
  if (variant === "hero") {
    return (
      <div
        className={`absolute inset-0 z-[5] bg-[#050505] ${className}`}
        aria-hidden
      >
        <div className="panel-skel-shine absolute inset-0" />
        <div className="panel-copy panel-copy--center pointer-events-none">
          <div className="max-w-5xl w-full">
            <div className="panel-skel-bar mb-6 h-3 w-48 md:mb-8 md:w-72" />
            <div className="panel-skel-bar h-12 w-[92%] max-w-3xl md:h-20 lg:h-28" />
            <div className="panel-skel-bar mt-3 h-12 w-[70%] max-w-2xl md:mt-4 md:h-16 lg:h-20" />
            <div className="panel-skel-bar mt-5 h-4 w-[55%] max-w-xl md:mt-8" />
            <div className="panel-skel-bar mt-2 h-4 w-[40%] max-w-md" />
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:mt-12 md:justify-start md:gap-4">
              <div className="panel-skel-bar h-11 w-36 rounded-lg" />
              <div className="panel-skel-bar h-11 w-36 rounded-lg opacity-70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div
        className={`absolute inset-0 z-[5] grid grid-cols-2 bg-[#080808] ${className}`}
        aria-hidden
      >
        <div className="relative border-r border-white/5">
          <div className="panel-skel-shine absolute inset-0" />
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8">
            <div className="panel-skel-bar mb-3 h-2.5 w-24" />
            <div className="panel-skel-bar h-8 w-[85%]" />
            <div className="panel-skel-bar mt-2 h-8 w-[60%]" />
            <div className="mt-5 flex gap-4">
              <div className="panel-skel-bar h-2.5 w-16" />
              <div className="panel-skel-bar h-2.5 w-20" />
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="panel-skel-shine absolute inset-0 opacity-70" />
        </div>
      </div>
    );
  }

  // Generic full-bleed panel (about / services / process / etc.)
  return (
    <div
      className={`absolute inset-0 z-[5] bg-[#080808] ${className}`}
      aria-hidden
    >
      <div className="panel-skel-shine absolute inset-0" />
      <div className="panel-copy panel-copy--center pointer-events-none">
        <div className="w-full max-w-4xl">
          <div className="panel-skel-bar mb-4 h-2.5 w-36 md:mb-6" />
          <div className="panel-skel-bar h-10 w-[90%] max-w-3xl md:h-16 lg:h-20" />
          <div className="panel-skel-bar mt-3 h-10 w-[65%] max-w-2xl md:h-14" />
          <div className="panel-skel-bar mt-6 h-3.5 w-[50%] max-w-lg md:mt-8" />
          <div className="panel-skel-bar mt-2 h-3.5 w-[40%] max-w-md" />
        </div>
      </div>
    </div>
  );
}
