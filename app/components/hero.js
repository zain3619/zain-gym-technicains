export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://www.hussle.com/blog/wp-content/uploads/2020/12/Gym-structure-1080x675.png')",
        }}
      >
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        
        {/* Sub-heading: Small on mobile, Medium on Desktop */}
        <h3 className="text-gym-green font-bold tracking-[3px] md:tracking-[5px] uppercase mb-4 text-sm md:text-lg italic">
          We Build
        </h3>
        
        {/* Main Heading: Scaled from 4xl to 8xl */}
        <h1 className="text-white text-4xl sm:text-6xl md:text-8xl font-black uppercase leading-[1.1] mb-2 tracking-tighter">
          Complete Gyms
        </h1>
        
        {/* Secondary Heading: Scaled from lg to 4xl */}
        <h2 className="text-gym-green text-lg sm:text-2xl md:text-4xl font-bold uppercase mb-6 tracking-wide">
          From Design to Management
        </h2>

        {/* Description: Hidden or smaller on very small screens to keep UI clean */}
        <p className="text-gray-200 text-sm md:text-xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Equipment, Trainers & Full Setup – All in One Place
        </p>

        {/* Buttons: Stacked on Mobile, Row on Desktop */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-gym-green text-black font-extrabold px-10 py-4 rounded-md hover:bg-white transition w-full sm:w-56 text-sm md:text-base tracking-widest">
            GET STARTED
          </button>
          <button className="border-2 border-white text-white font-extrabold px-10 py-4 rounded-md hover:bg-white hover:text-black transition w-full sm:w-56 text-sm md:text-base tracking-widest">
            CONTACT US
          </button>
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