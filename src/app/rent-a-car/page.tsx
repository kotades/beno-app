'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import carsDbData from '@/data/cars_db.json';

export default function RentACarPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    if (carsDbData && carsDbData.cars) {
      setCars(carsDbData.cars);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'Supercar', label: 'Supercars & Convertibles' },
    { id: 'SUV', label: 'Luxury SUVs & 4x4' },
    { id: 'Luxury', label: 'Executive & Sedan' },
    { id: 'Audi', label: 'Audi' },
    { id: 'Ferrari', label: 'Ferrari' },
    { id: 'Lamborghini', label: 'Lamborghini' },
    { id: 'Chevrolet', label: 'Chevrolet' },
    { id: 'Mercedes', label: 'Mercedes-Benz' }
  ];

  const filteredCars = activeCategory === 'all' 
    ? cars 
    : cars.filter(c => 
        c.category?.toLowerCase() === activeCategory.toLowerCase() || 
        c.brand?.toLowerCase() === activeCategory.toLowerCase() ||
        c.name?.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-gray-950 via-[#121621] to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Worldwide Fleet • Miami, NY, LA, London, Monaco, Paris
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Rent Supercars Worldwide <br />
              <span className="text-[#008B9B]">Hypercars, SUVs & Executive Sedans</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Experience the adrenaline of driving the world's finest supercars and luxury SUVs. Doorstep hotel & airport delivery worldwide, 24/7 VIP concierge support, and zero hidden fees.
            </p>
          </div>
        </div>

        {/* CATEGORY & BRAND FILTERS */}
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

        {/* CARS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCars.map((car) => {
            const mainImg = car.localImages?.[0] || '/assets/home-imgs/new-car.webp';
            const price = car.price_per_day || (car.price_display ? car.price_display.replace(/[^0-9]/g, '') : 499);

            return (
              <Link 
                key={car.id} 
                href={`/rent-a-car/${car.slug}/${car.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 justify-between"
              >
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-60 w-full bg-gray-900 overflow-hidden">
                    <img 
                      src={mainImg} 
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-4 left-4 bg-teal-800 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {car.category || 'Luxury'}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow">
                      {car.brand || 'BENO'}
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 font-semibold space-x-2 mb-2">
                      <span>{car.specs?.seats || '4 Seats'}</span>
                      <span>•</span>
                      <span>{car.specs?.doors || '4 Doors'}</span>
                      <span>•</span>
                      <span>Automatic</span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 truncate mb-4">{car.name}</h2>
                    
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-[#008B9B]">${Number(price).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 font-medium">/ day (250 km)</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="p-6 pt-0">
                  <div className="w-full bg-gray-100 group-hover:bg-[#008B9B] group-hover:text-white text-gray-800 py-3 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center space-x-2">
                    <span>View Car & Reserve</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
            No cars found matching "{activeCategory}". Select "All Vehicles" to view the full fleet.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
