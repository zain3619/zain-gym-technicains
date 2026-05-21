"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Testimonials() {
  const [loading, setLoading] = useState(true);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (response.ok) {
          const resData = await response.json();
          if (Array.isArray(resData)) {
            setReviews(resData.map((item, idx) => ({
              id: item._id || idx,
              name: item.name || "Client Partner",
              role: item.role || "Satisfied Gym Owner",
              text: item.text || "",
              imageUrl: item.imageUrl || ""
            })));
          }
        }
      } catch (error) {
        console.log("Failed to fetch Testimonials from MERN API.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="bg-black py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16 flex flex-col items-center">
          <div className="h-6 w-32 rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-4" />
          <div className="h-10 w-full max-w-[500px] rounded bg-neutral-900/80 animate-pulse border border-white/5" />
        </div>
        <div className="max-w-7xl mx-auto px-10 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111] p-8 rounded-xl border border-white/5 h-[320px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between mb-6">
                  <div className="h-8 w-8 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
                  <div className="h-8 w-8 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
                </div>
                <div className="h-16 w-full rounded bg-neutral-900/80 animate-pulse border border-white/5" />
              </div>
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <div className="h-6 w-32 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
                <div className="h-4 w-20 rounded bg-neutral-900/80 animate-pulse border border-white/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no testimonials are returned from DB, do not render the section
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-black py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-[#97FF02] font-bold uppercase tracking-widest text-lg mb-4">Testimonials</h3>
        <h2 className="text-white text-3xl md:text-5xl font-black">What Our Clients Say</h2>
      </div>

      <div className="max-w-7xl mx-auto relative px-10 md:px-20">
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          loop={reviews.length > 3}
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
                
                {/* Premium client identification with real custom avatar image */}
                <div className="border-t border-white/10 pt-4 flex items-center gap-4">
                  {review.imageUrl ? (
                    <img 
                      src={review.imageUrl} 
                      alt={review.name} 
                      className="h-11 w-11 rounded-full object-cover border border-white/10 shrink-0" 
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-[radial-gradient(circle_at_35%_35%,#97FF02,rgba(0,0,0,1))] flex items-center justify-center text-black font-extrabold text-xs uppercase shrink-0">
                      {review.name?.substring(0, 2) || "CL"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-base leading-snug truncate">{review.name}</h4>
                    <p className="text-[#97FF02] text-[9px] uppercase tracking-widest font-extrabold mt-0.5 truncate">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <button 
          ref={(node) => setPrevEl(node)}
          className="btn-hover-icon btn-icon-green-fill absolute left-0 lg:left-[-20px] top-[40%] -translate-y-1/2 z-50 bg-white/5 p-2.5 sm:p-3 md:p-4 rounded-full border border-white/10 text-white group active:scale-[0.98] cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        </button>
        
        <button 
          ref={(node) => setNextEl(node)}
          className="btn-hover-icon btn-icon-green-fill absolute right-0 lg:right-[-20px] top-[40%] -translate-y-1/2 z-50 bg-white/5 p-2.5 sm:p-3 md:p-4 rounded-full border border-white/10 text-white group active:scale-[0.98] cursor-pointer"
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
