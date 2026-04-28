"use client";

export default function About() {
  return (
    <section id="about" className="bg-black py-30 px-6 md:px-12 lg:px-24 scroll-mt-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side: Content */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">
            About Us
          </h3>
          <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-6">
            We Build More Than Gyms <br /> We Build Experiences.
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
            From concept to completion, we deliver world-class gym solutions 
            combining cutting-edge design top-tier equipment and expert
            coaching. Our mission is to build powerful fitness environments that
            drive performance and lasting results
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-gym-green text-2xl md:text-4xl font-black">
                14+
              </h4>
              <p className="text-white text-[10px] md:text-xs uppercase tracking-wider mt-1">
                Years Experience
              </p>
            </div>
            <div>
              <h4 className="text-gym-green text-2xl md:text-4xl font-black">
                30+
              </h4>
              <p className="text-white text-[10px] md:text-xs uppercase tracking-wider mt-1">
                Gyms Built
              </p>
            </div>
            <div>
              <h4 className="text-gym-green text-2xl md:text-4xl font-black">
                100%
              </h4>
              <p className="text-white text-[10px] md:text-xs uppercase tracking-wider mt-1">
                Client Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image with Design Element */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <div className="relative group">
            {/* Green Border Offset - Exactly like S.S */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-gym-green z-0"></div>

            {/* Main Image */}
            <div className="relative z-10 overflow-hidden">
              <img
                src="https://media.istockphoto.com/id/2075354173/photo/fitness-couple-is-doing-kettlebell-twist-in-a-gym-togehter.jpg?s=612x612&w=0&k=20&c=lfs1V1d0YB33tn72myi6FElJnylPJYYM9lW5ZhlnYqY="
                alt="Our Gym Design"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
