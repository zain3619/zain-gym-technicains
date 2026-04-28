"use client";
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Contact() {
  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Form Data:", values);
      alert("Message sent successfully!");
      resetForm();
    },
  });

  return (
    <section id="contact" className="bg-gray-950 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-[#97FF02] font-bold uppercase tracking-widest text-lg mb-4">
          Contact Us
        </h3>
        <h2 className="text-white text-3xl md:text-5xl font-black ">
          Let&apos;s Build Your Dream Gym
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Form Side */}
        <div className="bg-[#111] p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            
            {/* Name Field */}
            <div>
              <input 
                name="name"
                type="text" 
                placeholder="Your Name" 
                className={`w-full bg-[#0a0a0a] border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white placeholder:text-gray-600 focus:outline-none transition-all`}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <input 
                name="phone"
                type="text" 
                placeholder="Phone Number" 
                className={`w-full bg-[#0a0a0a] border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white placeholder:text-gray-600 focus:outline-none transition-all`}
                {...formik.getFieldProps('phone')}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.phone}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input 
                name="email"
                type="email" 
                placeholder="Email Address" 
                className={`w-full bg-[#0a0a0a] border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white placeholder:text-gray-600 focus:outline-none transition-all`}
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows="5"
                className={`w-full bg-[#0a0a0a] border ${formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-white placeholder:text-gray-600 focus:outline-none transition-all resize-none`}
                {...formik.getFieldProps('message')}
              ></textarea>
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-500 text-xs mt-1 ml-1">{formik.errors.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn-hover-fill btn-fill-green-shift w-full bg-[#97FF02] text-black font-black uppercase tracking-tighter py-4 rounded-lg text-lg active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Map Side */}
        <div className="relative h-[400px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.61113045232!2d74.3315!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMTknNTMuNCJF!5e0!3m2!1sen!2spk!4v1620000000000!5m2!1sen!2spk" 
            width="100%" 
            height="100%" 
            style={{ 
              border: 0, 
              filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' 
            }} 
            allowFullScreen="" 
            loading="lazy"
            title="Gym Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
