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
          <button className="hidden sm:block bg-gym-green text-black font-bold px-8 py-3 rounded-md hover:bg-white transition-all duration-300 text-xs md:text-sm uppercase">
            Get a Quote
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 py-6 px-10">
          <ul className="flex flex-col gap-5 text-white text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href} 
                  className="hover:text-gym-green cursor-pointer block py-2 transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <button className="bg-gym-green text-black font-bold px-6 py-3 rounded-md w-full mt-2 text-sm uppercase">
              Get a Quote
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
}