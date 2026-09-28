"use client";

import Image from "next/image";
import { Toaster, ToastBar } from "react-hot-toast";
import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";

function BrandedToaster() {
  return (
    <Toaster
      position="bottom-right"
      gutter={12}
      containerStyle={{ bottom: 24, right: 24 }}
      toastOptions={{
        duration: 4500,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          maxWidth: "380px",
        },
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            animation: t.visible
              ? "toast-in 0.35s ease forwards"
              : "toast-out 0.25s ease forwards",
          }}
        >
          {({ message }) => (
            <div
              className={`flex min-w-[280px] max-w-[360px] items-center gap-3.5 rounded-2xl border px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md ${
                t.type === "error"
                  ? "border-red-400/25 bg-[#120808]/95"
                  : "border-white/15 bg-[#0D0D0D]/95"
              }`}
              role="status"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#111]">
                <Image
                  src="/icon.png"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 pr-1">
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    t.type === "error" ? "text-red-300" : "text-[#D9D9D9]"
                  }`}
                >
                  {t.type === "error"
                    ? "Error"
                    : t.type === "success"
                      ? "Success"
                      : "Notice"}
                </p>
                <div className="mt-1 font-display text-[13px] font-semibold leading-snug tracking-[-0.01em] text-[#F5F5F5] [&>*]:!m-0 [&>*]:!justify-start [&>*]:!text-[#F5F5F5]">
                  {message}
                </div>
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

export default function ExperienceProviders({ children }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      {children}
      <BrandedToaster />
    </SmoothScroll>
  );
}
