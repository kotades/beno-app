'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import buggiesDbData from '@/data/buggies_db.json';

export default function BuggiesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [buggies, setBuggies] = useState<any[]>([]);

  useEffect(() => {
    if (buggiesDbData && buggiesDbData.buggies) {
      setBuggies(buggiesDbData.buggies);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Desert Vehicles' },
    { id: '2 Seater', label: 'Dune Buggy (2 Seater)' },
    { id: '4 Seater', label: 'Dune Buggy (4 Seater)' },
    { id: 'Quad Bike', label: 'Quad Bikes (450cc - 700cc)' },
    { id: 'Dirt Bike', label: 'KTM Dirt Bikes' }
  ];

  const filteredBuggies = activeCategory === 'all'
    ? buggies
    : buggies.filter(b => 
        b.capacity?.toLowerCase() === activeCategory.toLowerCase() || 
        b.category?.toLowerCase() === activeCategory.toLowerCase() ||
        b.name?.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-amber-950 via-[#1C150D] to-orange-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Worldwide Off-Road & Desert Safaris
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Dune Buggy & Quad Bike Rental <br />
              <span className="text-amber-400">Can-Am Turbo, Polaris & CFMoto</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Conquer the high dunes of Al Lahbab with extreme high-performance desert buggies and quad bikes. Professional desert guide escorts, helmet gear & refreshments included.
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
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* BUGGIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBuggies.map((buggy) => {
            const mainImg = buggy.localImages?.[0] || '/assets/home-imgs/buggy.webp';

            return (
              <Link 
                key={buggy.id} 
                href={`/buggies/${buggy.slug}/${buggy.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 justify-between"
              >
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-60 w-full bg-gray-900 overflow-hidden">
                    <img 
                      src={mainImg} 
                      alt={buggy.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-4 left-4 bg-amber-700 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {buggy.engine || '1000cc Turbo'}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow">
                      {buggy.capacity || '2 Seater'}
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 truncate mb-2">{buggy.name}</h2>
                    
                    <div className="flex items-center text-xs text-gray-500 font-semibold space-x-2 mb-4">
                      <span>{buggy.category || 'Dune Buggy'}</span>
                      <span>•</span>
                      <span>Desert Guide Included</span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-amber-600">AED {Number(buggy.price_per_hour).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 font-medium">/ hour</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="p-6 pt-0">
                  <div className="w-full bg-gray-100 group-hover:bg-amber-600 group-hover:text-white text-gray-800 py-3 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center space-x-2">
                    <span>View Vehicle & Reserve</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {filteredBuggies.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
            No desert vehicles found matching "{activeCategory}". Select "All Desert Vehicles" to view the full fleet.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
