"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { COMPANY_NAME } from "../lib/seo";

const NAV_ITEMS = [
  { name: "Home", href: "/#home", sectionId: "home" },
  { name: "About", href: "/#about", sectionId: "about" },
  { name: "Services", href: "/#services", sectionId: "services" },
  { name: "Projects", href: "/#projects", sectionId: "projects" },
  { name: "Team", href: "/#team", sectionId: "team" },
  { name: "Contact", href: "/contact", sectionId: null },
];

function scrollToSection(sectionId) {
  if (!sectionId || typeof window === "undefined") return false;
  if (typeof window.__zainSectionGoToId === "function") {
    return Boolean(window.__zainSectionGoToId(sectionId));
  }
  const el = document.getElementById(sectionId);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!onHome) {
      setActiveSection(null);
      return undefined;
    }

    const sectionIds = NAV_ITEMS.map((i) => i.sectionId).filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.55],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  const handleNavClick = (e, item) => {
    if (!item.sectionId) {
      setIsOpen(false);
      return;
    }

    if (onHome) {
      e.preventDefault();
      setActiveSection(item.sectionId);
      setIsOpen(false);
      scrollToSection(item.sectionId);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `/#${item.sectionId}`);
      }
      return;
    }

    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-[200] w-full bg-transparent py-4 md:py-5">
      <nav className="relative z-[230] mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 md:px-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-14">
        {/* Left — logo */}
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2.5"
          data-cursor="HOME"
          onClick={() => setIsOpen(false)}
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/12 bg-[#111] md:h-11 md:w-11">
            <Image
              src="/icon.png"
              alt=""
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[14px] font-normal uppercase tracking-[0.06em] text-white md:text-[15px]">
              Zain Gym
            </span>
            <span className="mt-0.5 block text-[8px] font-normal uppercase tracking-[0.32em] text-[#A0A0A0] transition-colors group-hover:text-[#D9D9D9] md:text-[9px]">
              Technicians
            </span>
          </span>
          <span className="sr-only">{COMPANY_NAME}</span>
        </Link>

        {/* Center — glass pill (desktop) */}
        <ul
          className="hidden items-center gap-0.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1.5 shadow-lg backdrop-blur-xl lg:flex"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.25) 100%)",
            backgroundColor: "rgba(18,18,18,0.45)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.45), 0 12px 40px rgba(0,0,0,0.4)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.sectionId === null
                ? pathname === "/contact"
                : onHome && activeSection === item.sectionId;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  data-cursor="OPEN"
                  onClick={(e) => handleNavClick(e, item)}
                  className={`block rounded-full px-[1.05rem] py-2 text-[13px] font-normal tracking-[-0.01em] transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-[#C8C8C8] hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right — CTA + mobile toggle (stays above overlay) */}
        <div className="flex shrink-0 items-center justify-end gap-3 lg:justify-self-end">
          <Link
            href="/contact"
            data-cursor="CONTACT"
            className="group/cta hidden items-center gap-2 rounded-full bg-gradient-to-b from-[#F5F5F5] to-[#C8C8C8] px-5 py-2.5 text-[13px] font-medium tracking-[-0.01em] text-[#050505] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[filter,transform] duration-300 hover:brightness-105 lg:inline-flex"
          >
            Get a Quote
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </Link>

          <button
            type="button"
            className="relative z-[240] flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.25) 100%)",
              backgroundColor: "rgba(18,18,18,0.55)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            data-cursor="MENU"
          >
            <span className="relative block h-[12px] w-[15px]">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                  isOpen ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[5px] block h-px w-full bg-current transition-opacity duration-200 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                  isOpen ? "top-[5px] -rotate-45" : "top-[10px]"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[220] flex flex-col lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(20,20,20,0.96) 0%, rgba(8,8,8,0.98) 100%)",
            backgroundColor: "#0a0a0a",
          }}
        >
          <div className="h-[76px] shrink-0" />

          <div className="flex min-h-0 flex-1 flex-col px-6 pb-8">
            <p className="mb-5 text-[10px] font-normal uppercase tracking-[0.28em] text-[#888]">
              Menu
            </p>

            <nav className="min-h-0 flex-1 overflow-y-auto">
              <ul className="m-0 list-none p-0">
                {NAV_ITEMS.map((item, index) => {
                  const isActive =
                    item.sectionId === null
                      ? pathname === "/contact"
                      : onHome && activeSection === item.sectionId;
                  return (
                    <li key={item.name} className="m-0 p-0">
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item)}
                        className={`block border-b border-white/10 py-4 no-underline ${
                          isActive ? "text-white" : "text-white/90"
                        }`}
                        style={{
                          animation: `menuItemIn 0.35s ease both`,
                          animationDelay: `${index * 40}ms`,
                        }}
                      >
                        <span className="font-display text-[22px] font-normal uppercase leading-none tracking-[-0.02em] text-white">
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-6 flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#F5F5F5] to-[#C8C8C8] text-[13px] font-medium tracking-[-0.01em] text-[#050505]"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
