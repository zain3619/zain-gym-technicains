"use client";
import { useState } from 'react';
import { MapPin, Maximize2 } from 'lucide-react';

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  const projectData = [
    {
      id: 1,
      name: "Allied Bank (Corporate Gym)",
      location: "Lahore",
      area: "3500 Sqft",
      beforeImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400",
      afterImg: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400",
    },
    {
      id: 2,
      name: "Nestle Wellness Center",
      location: "Sheikhupura",
      area: "5000 Sqft",
      beforeImg: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=400",
      afterImg: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400",
    },
    {
      id: 3,
      name: "Coca-Cola Fitness Club",
      location: "Faisalabad",
      area: "4200 Sqft",
      beforeImg: "https://t4.ftcdn.net/jpg/12/47/96/37/360_F_1247963773_JZzt7NYQ7LTpixqdJmy77uC0wtvwcLjK.jpg",
      afterImg: "https://cdn.prod.website-files.com/634053de3cf351fe4c9ff01b/634053de3cf351777f9ff4fd_fitness-center-gym-3d-model-max.jpg",
    },
    
    {
      id: 4,
      name: "Sukh Chayn Luxury Gym",
      location: "Lahore",
      area: "6000 Sqft",
      beforeImg: "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?q=80&w=400",
      afterImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400",
    },
    {
        id: 5,
        name: "Indigo Hotel Fitness",
        location: "Lahore",
        area: "2800 Sqft",
        beforeImg: "https://s3-media0.fl.yelpcdn.com/bphoto/Wgy-g4ximdvTHEww2Zd0_Q/ls.jpg",
        afterImg: "https://s3-media0.fl.yelpcdn.com/bphoto/F4hHpNrQ6zn4n5AU53-PUw/348s.jpg",
    },
    {
        id: 6,
        name: "Private Farm House Gym",
        location: "Bedian Road",
        area: "1500 Sqft",
        beforeImg: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=400",
        afterImg: "https://thefitnessoutlet.com/cdn/shop/articles/8ffdd791-88e7-4320-a4ae-d3644ca5da77_16e47585-539f-4d8b-a289-9db8dbcf7012.jpg?v=1770214853",
    }
  ];

  const displayedProjects = showAll ? projectData : projectData.slice(0, 3);

  return (
    <section id="projects" className="bg-black py-20 px-6 md:px-12 lg:px-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h3 className="text-gym-green font-bold uppercase tracking-widest text-lg mb-4">Our Projects</h3>
        <h2 className="text-white text-3xl md:text-5xl font-bold opacity-90">Gyms We're Proud Of</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {displayedProjects.map((project) => (
          <div key={project.id} className="bg-[#0f0f0f] rounded-lg overflow-hidden border border-gym-green/20 hover:border-gym-green/50 transition-all duration-500">
            
            {/* Before/After Image Container */}
            <div className="flex  sm:aspect-12/4  relative overflow-hidden">
              {/* Before Section */}
              <div className="w-1/2 relative">
                <img src={project.beforeImg} alt="Before" className="w-full h-full object-contain  transition-all duration-700" />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[9px] px-2 py-1 font-bold uppercase tracking-[0.2em] border border-white/10">Before</div>
              </div>
              
              {/* After Section */}
              <div className="w-1/2 relative border-l border-black/40">
                <img src={project.afterImg} alt="After" className="w-full h-full object-contain" />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[9px] px-2 py-1 font-bold uppercase tracking-[0.2em] border border-gym-green/30">After</div>
              </div>
            </div>

            {/* Content Area - Screenshot Style */}
            <div className="p-5">
              <h4 className="text-gym-green/90 text-base font-bold mb-4 tracking-tight">{project.name}</h4>
              
              <div className="flex justify-between items-center text-[11px] font-medium tracking-wide">
                <div className="flex items-center gap-1.5 text-white/60 uppercase">
                  <div className="p-1 bg-gym-green/10 rounded-sm">
                    <MapPin className="w-3 h-3 text-gym-green" />
                  </div>
                  {project.location}
                </div>
                
                <div className="flex items-center gap-1.5 text-white/60 uppercase">
                  <div className="p-1 bg-gym-green/10 rounded-sm">
                    <Maximize2 className="w-3 h-3 text-gym-green" />
                  </div>
                  {project.area}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button Style from Screenshot */}
      <div className="text-center mt-12">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="border border-gym-green/40 text-gym-green hover:bg-gym-green hover:text-black font-bold py-2 px-8 rounded text-[10px] uppercase tracking-[0.3em] transition-all duration-300"
        >
          {showAll ? 'Show Less' : 'View All Projects'}
        </button>
      </div>
    </section>
  );
}