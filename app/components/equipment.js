"use client";
import { useState } from 'react';

const categories = ['All', 'Cardio Machines', 'Strength Equipment', 'Free Weights', 'Functional Training'];

const equipmentData = [
  // Cardio Machines (1 Image)
  { id: 1, category: 'Cardio Machines', img: '/equipment-strength-2.png' },
  // Strength Equipment (8 Images)
  { id: 9, category: 'Strength Equipment', img: '/equipment-strength-1.png' },
  { id: 10, category: 'Strength Equipment', img: '/equipment-cardio-1.png' },
  { id: 11, category: 'Strength Equipment', img: '/equipment-strength-3.png' },
  { id: 12, category: 'Strength Equipment', img: '/equipment-strength-4.png' },
  { id: 13, category: 'Strength Equipment', img: '/equipment-strength-1.png' },
  { id: 14, category: 'Strength Equipment', img: '/equipment-strength-2.png' },
  { id: 15, category: 'Strength Equipment', img: '/equipment-strength-3.png' },
  { id: 16, category: 'Strength Equipment', img: '/equipment-strength-4.png' },
  // Functional Training (8 Images)
  { id: 17, category: 'Functional Training', img: 'https://img.freepik.com/premium-photo/equipment-machines-modern-gym-room-fitness-center-interior-with-equipment-bodybuilding-concept-background-crossfit-functional-training-practicing-powerlifting_771426-7072.jpg' },
  { id: 18, category: 'Functional Training', img: 'https://img.freepik.com/foto-gratis/pemandangan-ruang-gym-untuk-latihan-dan-olahraga_23-2151699520.jpg' },
  { id: 19, category: 'Functional Training', img: 'https://img.freepik.com/premium-photo/sci-fi-gym-room_783884-2823.jpg' },
  { id: 20, category: 'Functional Training', img: 'https://png.pngtree.com/thumb_back/fh260/background/20241219/pngtree-a-professional-fitness-center-with-diverse-range-of-exercise-machines-and-image_16822984.jpg' },
  { id: 21, category: 'Functional Training', img: 'https://img.freepik.com/premium-photo/modern-fitness-studio-with-gym-equipment-mirrors-bright-lighting-open-space-copy-space_127957-5510.jpg' },
  { id: 22, category: 'Functional Training', img: 'https://img.freepik.com/premium-photo/sleek-dark-wood-gym-exudes-luxury-ai-generation_724548-27372.jpg' },
  { id: 23, category: 'Functional Training', img: 'https://static.vecteezy.com/system/resources/thumbnails/037/228/850/small_2x/ai-generated-exercise-machines-in-a-gym-free-photo.jpg' },
  { id: 24, category: 'Functional Training', img: 'https://img.freepik.com/premium-photo/luxury-home-gym-featuring-state-art-equipment-including-treadmills-weight-machines-free-weights-all-set-elegant-wooden-interior-with-large-windows_908344-62032.jpg' },
  // Free Weights (8 Images)
  { id: 25, category: 'Free Weights', img: 'https://png.pngtree.com/thumb_back/fh260/background/20230525/pngtree-two-gold-iron-dumbbells-against-a-black-backdrop-image_2623138.jpg' },
  { id: 26, category: 'Free Weights', img: 'https://png.pngtree.com/background/20230618/original/pngtree-sleek-3d-black-dumbbells-for-professional-fitness-and-bodybuilding-on-a-picture-image_3755202.jpg' },
  { id: 27, category: 'Free Weights', img: 'https://png.pngtree.com/thumb_back/fh260/background/20230525/pngtree-video-footage-is-for-a-gold-dumbbells-isolated-on-black-image_2623139.jpg' },
  { id: 28, category: 'Free Weights', img: 'https://png.pngtree.com/thumb_back/fh260/background/20230523/pngtree-yellow-dumbbells-on-the-black-image_2604939.jpg' },
  { id: 29, category: 'Free Weights', img: 'https://png.pngtree.com/thumb_back/fh260/background/20231004/pngtree-3d-render-a-premium-gold-dumbbell-for-fitness-and-bodybuilding-image_13513904.png' },
  { id: 30, category: 'Free Weights', img: 'https://png.pngtree.com/thumb_back/fh260/background/20231007/pngtree-dual-gleaming-iron-dumbbells-in-isolation-captivating-3d-render-image_13572827.png' },
  { id: 31, category: 'Free Weights', img: 'https://png.pngtree.com/background/20250715/original/pngtree-gym-metal-texture-dumbbell-national-fitness-day-background-picture-image_15157186.jpg' },
  { id: 32, category: 'Free Weights', img: 'https://png.pngtree.com/background/20230526/original/pngtree-three-gold-dumbbells-are-placed-side-by-side-on-a-black-picture-image_2742093.jpg' },
];

export default function Equipment() {
  const [activeTab, setActiveTab] = useState('All');
  const [showAll, setShowAll] = useState(false);

  // Filtering Logic
  const filteredItems =
    activeTab === 'All'
      ? equipmentData
      : equipmentData.filter((item) => item.category === activeTab);

  // Initial 8 items dikhane ke liye
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  return (
    <section  className="bg-black py-26 px-6 md:px-12 lg:px-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">Our Equipment</h3>
        <h2 className="text-white text-3xl md:text-5xl font-black mb-12">Premium Equipment for Every Need</h2>
        
        {/* Tabs Section */}
        <div className="relative mb-12">
  {/* Mobile: Horizontal scrollable row | Desktop: Centered flex wrap */}
  <div className="flex overflow-x-auto no-scrollbar scroll-smooth md:flex-wrap md:justify-center gap-3 md:gap-6 pb-4 md:pb-0 px-2">
    {categories.map((tab) => (
      <button
        key={tab}
        onClick={() => { setActiveTab(tab); setShowAll(false); }}
        className={`btn-hover-tab whitespace-nowrap text-xs md:text-sm lg:text-base font-bold px-4 py-2 rounded-full border-2 flex-shrink-0 ${
          activeTab === tab 
          ? 'bg-gym-green border-gym-green text-black scale-105 shadow-[0_0_15px_rgba(151,255,2,0.3)]' 
          : 'btn-tab-hover border-white/10 text-gray-500'
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
              className="btn-hover-outline btn-outline-green-fill border border-gym-green text-gym-green font-bold py-3 px-10 rounded-md uppercase tracking-widest text-sm active:scale-[0.98]"
            >
              {showAll ? 'Show Less' : 'View All Equipment'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
