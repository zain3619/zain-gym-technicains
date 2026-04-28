"use client";

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detect karne ke liye useEffect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-10 transition-all duration-300 ${
      scrolled 
        ? "bg-black/90 py-3 md:py-4 shadow-xl border-b border-white/5" 
        : "bg-transparent py-4 md:py-8"
    }`}>
      <div className="flex justify-between items-center w-full mx-auto">
        
        {/* Logo Text */}
        <div className="flex flex-col">
          <h1 className="text-white text-lg md:text-2xl font-black tracking-tighter leading-none">
            ZAIN GYM <span className="text-gym-green">TECHNICIANS</span>
          </h1>
          <span className="text-[8px] md:text-[10px] text-gray-300 tracking-[2px] md:tracking-[3px] uppercase">
            Complete Fitness Solutions
          </span>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex gap-10 text-white font-medium text-sm tracking-wide">
          {navItems.map((item) => (
            <li key={item.name}>
              <a 
                href={item.href} 
                className="hover:text-gym-green cursor-pointer transition-colors duration-300"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Side: CTA Button */}
        <div className="flex items-center gap-4">
          <button className="btn-hover-fill btn-fill-white-shift hidden sm:block bg-gym-green text-black font-bold px-8 py-3 rounded-md text-xs md:text-sm uppercase active:scale-[0.98]">
            Get a Quote
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="btn-hover-icon lg:hidden relative flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-[0.98]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <span className="relative h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 origin-center rounded-full bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 origin-center rounded-full bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] sm:top-[80px] transition-all duration-400 ease-in-out ${
          isOpen ? "pointer-events-auto bg-black/55 backdrop-blur-[2px]" : "pointer-events-none bg-black/0"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`ml-auto flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#050505]/95 px-8 py-8 shadow-2xl transition-all duration-500 ease-in-out ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <ul className="flex flex-col gap-2 text-white text-sm font-medium">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                className={`transition-all duration-500 ease-in-out ${
                  isOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                }`}
                style={{ transitionDelay: isOpen ? `${index * 45}ms` : "0ms" }}
              >
                <a 
                  href={item.href} 
                  className="block rounded-xl border border-transparent px-4 py-3 tracking-wide transition-all duration-300 ease-in-out hover:border-white/10 hover:bg-white/5 hover:text-gym-green" 
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`mt-auto pt-6 transition-all duration-500 ease-in-out ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? `${navItems.length * 45}ms` : "0ms" }}
          >
            <button className="btn-hover-fill btn-fill-white-shift w-full rounded-xl bg-gym-green px-6 py-3 text-sm font-bold uppercase text-black active:scale-[0.98]">
              Get a Quote
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
