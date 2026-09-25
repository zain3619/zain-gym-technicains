"use client";

/**
 * Full-viewport section — stable 100vh + snap-stop so one scroll = one panel.
 */
export default function StackPanel({
  children,
  z = 1,
  id,
  className = "",
  as: Tag = "section",
  sticky = false,
  ...rest
}) {
  const hasBg = /\bbg-\[|#|bg-black|bg-neutral|bg-zinc|bg-slate|bg-gray/.test(
    className
  );

  return (
    <Tag
      id={id}
      className={[
        "relative isolate h-screen min-h-screen w-full overflow-hidden",
        "snap-start snap-always",
        hasBg ? "" : "bg-[#050505]",
        sticky ? "lg:sticky lg:top-0" : "",
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
