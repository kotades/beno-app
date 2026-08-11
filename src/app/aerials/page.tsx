'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import aerialsDbData from '@/data/aerials_db.json';

export default function AerialsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [aerials, setAerials] = useState<any[]>([]);

  useEffect(() => {
    if (aerialsDbData && aerialsDbData.aerials) {
      setAerials(aerialsDbData.aerials);
    }
  }, []);

  const filters = [
    { id: 'all', label: 'All Flights' },
    { id: '12', label: '12 Mins (Iconic)' },
    { id: '17', label: '17 Mins (The Palm)' },
    { id: '22', label: '22 Mins (The Vision)' },
    { id: '45', label: '45 Mins (Grand Tour)' }
  ];

  const filteredAerials = activeFilter === 'all'
    ? aerials
    : aerials.filter(a => a.duration?.includes(activeFilter) || a.name?.toLowerCase().includes(activeFilter));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0F2027] to-cyan-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Helicopter Tours & VIP Charters
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Executive Helicopter Tours Worldwide <br />
              <span className="text-[#008B9B]">Fly Above World-Famous Skylines & Coastlines</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Witness iconic skylines and natural wonders from the sky. Guaranteed window seats, certified commercial pilots, and VIP helipad lounge check-in worldwide.
            </p>
          </div>
        </div>

        {/* DURATION FILTERS */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {filters.map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === flt.id
                  ? 'bg-[#008B9B] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* AERIAL FLIGHTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAerials.map((aerial) => {
            const mainImg = aerial.localImages?.[0] || '/assets/home-imgs/helicopter.webp';

            return (
              <Link 
                key={aerial.id} 
                href={`/aerials/${aerial.slug}/${aerial.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 justify-between"
              >
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-60 w-full bg-gray-900 overflow-hidden">
                    <img 
                      src={mainImg} 
                      alt={aerial.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-4 left-4 bg-cyan-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {aerial.duration || '12 Minutes'}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow">
                      VIP Lounge Included
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 truncate mb-2">{aerial.name}</h2>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                      {aerial.landmarks?.join(' • ') || 'Iconic Coastal Skylines, Islands & Landmark Panoramas'}
                    </p>
                    
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-[#008B9B]">${Number(aerial.price_per_person).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 font-medium">/ person</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="p-6 pt-0">
                  <div className="w-full bg-gray-100 group-hover:bg-[#008B9B] group-hover:text-white text-gray-800 py-3 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center space-x-2">
                    <span>View Flight & Reserve</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {filteredAerials.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
            No Helicopter tours found. Select "All Flights" to view all available aerial experiences.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
