"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";
import { BUSINESS_ADDRESS, BUSINESS_CONTACT } from "../lib/seo";

const highlightCards = [
  {
    icon: Zap,
    title: "24h Response",
    text: "We reply within 24 hours",
  },
  {
    icon: UserRound,
    title: "Expert Gym Consultants",
    text: "Industry experts at your service",
  },
  {
    icon: ShieldCheck,
    title: "Nationwide Support",
    text: "Serving clients across Pakistan",
  },
];

const contactCards = [
  {
    icon: Phone,
    title: "Phone",
    value: BUSINESS_CONTACT.phone,
    detail: "",
    href: `tel:${BUSINESS_CONTACT.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: BUSINESS_CONTACT.phone,
    detail: "",
    href: `https://wa.me/${BUSINESS_CONTACT.phone.replace(/\D/g, "")}`,
  },
  {
    icon: Mail,
    title: "Email",
    value: BUSINESS_CONTACT.email,
    detail: "",
    href: `mailto:${BUSINESS_CONTACT.email}`,
  },
  {
    icon: MapPin,
    title: "Address",
    value: `${BUSINESS_ADDRESS.streetAddress}, ${BUSINESS_ADDRESS.addressLocality},`,
    detail: "Punjab, Pakistan",
    href: "https://maps.google.com/?q=Lahore+Pakistan",
  },
  {
    icon: Clock3,
    title: "Working Hours",
    value: "Mon - Sun: 9:00 AM - 8:00 PM",
    detail: "Sunday: By Appointment",
    href: "/contact",
  },
];

const quickConnectCards = [
  {
    icon: Send,
    title: "Request a Quote",
    text: "Tell us about your project and get a custom quote.",
    cta: "Get a Quote",
    href: "#contact-form",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Chat",
    text: "Chat with our team instantly on WhatsApp.",
    cta: "Chat Now",
    href: `https://wa.me/${BUSINESS_CONTACT.phone.replace(/\D/g, "")}`,
  },
  {
    icon: Phone,
    title: "Schedule a Call",
    text: "Book a free consultation with our gym experts.",
    cta: "Book Now",
    href: `tel:${BUSINESS_CONTACT.phone.replace(/\s+/g, "")}`,
  },
];

const faqCards = [
  {
    icon: Clock3,
    question: "How long until you reply?",
    answer: "We typically respond within 24 hours.",
  },
  {
    icon: Zap,
    question: "Do you work across Pakistan?",
    answer: "Yes, we serve clients nationwide.",
  },
  {
    icon: Mail,
    question: "Can I request a custom gym plan?",
    answer: "Absolutely! Every plan is customized.",
  },
  {
    icon: UserRound,
    question: "Do you provide equipment & setup?",
    answer: "Yes, we handle everything end-to-end.",
  },
];

const projectTypes = [
  "Commercial Gym",
  "Private Studio",
  "Corporate Fitness Space",
  "Hotel Gym",
];

const budgetRanges = [
  "Under PKR 1M",
  "PKR 1M - 3M",
  "PKR 3M - 7M",
  "PKR 7M+",
];

export default function Contact() {
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
    onSubmit: (values, { resetForm }) => {
      console.log("Contact form submission:", values);
      alert("Message sent successfully!");
      resetForm();
    },
  });

  const inputClassName = (field) =>
    `h-13 w-full rounded-[10px] border bg-[#111111]/92 px-4 text-[14px] text-white outline-none transition-all placeholder:text-[#8b8b8b] ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500/80"
        : "border-white/10 focus:border-[#97FF02]/55"
    }`;

  return (
    <section className="bg-black text-white">
      <div className="px-4 pb-10 pt-[92px] sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#060606] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <div className="relative min-h-[520px] border-b border-white/8 lg:min-h-[620px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/contact-hero.png')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.88)_34%,rgba(0,0,0,0.55)_58%,rgba(0,0,0,0.18)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.34)_100%)] lg:w-[51%]" />

            <div className="relative flex min-h-[520px] items-end px-5 pb-7 pt-10 sm:px-7 md:px-8 lg:min-h-[620px] lg:px-10 lg:pb-8">
              <div className="w-full">
                <div className="max-w-[560px]">
                  <p className="mb-4 text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#97FF02]">
                    Contact Us
                  </p>
                  <h1 className="text-[40px] font-black uppercase leading-[0.92] tracking-[-0.055em] text-white sm:text-[56px] lg:text-[76px] xl:text-[88px]">
                    Let&apos;s Build Your
                    <span className="mt-1 block text-[#97FF02]">Dream Gym</span>
                  </h1>
                  <p className="mt-5 max-w-[460px] text-[16px] leading-[1.5] text-[#dddddd] sm:text-[18px]">
                    Have a project in mind? Reach out to our experts for a free
                    consultation. We&apos;ll help you plan, equip, and build a gym
                    that delivers results.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <a
                      href="#contact-form"
                      className="btn-hover-fill btn-fill-green-shift inline-flex h-[56px] min-w-[220px] items-center justify-center gap-3 rounded-[10px] bg-[#97FF02] px-6 text-[16px] font-bold text-black sm:text-[18px]"
                    >
                      Send Inquiry
                      <ArrowRight size={18} />
                    </a>
                    <a
                      href={`tel:${BUSINESS_CONTACT.phone.replace(/\s+/g, "")}`}
                      className="btn-hover-outline inline-flex h-[56px] min-w-[220px] items-center justify-center gap-3 rounded-[10px] border border-white/35 bg-black/20 px-6 text-[16px] font-medium text-white backdrop-blur-[2px] sm:text-[18px]"
                    >
                      Book Consultation
                      <Calendar size={18} />
                    </a>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 lg:mt-10 lg:max-w-[980px] lg:grid-cols-3">
                  {highlightCards.map(({ icon: Icon, title, text }) => (
                    <div
                      key={title}
                      className="rounded-[14px] border border-white/12 bg-black/45 px-4 py-4 backdrop-blur-[1px]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#8fd611]/35 bg-[#97FF02]/12 text-[#97FF02] shadow-[0_0_18px_rgba(151,255,2,0.15)]">
                          <Icon size={22} />
                        </div>
                        <div>
                          <p className="text-[18px] font-bold leading-none text-white sm:text-[20px]">
                            {title}
                          </p>
                          <p className="mt-1 text-[14px] text-[#d5d5d5] sm:text-[15px]">{text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
              <div
                id="contact-form"
                className="rounded-[16px] border border-white/10 bg-[linear-gradient(135deg,#111111_0%,#0b0b0b_100%)] p-4 sm:p-5 lg:p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-[20px] font-extrabold uppercase tracking-[-0.03em] text-white sm:text-[22px]">
                    Send Us A Message
                  </span>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-3.5">
                  <div className="grid gap-3.5 md:grid-cols-2">
                    <div>
                      <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        className={inputClassName("name")}
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <p className="mt-1 text-xs text-red-400">{formik.errors.name}</p>
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
                        <p className="mt-1 text-xs text-red-400">{formik.errors.phone}</p>
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
                      <p className="mt-1 text-xs text-red-400">{formik.errors.email}</p>
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
                      <p className="mt-1 text-xs text-red-400">{formik.errors.business}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-3.5 md:grid-cols-2">
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
                      className={`${inputClassName("message")} h-[110px] resize-none py-3`}
                      {...formik.getFieldProps("message")}
                    />
                    {formik.touched.message && formik.errors.message ? (
                      <p className="mt-1 text-xs text-red-400">{formik.errors.message}</p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="btn-hover-fill btn-fill-green-shift flex h-[56px] w-full items-center justify-center gap-3 rounded-[10px] bg-[#97FF02] px-5 text-[18px] font-bold text-black"
                  >
                    <Send size={17} />
                    Send Message
                  </button>

                  <p className="flex items-center justify-center gap-2 text-center text-[13px] text-[#9e9e9e]">
                    <ShieldCheck size={14} className="text-[#97FF02]" />
                    We respect your privacy. Your information is safe with us.
                  </p>
                </form>
              </div>

              <div className="space-y-3.5">
                {contactCards.map(({ icon: Icon, title, value, detail, href }) => (
                  <a
                    key={title}
                    href={href}
                    className="group flex min-h-[106px] items-center justify-between rounded-[16px] border border-white/10 bg-[linear-gradient(135deg,#121212_0%,#0b0b0b_100%)] px-4 py-4 transition-all duration-300 hover:border-[#97FF02]/35"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#8fd611]/28 bg-[radial-gradient(circle_at_35%_35%,rgba(151,255,2,0.22),rgba(151,255,2,0.08)_55%,rgba(151,255,2,0.02)_100%)] text-[#97FF02]">
                        <Icon size={25} />
                      </div>
                      <div>
                        <p className="text-[17px] font-bold text-[#97FF02] sm:text-[18px]">{title}</p>
                        <p className="mt-1 text-[15px] leading-[1.45] text-white sm:text-[16px]">
                          {value}
                        </p>
                        {detail ? (
                          <p className="text-[15px] leading-[1.4] text-[#d4d4d4] sm:text-[16px]">
                            {detail}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="shrink-0 text-[#97FF02] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-7">
              <SectionTitle text="Quick Ways To Connect" />

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {quickConnectCards.map(({ icon: Icon, title, text, cta, href }) => (
                  <a
                    key={title}
                    href={href}
                    className="group rounded-[16px] border border-white/10 bg-[linear-gradient(135deg,#111111_0%,#0b0b0b_100%)] px-4 py-5 transition-all duration-300 hover:border-[#97FF02]/32"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#8fd611]/28 bg-[#97FF02]/8 text-[#97FF02]">
                        <Icon size={30} />
                      </div>
                      <div>
                        <h3 className="text-[19px] font-bold text-white sm:text-[20px]">{title}</h3>
                        <p className="mt-1 max-w-[260px] text-[14px] leading-[1.45] text-[#bdbdbd] sm:text-[15px]">
                          {text}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 text-[15px] font-bold text-[#97FF02]">
                          {cta}
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-7">
              <div className="grid overflow-hidden rounded-[16px] border border-white/10 bg-[linear-gradient(135deg,#111111_0%,#0b0b0b_100%)] lg:grid-cols-[0.95fr_1.65fr]">
                <div className="flex flex-col justify-center p-6 sm:p-7">
                  <p className="text-[15px] font-extrabold uppercase tracking-[0.06em] text-[#97FF02]">
                    Visit Our Office
                  </p>
                  <h2 className="mt-3 text-[36px] font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-[46px] lg:text-[56px]">
                    Let&apos;s Meet in Person
                  </h2>
                  <p className="mt-4 max-w-[340px] text-[16px] leading-[1.55] text-[#d5d5d5] sm:text-[18px]">
                    Our head office is located in Lahore. You&apos;re welcome to
                    visit us and discuss your gym project in detail with our
                    experts.
                  </p>
                  <a
                    href="https://maps.google.com/?q=Lahore+Pakistan"
                    className="btn-hover-outline mt-7 inline-flex h-[54px] w-fit items-center justify-center gap-3 rounded-[10px] border border-white/30 px-6 text-[16px] font-semibold text-white sm:text-[18px]"
                  >
                    Get Directions
                    <ChevronRight size={16} />
                  </a>
                </div>

                <div className="min-h-[260px] lg:min-h-[320px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.61113045232!2d74.3315!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMTknNTMuNCJF!5e0!3m2!1sen!2spk!4v1620000000000!5m2!1sen!2spk"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      filter:
                        "grayscale(1) invert(0.94) contrast(1.05) brightness(0.55)",
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Gym office location"
                  />
                </div>
              </div>
            </div>

            <div className="pt-7">
              <SectionTitle text="We're Here To Help" />

              <div className="mt-4 grid gap-4 xl:grid-cols-4">
                {faqCards.map(({ icon: Icon, question, answer }) => (
                  <div
                    key={question}
                    className="rounded-[14px] border border-white/10 bg-[linear-gradient(135deg,#101010_0%,#090909_100%)] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <div className="mt-0.5 text-[#97FF02]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold leading-[1.25] text-white sm:text-[18px]">
                            {question}
                          </h3>
                          <p className="mt-2 text-[14px] leading-[1.45] text-[#b7b7b7]">
                            {answer}
                          </p>
                        </div>
                      </div>
                      <span className="text-white">+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-7">
              <div className="relative overflow-hidden rounded-[16px] border border-white/10">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/contact-hero.png')" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.82)_48%,rgba(0,0,0,0.38)_100%)]" />

                <div className="relative flex flex-col gap-6 px-5 py-7 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                  <div className="max-w-[560px]">
                    <p className="text-[15px] font-extrabold uppercase tracking-[0.05em] text-[#97FF02]">
                      Ready To Transform Your Space?
                    </p>
                    <h2 className="mt-3 text-[34px] font-black uppercase leading-[0.95] tracking-[-0.05em] text-white sm:text-[44px] lg:text-[58px]">
                      Ready To Start Your
                      <span className="block text-[#97FF02]">Fitness Project?</span>
                    </h2>
                    <p className="mt-4 max-w-[470px] text-[16px] leading-[1.5] text-[#d7d7d7] sm:text-[18px]">
                      From concept to completion, we&apos;ll build a gym that
                      inspires and delivers results.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#contact-form"
                      className="btn-hover-fill btn-fill-green-shift inline-flex h-[56px] items-center justify-center gap-3 rounded-[10px] bg-[#97FF02] px-7 text-[16px] font-bold text-black sm:text-[18px]"
                    >
                      Start Your Project
                      <ArrowRight size={16} />
                    </a>
                    <Link
                      href="/#projects"
                      className="btn-hover-outline inline-flex h-[56px] items-center justify-center gap-3 rounded-[10px] border border-white/28 px-7 text-[16px] font-semibold text-white sm:text-[18px]"
                    >
                      View Our Projects
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ text }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-10 bg-[#97FF02]/55 sm:w-16" />
      <span className="text-center text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#97FF02]">
        {text}
      </span>
      <span className="h-px w-10 bg-[#97FF02]/55 sm:w-16" />
    </div>
  );
}
