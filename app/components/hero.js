import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/hero-gym.png')",
        }}
      >
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 text-center sm:px-6">
        
        {/* Sub-heading: Small on mobile, Medium on Desktop */}
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gym-green sm:mb-4 sm:text-sm md:text-lg md:tracking-[5px]">
          Gym Designers and Builders
        </h3>
        
        {/* Main Heading: Scaled from 4xl to 8xl */}
        <h1 className="mb-2 text-3xl font-black uppercase leading-[1] tracking-[-0.05em] text-white sm:text-5xl md:text-7xl lg:text-8xl">
          Complete Gym Setup
        </h1>
        
        {/* Secondary Heading: Scaled from lg to 4xl */}
        <h2 className="mb-4 text-base font-bold uppercase tracking-[0.08em] text-gym-green sm:mb-6 sm:text-xl md:text-3xl lg:text-4xl">
          From Design to Equipment Supply
        </h2>

        {/* Description: Hidden or smaller on very small screens to keep UI clean */}
        <p className="mx-auto mb-8 max-w-[20rem] text-sm leading-relaxed text-gray-200 sm:mb-10 sm:max-w-2xl sm:text-base md:text-lg lg:text-xl">
          Gym setup services, fitness equipment supply, trainers, and full
          support all in one place.
        </p>

        {/* Buttons: Stacked on Mobile, Row on Desktop */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/contact"
            className="btn-hover-fill btn-fill-white-shift w-full max-w-[220px] rounded-md bg-gym-green px-6 py-3 text-center text-xs font-extrabold tracking-[0.18em] text-black active:scale-[0.98] sm:w-52 sm:px-8 sm:py-3.5 sm:text-sm md:w-56 md:px-10 md:py-4 md:text-base md:tracking-widest"
          >
            GET STARTED
          </Link>
          <Link
            href="/contact"
            className="btn-hover-outline btn-outline-white-fill w-full max-w-[220px] rounded-md border-2 border-white px-6 py-3 text-center text-xs font-extrabold tracking-[0.18em] text-white active:scale-[0.98] sm:w-52 sm:px-8 sm:py-3.5 sm:text-sm md:w-56 md:px-10 md:py-4 md:text-base md:tracking-widest"
          >
            CONTACT US
          </Link>
        </div>
      </div>

      {/* Scroll Down Indicator (Optional, looks professional) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gym-green rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
