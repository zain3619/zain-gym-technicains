"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';

export default function Footer() {
  // Social Icons Data with SVG paths (Foolproof method for Turbopack)
  const socialLinks = [
    { 
      name: 'Facebook', 
      svg: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> 
    },
    { 
      name: 'Instagram', 
      svg: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
    },
    { 
      name: 'Youtube', 
      svg: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 2.9 2.9 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> 
    },
    { 
      name: 'Linkedin', 
      svg: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> 
    }
  ];

  return (
    <footer className="bg-[#050505] text-white pt-20 pb-10 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Logo & About */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none uppercase">
              Zain Gym <span className="text-[#97FF02]">Technicians</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1 font-bold">
              Complete Fitness Solutions
            </p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            We provide end-to-end gym solutions including gym design, gym setup services, fitness equipment supply, trainers, and support.
          </p>
          
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <button 
                key={social.name} 
                className="bg-white/5 p-2 rounded-full hover:bg-[#97FF02] hover:text-black active:scale-90 transition-all duration-300"
                aria-label={social.name}
              >
                {social.svg}
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>
              <Link href="/#home" className="hover:text-[#97FF02] active:text-[#97FF02] transition-colors text-left">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-[#97FF02] active:text-[#97FF02] transition-colors text-left">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-[#97FF02] active:text-[#97FF02] transition-colors text-left">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#projects" className="hover:text-[#97FF02] active:text-[#97FF02] transition-colors text-left">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#97FF02] active:text-[#97FF02] transition-colors text-left">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div>
  <h4 className="text-lg font-bold mb-6">Our Services</h4>
  <ul className="space-y-4 text-gray-400 text-sm">
    <li>
      <Link
        href="/#services"
        className="hover:text-[#97FF02] transition-colors text-left w-full active:scale-95"
      >
        Gym Design
      </Link>
    </li>
    <li>
      <Link
        href="/#services"
        className="hover:text-[#97FF02] transition-colors text-left w-full active:scale-95"
      >
        Equipment Supply
      </Link>
    </li>
    <li>
      <Link
        href="/#services"
        className="hover:text-[#97FF02] transition-colors text-left w-full active:scale-95"
      >
        Trainers & Staff
      </Link>
    </li>
    <li>
      <Link
        href="/#services"
        className="hover:text-[#97FF02] transition-colors text-left w-full active:scale-95"
      >
        Maintenance & Support
      </Link>
    </li>
  </ul>
</div>

        {/* Column 4: Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Contact Info</h4>
          <ul className="space-y-5 text-gray-400 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#97FF02]" />
              <span>+92 323 3334777</span>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={18} className="text-[#97FF02]" />
              <span>WhatsApp: +92 323 3334777</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#97FF02]" />
              <span>m.qaiser76@yahoo.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#97FF02] shrink-0" />
              <span>120, A Block Irrigation Co-operative Housing Society Near Race Club Kot Lakhpat, Lahore, Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Zain Gym Technicians. All rights reserved.</p>
      </div>
    </footer>
  );
}
