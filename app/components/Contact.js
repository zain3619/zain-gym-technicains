"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import MediaImage from "./ui/MediaImage";
import { BUSINESS_ADDRESS, BUSINESS_CONTACT, COMPANY_NAME } from "../lib/seo";

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
        .max(300, "Message cannot exceed 300 characters")
        .required("Message is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || "Failed to send");
        }

        toast.success(
          "Thank you! Your message has been sent. Our team will get back to you shortly."
        );
        resetForm();
      } catch (err) {
        console.error("Contact Form error:", err);
        toast.error(
          err.message ||
            "Something went wrong. Please try again or call us directly."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputClassName = (field) =>
    `h-13 w-full border bg-[#0A0A0A] px-4 text-[14px] text-[#F5F5F5] outline-none transition-colors placeholder:text-[#A0A0A0] ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-500/80"
        : "border-white/12 focus:border-[#D9D9D9]/55"
    }`;

  return (
    <div className="bg-[#050505] text-[#F5F5F5]">
      {/* Section 1 — Form first (no hero) */}
      <section
        id="contact-form"
        className="relative z-[2] min-h-screen border-b border-white/10 bg-[#080808] pt-24 md:pt-28"
      >
        <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10 md:py-20 lg:px-14">
          <div className="mb-10 border-b border-white/8 pb-8 md:mb-12">
            <p className="scene-label mb-3 md:mb-4">Contact · Inquiry</p>
            <h1 className="display-xl max-w-3xl text-[clamp(1.75rem,5vw,4.5rem)] text-[#F5F5F5]">
              Send Us A Message
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#A0A0A0] md:text-base">
              Have a project in mind? Reach out — we&apos;ll help you plan,
              equip, and build a gym that delivers results.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
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
                    rows={3}
                    maxLength={300}
                    placeholder="Your Message"
                    className={`${inputClassName("message")} h-[4.75rem] resize-none py-3`}
                    {...formik.getFieldProps("message")}
                  />
                  <div className="mt-1 flex items-start justify-between gap-3">
                    {formik.touched.message && formik.errors.message ? (
                      <p className="text-xs text-red-400">
                        {formik.errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      className={`shrink-0 text-xs tabular-nums ${
                        formik.values.message.length >= 300
                          ? "text-red-400"
                          : formik.values.message.length > 0 &&
                              formik.values.message.length < 10
                            ? "text-amber-400"
                            : "text-[#A0A0A0]"
                      }`}
                    >
                      {formik.values.message.length}/300
                    </p>
                  </div>
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
                  className="group block border-b border-white/10 py-5 transition-colors hover:bg-white/[0.02] md:py-6"
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

      {/* Section 2 — Visit + FAQ */}
      <section className="relative z-[3] border-t border-white/10 bg-[#0D0D0D]">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 md:px-10 md:py-20 lg:px-14">
            <p className="scene-label mb-3 md:mb-4">Visit</p>
            <h2 className="display-xl text-[clamp(1.75rem,5vw,4.5rem)] text-[#F5F5F5]">
              Let&apos;s Meet
              <br />
              in Person
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#A0A0A0] md:mt-6 md:text-base">
              Our head office is in Lahore. Visit us to discuss your gym project
              with our experts.
            </p>
            <a
              href="https://maps.google.com/?q=Lahore+Pakistan"
              className="btn-silver mt-8 w-fit md:mt-10"
              data-cursor="OPEN"
            >
              Get Directions
            </a>
          </div>
          <div className="relative min-h-[42dvh] lg:min-h-[70dvh]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.61113045232!2d74.3315!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMTknNTMuNCJF!5e0!3m2!1sen!2spk!4v1620000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{
                border: 0,
                position: "absolute",
                inset: 0,
              }}
              allowFullScreen=""
              loading="lazy"
              title="Gym office location"
            />
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] border-t border-white/10 px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <p className="scene-label mb-3 md:mb-4">FAQ</p>
          <h2 className="display-xl mb-10 text-[clamp(1.75rem,5vw,4rem)] text-[#F5F5F5] md:mb-14">
            Common Questions
          </h2>

          <div className="grid gap-0 border-t border-white/10 md:grid-cols-2">
            {faqCards.map(({ question, answer }) => (
              <div
                key={question}
                className="border-b border-white/10 py-7 md:pr-10"
              >
                <h3 className="font-display text-lg font-bold uppercase tracking-[-0.02em] text-[#F5F5F5] md:text-xl">
                  {question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
                  {answer}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-14 overflow-hidden border border-white/10 md:mt-20">
            <div className="absolute inset-0">
              <MediaImage
                src="/contact-hero.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-35"
                fallback="/contact-hero.webp"
              />
              <div className="absolute inset-0 bg-[#050505]/78" />
            </div>
            <div className="relative z-10 flex flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between md:gap-8 md:px-12 md:py-16">
              <div className="max-w-xl">
                <h2 className="display-xl text-[clamp(1.65rem,4.5vw,3.5rem)] text-[#F5F5F5]">
                  Start a Gym Project
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#D8D8D8] md:mt-4 md:text-base">
                  Design, build, and equipment supply — from first layout to
                  launch.
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
