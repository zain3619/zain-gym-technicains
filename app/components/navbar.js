"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COMPANY_NAME } from "../lib/seo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "/#home", isActive: pathname === "/" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Projects", href: "/#projects" },
    { name: "Team", href: "/#team" },
    { name: "Contact", href: "/contact", isActive: pathname === "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-[100] w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-white/8 bg-[#050505]/72 py-3 backdrop-blur-xl md:py-4"
          : "bg-transparent py-5 md:py-7"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-14">
        <Link href="/" className="group relative z-[110]" data-cursor="HOME">
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-[#F5F5F5] md:text-lg">
            Zain Gym
          </span>
          <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.35em] text-[#A0A0A0] transition-colors group-hover:text-[#D9D9D9] md:text-[10px]">
            Technicians
          </span>
          <span className="sr-only">{COMPANY_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                data-cursor="OPEN"
                className={`relative text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                  item.isActive
                    ? "text-[#D9D9D9]"
                    : "text-[#A0A0A0] hover:text-[#F5F5F5]"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[#D9D9D9] transition-all duration-300 ${
                    item.isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            data-cursor="CONTACT"
            className="btn-silver hidden px-5 py-2.5 text-[10px] sm:inline-flex"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            className="relative z-[110] flex h-11 w-11 items-center justify-center text-[#F5F5F5] lg:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            data-cursor="MENU"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-current transition-all duration-300 ${
                  isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-all duration-300 ${
                  isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[105] bg-[#050505] transition-all duration-500 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-8 pb-12 pt-28">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                className={`transition-all duration-500 ${
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="font-display block border-b border-white/8 py-4 text-4xl font-bold uppercase tracking-[-0.03em] text-[#F5F5F5]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="btn-silver-fill w-full"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
