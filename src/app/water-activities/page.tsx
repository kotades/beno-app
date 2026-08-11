'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import watersportsDbData from '@/data/watersports_db.json';

export default function WaterActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (watersportsDbData && watersportsDbData.activities) {
      setActivities(watersportsDbData.activities);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Water Sports' },
    { id: 'Kayak & SUP', label: 'Kayak & Paddleboard' },
    { id: 'Jet Ski & Hydro-Sports', label: 'Jet Ski & Flyboard' },
    { id: 'Towables & Flying', label: 'Parasailing & Towables' }
  ];

  const filteredActivities = activeCategory === 'all'
    ? activities
    : activities.filter(a => 
        a.category?.toLowerCase() === activeCategory.toLowerCase() ||
        a.name?.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-950 via-[#0B2545] to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-cyan-100 text-cyan-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Worldwide Coastal Watersports
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Water Activities & Jet Ski Rental <br />
              <span className="text-cyan-400">Kayak, Flyboard, Parasailing & Seabob</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explore crystal-clear waters with luxury water sports equipment across Miami, Monaco, Amalfi, London & Paris. Certified lifeguards, safety gear & waterproof lockers included.
            </p>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#008B9B] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ACTIVITIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredActivities.map((activity) => {
            const mainImg = activity.localImages?.[0] || '/assets/home-imgs/watersports.webp';

            return (
              <Link 
                key={activity.id} 
                href={`/water-activities/${activity.slug}/${activity.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 justify-between"
              >
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-60 w-full bg-gray-900 overflow-hidden">
                    <img 
                      src={mainImg} 
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-4 left-4 bg-cyan-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {activity.duration || '60 Minutes'}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow">
                      Life Vest Included
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 truncate mb-2">{activity.name}</h2>
                    
                    <div className="flex items-center text-xs text-gray-500 font-semibold space-x-2 mb-4">
                      <span>{activity.category || 'Water Sports'}</span>
                      <span>•</span>
                      <span>Certified Instructor</span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-[#008B9B]">AED {Number(activity.price).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 font-medium">/ session</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="p-6 pt-0">
                  <div className="w-full bg-gray-100 group-hover:bg-[#008B9B] group-hover:text-white text-gray-800 py-3 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center space-x-2">
                    <span>View Activity & Reserve</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
            No water activities found matching "{activeCategory}". Select "All Water Sports" to view all available experiences.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
