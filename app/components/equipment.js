"use client";

import React, { useState, useEffect } from 'react';

export default function Equipment() {
  const [loading, setLoading] = useState(true);
  const [equipmentData, setEquipmentData] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/gallery");
        if (response.ok) {
          const resData = await response.json();
          if (Array.isArray(resData)) {
            setEquipmentData(resData.map((item, idx) => ({
              id: item._id || idx,
              category: item.category || 'Strength Equipment',
              img: item.imageUrl
            })));
          }
        }
      } catch (error) {
        console.log("Failed to fetch equipment data.");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="bg-black py-26 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center mb-12 flex flex-col items-center">
          <div className="h-6 w-32 rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-4" />
          <div className="h-10 w-full max-w-[500px] rounded bg-neutral-900/80 animate-pulse border border-white/5 mb-12" />
          {/* Tab buttons skeleton */}
          <div className="flex gap-3 mb-12 overflow-x-auto w-full max-w-[600px] justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 rounded-full bg-neutral-900/80 animate-pulse border border-white/5 flex-shrink-0" />
            ))}
          </div>
          {/* Image grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-lg bg-neutral-900/80 animate-pulse border border-white/5 h-[260px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no equipment data exists from admin, do not render the section
  if (equipmentData.length === 0) {
    return null;
  }

  // Dynamically resolve only the active categories from the database items
  const activeCategories = ['All', ...Array.from(new Set(equipmentData.map(item => item.category)))];

  // Filtering Logic
  const filteredItems =
    activeTab === 'All'
      ? equipmentData
      : equipmentData.filter((item) => item.category === activeTab);

  // Initial 8 items
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  return (
    <section className="bg-black py-26 px-6 md:px-12 lg:px-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">Our Equipment</h3>
        <h2 className="text-white text-3xl md:text-5xl font-black mb-12">Premium Equipment for Every Need</h2>
        
        {/* Tabs Section */}
        <div className="relative mb-12">
          {/* Mobile: Horizontal scrollable row | Desktop: Centered flex wrap */}
          <div className="flex overflow-x-auto no-scrollbar scroll-smooth md:flex-wrap md:justify-center gap-3 md:gap-6 pb-4 md:pb-0 px-2">
            {activeCategories.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setShowAll(false); }}
                className={`btn-hover-tab whitespace-nowrap text-xs md:text-sm lg:text-base font-bold px-4 py-2 rounded-full border-2 flex-shrink-0 cursor-pointer ${
                  activeTab === tab 
                  ? 'bg-gym-green border-gym-green text-black scale-105 shadow-[0_0_15px_rgba(151,255,2,0.3)]' 
                  : 'btn-tab-hover border-white/10 text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ease-in-out">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-lg bg-[#0b0b0b] min-h-[280px] sm:min-h-[300px] lg:min-h-[260px]"
            >
              <img 
                src={item.img} 
                alt={item.category} 
                className="w-full h-full object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {filteredItems.length > 8 && (
          <div className="mt-12">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="btn-hover-outline btn-outline-green-fill border border-gym-green text-gym-green font-bold py-3 px-10 rounded-md uppercase tracking-widest text-sm active:scale-[0.98] cursor-pointer"
            >
              {showAll ? 'Show Less' : 'View All Equipment'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
