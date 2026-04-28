"use client";
import { useState } from 'react';

export default function Equipment() {
  const [activeTab, setActiveTab] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const categories = ['All', 'Cardio Machines', 'Strength Equipment', 'Free Weights', 'Functional Training'];

  // Dummy Data: Aap apni images ke URLs yahan replace kar sakte hain
 const equipmentData = [
    // Cardio Machines (8 Images)
    { id: 1, category: 'Cardio Machines', img: 'https://media.istockphoto.com/id/2156426866/photo/modern-fitness-center-with-treadmills-and-stationary-bikes.jpg?s=612x612&w=0&k=20&c=e__r9uudD7BUU6r9LAarmGfLdbMQplcn6agkJ94XysU=' },
    { id: 2, category: 'Cardio Machines', img: 'https://myfitnessjunction.co.uk/cdn/shop/articles/cross_trainers_for_sale_e2ae2de5-ea62-4a02-88ab-194689c1049b.jpg?v=1762520316&width=1100' },
    { id: 3, category: 'Cardio Machines', img: 'https://gymleco.com/cdn/shop/files/A7S07698-scaled.jpg?crop=region&crop_height=1710&crop_left=425&crop_top=0&crop_width=1710&v=1758784671&width=2560' },
    { id: 4, category: 'Cardio Machines', img: 'https://www.massyarias.com/wp-content/uploads/2024/11/2-6-1024x745.jpg' },
    { id: 5, category: 'Cardio Machines', img: 'https://img.freepik.com/free-photo/cycling-equipment-healthy-fit-fitness_1139-686.jpg' },
    { id: 6, category: 'Cardio Machines', img: 'https://img.freepik.com/premium-photo/energetic-sportsman-is-doing-heavy-cardio-cross-fit-training-with-battle-ropes-indoor-gym-with-black-background-big-mirror_232070-11719.jpg' },
    { id: 7, category: 'Cardio Machines', img: 'https://s.alicdn.com/@sc04/kf/Ha5ba0c6c1809484eba776efb3bdb5e3ae/Commercial-Multi-Function-Climbing-Machine-Large-Fitness-Equipment-Stair-Machine-Aerobic-Exercise-Model-ZF-9700-for-Gym-Clubs.jpg_300x300.jpg' },
    { id: 8, category: 'Cardio Machines', img: 'https://xcelerategyms.com/wp-content/uploads/2026/03/image12.jpg' },

    // Strength Equipment (8 Images)
    { id: 9, category: 'Strength Equipment', img: 'https://png.pngtree.com/thumb_back/fh260/background/20230722/pngtree-3d-rendered-gym-equipment-against-a-dark-backdrop-image_3764393.jpg' },
    { id: 10, category: 'Strength Equipment', img: 'https://img.freepik.com/free-photo/kettlebell-dark-gym-with-dramatic-lighting_84443-83772.jpg?semt=ais_hybrid&w=740&q=80' },
    { id: 11, category: 'Strength Equipment', img: 'https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-dark-fitness-room-with-training-equipment-and-black-dumbbells-on-the-image_3698810.jpg' },
    { id: 12, category: 'Strength Equipment', img: 'https://t3.ftcdn.net/jpg/01/19/59/74/360_F_119597487_SnvLBdheEGOxu05rMQ5tCzo250cRrTz9.jpg' },
    { id: 13, category: 'Strength Equipment', img: 'https://img.freepik.com/free-photo/3d-gym-equipment_23-2151114150.jpg' },
    { id: 14, category: 'Strength Equipment', img: 'https://t4.ftcdn.net/jpg/09/02/08/61/360_F_902086199_B6rJ2KebOcmJrzC7weRBb7hJiPffn9nu.jpg' },
    { id: 15, category: 'Strength Equipment', img: 'https://img.pikbest.com/ai/illus_our/20230425/36bcd368e83c22648103db6028e98d3a.jpg!w700wp' },
    { id: 16, category: 'Strength Equipment', img: 'https://thumbs.dreamstime.com/b/fitness-center-interior-showcasing-sport-workout-equipment-modern-gym-contemporary-crossfit-gear-274949711.jpg' },

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

  // Filtering Logic
  const filteredItems = activeTab === 'All' 
    ? [...equipmentData].sort(() => 0.5 - Math.random()) // All tab par images ko shuffle/randomize kiya
    : equipmentData.filter(item => item.category === activeTab);

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
        className={`whitespace-nowrap text-xs md:text-sm lg:text-base font-bold px-4 py-2 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
          activeTab === tab 
          ? 'bg-gym-green border-gym-green text-black scale-105 shadow-[0_0_15px_rgba(151,255,2,0.3)]' 
          : 'border-white/10 text-gray-500 hover:border-gym-green/50 hover:text-white'
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
            <div key={item.id} className="relative group overflow-hidden rounded-lg aspect-video">
              <img 
                src={item.img} 
                alt={item.category} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
              className="border border-gym-green text-gym-green hover:bg-gym-green hover:text-black font-bold py-3 px-10 rounded-md transition-all duration-300 uppercase tracking-widest text-sm"
            >
              {showAll ? 'Show Less' : 'View All Equipment'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}