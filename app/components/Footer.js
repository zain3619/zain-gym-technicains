"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CONTACT,
  COMPANY_NAME,
  DEFAULT_DESCRIPTION,
} from "../lib/seo";

const FALLBACK_SOCIAL = {
  facebook: "",
  instagram: "",
  youtube: "",
  linkedin: "",
};

export default function Footer({ showHero = true }) {
  const [settings, setSettings] = useState({
    phone: BUSINESS_CONTACT.phone,
    email: BUSINESS_CONTACT.email,
    address: `${BUSINESS_ADDRESS.streetAddress}, ${BUSINESS_ADDRESS.addressLocality}, Pakistan`,
    openingHours: "Mon - Sun: 9:00 AM - 8:00 PM (Sunday: By Appointment)",
    footerText: `${COMPANY_NAME}. All rights reserved.`,
    socialLinks: FALLBACK_SOCIAL,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/sections/settings");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSettings((prev) => ({
              phone: data.phone || prev.phone,
              email: data.email || prev.email,
              address: data.address || prev.address,
              openingHours: data.openingHours || prev.openingHours,
              footerText: data.footerText || prev.footerText,
              socialLinks: {
                ...FALLBACK_SOCIAL,
                ...(data.socialLinks || {}),
              },
            }));
          }
        }
      } catch {
        // Keep SEO fallbacks
      }
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Projects", href: "/#projects" },
    { name: "Team", href: "/#team" },
    { name: "Contact", href: "/contact" },
  ];

  const socialEntries = [
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "youtube", label: "Youtube" },
    { key: "linkedin", label: "Linkedin" },
  ].filter(({ key }) => settings.socialLinks?.[key]);

  return (
    <footer className="relative z-[80] overflow-hidden border-t border-white/8 bg-[#050505] text-[#F5F5F5]">
      <div className="grain-overlay opacity-[0.05]" />

      <div
        className={`relative z-10 mx-auto max-w-[1600px] px-5 pb-10 md:px-10 lg:px-14 ${
          showHero ? "pt-24 md:pt-32" : "pt-14 md:pt-16"
        }`}
      >
        {showHero ? (
          <>
            <p className="scene-label mb-6">Contact</p>
            <h2 className="hero-title display-xl max-w-5xl text-[clamp(2.2rem,8vw,8rem)] text-[#F5F5F5]">
              Get in
              <br />
              touch.
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-relaxed text-[#A0A0A0] md:text-base">
              {DEFAULT_DESCRIPTION}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-silver-fill"
                data-cursor="CONTACT"
              >
                Start a Project
              </Link>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="btn-silver"
                data-cursor="CALL"
              >
                {settings.phone}
              </a>
            </div>
          </>
        ) : null}

        <div
          className={`grid gap-12 md:grid-cols-2 lg:grid-cols-4 ${
            showHero
              ? "mt-24 border-t border-white/8 pt-14"
              : "border-t border-white/8 pt-10"
          }`}
        >
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-[-0.03em]">
              {COMPANY_NAME}
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#A0A0A0]">
              Complete Fitness Solutions
            </p>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9D9D9]">
              Navigate
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A0A0A0] transition-colors hover:text-[#F5F5F5]"
                    data-cursor="OPEN"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9D9D9]">
              Contact
            </p>
            <ul className="space-y-4 text-sm text-[#A0A0A0]">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-[#F5F5F5]"
                >
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors hover:text-[#F5F5F5]"
                >
                  {settings.email}
                </a>
              </li>
              <li className="max-w-xs leading-relaxed">{settings.address}</li>
              <li>{settings.openingHours}</li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9D9D9]">
              Social
            </p>
            {socialEntries.length > 0 ? (
              <ul className="space-y-3">
                {socialEntries.map(({ key, label }) => (
                  <li key={key}>
                    <a
                      href={settings.socialLinks[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#A0A0A0] transition-colors hover:text-[#F5F5F5]"
                      data-cursor="OPEN"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#A0A0A0]">
                Connect with us via phone or email.
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/8 pt-8 text-[11px] uppercase tracking-[0.18em] text-[#A0A0A0] md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {settings.footerText}
          </p>
          <p className="text-[#BDBDBD]">{COMPANY_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
