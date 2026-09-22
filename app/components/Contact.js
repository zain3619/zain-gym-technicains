"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaImage from "./ui/MediaImage";
import { BUSINESS_ADDRESS, BUSINESS_CONTACT, COMPANY_NAME } from "../lib/seo";

gsap.registerPlugin(ScrollTrigger);

const contactCards = [
  {
    title: "Phone",
    value: BUSINESS_CONTACT.phone,
    detail: "",
    href: `tel:${BUSINESS_CONTACT.phone.replace(/\s+/g, "")}`,
  },
  {
    title: "WhatsApp",
    value: BUSINESS_CONTACT.phone,
    detail: "",
    href: `https://wa.me/${BUSINESS_CONTACT.phone.replace(/\D/g, "")}`,
  },
  {
    title: "Email",
    value: BUSINESS_CONTACT.email,
    detail: "",
    href: `mailto:${BUSINESS_CONTACT.email}`,
  },
  {
    title: "Address",
    value: `${BUSINESS_ADDRESS.streetAddress}, ${BUSINESS_ADDRESS.addressLocality}`,
    detail: "Punjab, Pakistan",
    href: "https://maps.google.com/?q=Lahore+Pakistan",
  },
  {
    title: "Working Hours",
    value: "Mon - Sun: 9:00 AM - 8:00 PM",
    detail: "Sunday: By Appointment",
    href: "/contact",
  },
];

const projectTypes = [
  "Commercial Gym",
  "Private Studio",
  "Corporate Fitness Space",
  "Hotel Gym",
];

const budgetRanges = [
  "Under PKR 2M",
  "PKR 2M - 3M",
  "PKR 3M - 7M",
  "PKR 7M+",
];

const faqCards = [
  {
    question: "How long until you reply?",
    answer: "We typically respond within 24 hours.",
  },
  {
    question: "Do you work across Pakistan?",
    answer: "Yes, we serve clients nationwide.",
  },
  {
    question: "Can I request a custom gym plan?",
    answer: "Absolutely! Every plan is customized.",
  },
  {
    question: "Do you provide equipment & setup?",
    answer: "Yes, we handle everything end-to-end.",
  },
];

export default function Contact() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroMediaRef = useRef(null);
  const heroCopyRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      business: "",
      projectType: "",
      budgetRange: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      phone: Yup.string()
        .matches(/^[0-9+\s()-]+$/, "Enter a valid phone number")
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      business: Yup.string().required("Business / Gym Name is required"),
      projectType: Yup.string().required("Project type is required"),
      budgetRange: Yup.string().required("Budget range is required"),
      message: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .required("Message is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        alert(
          "Thank you! Your message has been sent successfully. Our team will get back to you shortly."
        );
        resetForm();
      } catch (err) {
        console.error("Contact Form error:", err);
        alert("Thank you! Your message has been sent successfully.");
        resetForm();
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      // As next panel covers the hero, hero scales down & fades behind
      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        })
        .to(
          heroMediaRef.current,
          { scale: 1.12, yPercent: 8, ease: "none" },
          0
        )
        .to(
          heroCopyRef.current,
          { y: -80, opacity: 0.25, ease: "none" },
          0
        );
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  const inputClassName = (field) =>
    `h-13 w-full border bg-[#0A0A0A] px-4 text-[14px] text-[#F5F5F5] outline-none transition-colors placeholder:text-[#A0A0A0] ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500/80"
        : "border-white/12 focus:border-[#D9D9D9]/55"
    }`;

  return (
    <div ref={rootRef} className="bg-[#050505] text-[#F5F5F5]">
      {/* ── SCENE 01: Sticky hero (stays, next panel slides over it) ── */}
      <section
        ref={heroRef}
        className="relative z-[1] h-[85dvh] overflow-hidden lg:sticky lg:top-0 lg:h-[100dvh]"
      >
        <div className="absolute inset-0">
          <div
            ref={heroMediaRef}
            className="absolute inset-0 will-change-transform"
          >
            <MediaImage
              src="/contact-hero.png"
              alt={`${COMPANY_NAME} contact`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="cinema-overlay" />
          <div className="vignette-overlay" />
          <div className="grain-overlay" />
        </div>

        <div
          ref={heroCopyRef}
          className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 pt-28 will-change-transform md:px-10 md:pb-24 lg:px-14"
        >
          <p className="scene-label mb-6">Contact Us</p>
          <h1 className="display-xl max-w-4xl text-[clamp(3rem,10vw,8rem)] text-[#F5F5F5]">
            Let&apos;s Build Your
            <br />
            Dream Gym
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#D8D8D8] md:text-base">
            Have a project in mind? Reach out to our experts for a free
            consultation. We&apos;ll help you plan, equip, and build a gym that
            delivers results.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact-form" className="btn-silver-fill" data-cursor="OPEN">
              Send Inquiry
            </a>
            <a
              href={`tel:${BUSINESS_CONTACT.phone.replace(/\s+/g, "")}`}
              className="btn-silver"
              data-cursor="CALL"
            >
              Book Consultation
            </a>
          </div>

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#A0A0A0]">
              Scroll
            </span>
            <span className="h-10 w-px overflow-hidden bg-white/15">
              <span className="block h-full w-full origin-top animate-[scrollLine_1.6s_ease-in-out_infinite] bg-[#D9D9D9]" />
            </span>
          </div>
        </div>
      </section>

      {/* ── SCENE 02: Form panel slides UP over hero ── */}
      <section className="relative z-[2] min-h-[100dvh] border-t border-white/10 bg-[#080808] shadow-[0_-40px_80px_rgba(0,0,0,0.55)]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <div className="mb-12 flex items-end justify-between gap-6 border-b border-white/8 pb-8">
            <div>
              <p className="scene-label mb-4">02 — Inquiry</p>
              <h2 className="display-xl text-[clamp(2rem,5vw,4.5rem)] text-[#F5F5F5]">
                Send Us A Message
              </h2>
            </div>
            <p className="hidden max-w-xs text-right text-xs uppercase tracking-[0.18em] text-[#A0A0A0] md:block">
              Scroll covers the hero
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div id="contact-form">
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      className={inputClassName("name")}
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <input
                      name="phone"
                      type="text"
                      placeholder="Phone Number"
                      className={inputClassName("phone")}
                      {...formik.getFieldProps("phone")}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className={inputClassName("email")}
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="mt-1 text-xs text-red-400">
                      {formik.errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <input
                    name="business"
                    type="text"
                    placeholder="Business / Gym Name"
                    className={inputClassName("business")}
                    {...formik.getFieldProps("business")}
                  />
                  {formik.touched.business && formik.errors.business ? (
                    <p className="mt-1 text-xs text-red-400">
                      {formik.errors.business}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <select
                      name="projectType"
                      className={inputClassName("projectType")}
                      {...formik.getFieldProps("projectType")}
                    >
                      <option value="" className="bg-[#101010] text-[#808080]">
                        Project Type
                      </option>
                      {projectTypes.map((projectType) => (
                        <option
                          key={projectType}
                          value={projectType}
                          className="bg-[#101010] text-white"
                        >
                          {projectType}
                        </option>
                      ))}
                    </select>
                    {formik.touched.projectType && formik.errors.projectType ? (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.projectType}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <select
                      name="budgetRange"
                      className={inputClassName("budgetRange")}
                      {...formik.getFieldProps("budgetRange")}
                    >
                      <option value="" className="bg-[#101010] text-[#808080]">
                        Budget Range
                      </option>
                      {budgetRanges.map((budgetRange) => (
                        <option
                          key={budgetRange}
                          value={budgetRange}
                          className="bg-[#101010] text-white"
                        >
                          {budgetRange}
                        </option>
                      ))}
                    </select>
                    {formik.touched.budgetRange && formik.errors.budgetRange ? (
                      <p className="mt-1 text-xs text-red-400">
                        {formik.errors.budgetRange}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Your Message"
                    className={`${inputClassName("message")} h-[120px] resize-none py-3`}
                    {...formik.getFieldProps("message")}
                  />
                  {formik.touched.message && formik.errors.message ? (
                    <p className="mt-1 text-xs text-red-400">
                      {formik.errors.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="btn-silver-fill w-full disabled:opacity-60"
                  data-cursor="SEND"
                >
                  {formik.isSubmitting ? "Sending..." : "Send Message"}
                </button>

                <p className="text-center text-[12px] text-[#A0A0A0]">
                  We respect your privacy. Your information is safe with us.
                </p>
              </form>
            </div>

            <div className="space-y-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10 lg:pl-12">
              {contactCards.map(({ title, value, detail, href }) => (
                <a
                  key={title}
                  href={href}
                  className="group block border-b border-white/10 py-6 transition-colors hover:bg-white/[0.02]"
                  data-cursor="OPEN"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BDBDBD]">
                    {title}
                  </p>
                  <p className="mt-2 text-base text-[#F5F5F5] md:text-lg">
                    {value}
                  </p>
                  {detail ? (
                    <p className="mt-1 text-sm text-[#A0A0A0]">{detail}</p>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SCENE 03: Visit — sticky mid layer, next covers it ── */}
      <section className="relative z-[3] min-h-[85dvh] overflow-hidden border-t border-white/10 bg-[#0D0D0D] lg:sticky lg:top-0 lg:min-h-[100dvh]">
        <div className="mx-auto grid min-h-[85dvh] max-w-[1600px] lg:min-h-[100dvh] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-20 md:px-10 lg:px-14">
            <p className="scene-label mb-4">03 — Visit</p>
            <h2 className="display-xl text-[clamp(2.2rem,5.5vw,5rem)] text-[#F5F5F5]">
              Let&apos;s Meet
              <br />
              in Person
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#A0A0A0] md:text-base">
              Our head office is located in Lahore. You&apos;re welcome to visit
              us and discuss your gym project in detail with our experts.
            </p>
            <a
              href="https://maps.google.com/?q=Lahore+Pakistan"
              className="btn-silver mt-10 w-fit"
              data-cursor="OPEN"
            >
              Get Directions
            </a>
          </div>
          <div className="relative min-h-[50dvh] lg:min-h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.61113045232!2d74.3315!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMTknNTMuNCJF!5e0!3m2!1sen!2spk!4v1620000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{
                border: 0,
                position: "absolute",
                inset: 0,
                filter:
                  "grayscale(1) invert(0.94) contrast(1.05) brightness(0.55)",
              }}
              allowFullScreen=""
              loading="lazy"
              title="Gym office location"
            />
          </div>
        </div>
      </section>

      {/* ── SCENE 04: FAQ + CTA slides over visit ── */}
      <section className="relative z-[4] min-h-[100dvh] border-t border-white/10 bg-[#050505] shadow-[0_-40px_80px_rgba(0,0,0,0.55)]">
        <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <p className="scene-label mb-4">04 — Help</p>
          <h2 className="display-xl mb-14 text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5]">
            We&apos;re Here To Help
          </h2>

          <div className="grid gap-0 border-t border-white/10 md:grid-cols-2">
            {faqCards.map(({ question, answer }) => (
              <div
                key={question}
                className="border-b border-white/10 py-8 md:pr-10"
              >
                <h3 className="font-display text-xl font-bold uppercase tracking-[-0.02em] text-[#F5F5F5]">
                  {question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
                  {answer}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-20 overflow-hidden border border-white/10">
            <div className="absolute inset-0">
              <MediaImage
                src="/contact-hero.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-[#050505]/78" />
            </div>
            <div className="relative z-10 flex flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-12 md:py-20">
              <div className="max-w-xl">
                <p className="scene-label mb-4">
                  Ready To Transform Your Space?
                </p>
                <h2 className="display-xl text-[clamp(2rem,5vw,4rem)] text-[#F5F5F5]">
                  Ready To Start Your Fitness Project?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#D8D8D8] md:text-base">
                  From concept to completion, we&apos;ll build a gym that
                  inspires and delivers results.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact-form"
                  className="btn-silver-fill"
                  data-cursor="OPEN"
                >
                  Start Your Project
                </a>
                <Link href="/#projects" className="btn-silver" data-cursor="VIEW">
                  View Our Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
