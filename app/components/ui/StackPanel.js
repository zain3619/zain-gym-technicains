"use client";

/**
 * Full-viewport section — stable dvh + snap-stop so one scroll = one panel.
 * compactMobile: shorter landscape frame on small screens (before/after splits).
 */
export default function StackPanel({
  children,
  z = 1,
  id,
  className = "",
  as: Tag = "section",
  sticky = false,
  compactMobile = false,
  ...rest
}) {
  const hasBg = /\bbg-\[|#|bg-black|bg-neutral|bg-zinc|bg-slate|bg-gray/.test(
    className
  );

  return (
    <Tag
      id={id}
      className={[
        "stack-panel relative isolate w-full overflow-hidden",
        "snap-start snap-always",
        hasBg ? "" : "bg-[#050505]",
        sticky ? "lg:sticky lg:top-0" : "",
        compactMobile
          ? "max-lg:aspect-[3/2] max-lg:h-auto max-lg:min-h-0 lg:h-[100dvh] lg:min-h-[100dvh]"
          : "h-[100dvh] min-h-[100dvh]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        zIndex: sticky ? z : undefined,
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
      data-stack-panel=""
      {...rest}
    >
      {children}
    </Tag>
  );
}
