"use client";
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Testimonials() {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const reviews = [
    { id: 1, name: "Hamza Ali", role: "CEO, Alpha Fitness", text: "They built our gym from scratch and the results exceeded our expectations. Highly professional team!" },
    { id: 2, name: "Sarah Khan", role: "Owner, Fit Studio", text: "Best equipment quality and amazing features provided by them. Highly recommended!" },
    { id: 3, name: "Imran Butt", role: "Director, Powerhouse Gym", text: "Their support and maintenance service is exceptional. They truly care about their clients." },
    { id: 4, name: "Zeeshan Ahmed", role: "Manager, Iron Paradise", text: "Fastest delivery and installation I've ever seen in Pakistan. Great experience!" },
    { id: 5, name: "Maria Malik", role: "Founder, Bloom Fitness", text: "The 3D design planning helped us visualize our space perfectly before buying equipment." },
    { id: 6, name: "Omar Sheikh", role: "Owner, Muscle Factory", text: "Top-notch durability. Our machines are running 24/7 without any issues for 2 years." },
    { id: 7, name: "Ali Raza", role: "CEO, Elite Gym", text: "Professional staff and very responsive support team. Five stars!" },
    { id: 8, name: "Sana Javed", role: "Owner, Ladies First Gym", text: "The customized ladies-specific equipment is exactly what we needed." },
    { id: 9, name: "Farhan Shah", role: "Director, Gold's Club", text: "Premium finish and modern aesthetics. Our clients love the new setup." },
    { id: 10, name: "Kamran Akmal", role: "Owner, Active Life", text: "Value for money. You won't find this quality at this price range anywhere else." },
  ];

  return (
    <section className="bg-black py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-[#97FF02] font-bold uppercase tracking-widest text-lg mb-4">Testimonials</h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">What Our Clients Say</h2>
      </div>

      {/* Main Wrapper with Relative position and extra horizontal padding for arrows */}
      <div className="max-w-7xl mx-auto relative px-10 md:px-20">
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            el: '.custom-pagination' 
          }}
          navigation={{
            prevEl,
            nextEl,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevEl;
            swiper.params.navigation.nextEl = nextEl;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <div className="bg-[#111] p-8 rounded-xl border border-white/5 h-full min-h-[320px] flex flex-col justify-between hover:border-[#97FF02]/40 transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="text-[#97FF02] w-8 h-8 rotate-180 opacity-40" />
                    <Quote className="text-[#97FF02] w-8 h-8 opacity-40" />
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic mb-6">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-bold text-lg">{review.name}</h4>
                  <p className="text-[#97FF02] text-[10px] uppercase tracking-widest font-bold mt-1">
                    {review.role}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* --- Updated Arrows: Vertically Centered & Spread Out --- */}
        <button 
          ref={(node) => setPrevEl(node)}
          className="btn-hover-icon btn-icon-green-fill absolute left-0 lg:left-[-20px] top-[40%] -translate-y-1/2 z-50 bg-white/5 p-2.5 sm:p-3 md:p-4 rounded-full border border-white/10 text-white group active:scale-[0.98]"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </button>
        
        <button 
          ref={(node) => setNextEl(node)}
          className="btn-hover-icon btn-icon-green-fill absolute right-0 lg:right-[-20px] top-[40%] -translate-y-1/2 z-50 bg-white/5 p-2.5 sm:p-3 md:p-4 rounded-full border border-white/10 text-white group active:scale-[0.98]"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Pagination Dots */}
        <div className="custom-pagination flex justify-center gap-3 mt-12"></div>
      </div>
    </section>
  );
}
