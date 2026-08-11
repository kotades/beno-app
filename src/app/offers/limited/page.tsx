'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function LimitedOffersPage() {
  const [filter, setFilter] = useState('all');
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: 1,
      category: 'yachts',
      title: 'Mega Yacht Jude (74ft) - Sunset Special',
      badge: '60% OFF',
      discountPct: 60,
      image: '/assets/home-imgs/new-yacht.webp',
      originalPrice: '$5,000',
      salePrice: '$2,000',
      unit: '/ hour',
      specs: '27 Guests | 3 Cabins | Free Soft Drinks',
      code: 'BENO60'
    },
    {
      id: 2,
      category: 'cars',
      title: 'Ferrari 296 GTS Red - Flash Deal',
      badge: '50% OFF',
      discountPct: 50,
      image: '/assets/home-imgs/Ferrari_296_GTS_.webp',
      originalPrice: '$5,500',
      salePrice: '$2,750',
      unit: '/ day (250 km)',
      specs: '2 Seats | 830 HP | V8 Hybrid Turbo',
      code: 'FERRARI50'
    },
    {
      id: 3,
      category: 'buggies',
      title: 'Polaris RZR XP 1000cc Buggy - Dune Package',
      badge: '50% OFF',
      discountPct: 50,
      image: '/assets/home-imgs/Polaris_RZR_XP_1000cc__2_seate.webp',
      originalPrice: '$1,690',
      salePrice: '$845',
      unit: '/ hour',
      specs: '2 Seater | Helmet & Goggles Included',
      code: 'BUGGY50'
    },
    {
      id: 4,
      category: 'cars',
      title: 'Chevrolet Corvette Stingray C8 Convertible',
      badge: '45% OFF',
      discountPct: 45,
      image: '/assets/home-imgs/Chevrolet_Corvette_Stingray_C8.webp',
      originalPrice: '$1,300',
      salePrice: '$715',
      unit: '/ day',
      specs: '2 Seats | 6.2L V8 | Targa Top',
      code: 'C8FLASH'
    },
    {
      id: 5,
      category: 'yachts',
      title: 'Luxury Yacht Cali (45ft) - Daytime Cruise',
      badge: '40% OFF',
      discountPct: 40,
      image: '/assets/home-imgs/new-yacht.webp',
      originalPrice: '$1,500',
      salePrice: '$900',
      unit: '/ hour',
      specs: '10 Guests | 3 Cabins | Captain & Crew',
      code: 'CALI40'
    },
    {
      id: 6,
      category: 'water',
      title: 'Yamaha Jet Ski 1800cc High Performance',
      badge: '55% OFF',
      discountPct: 55,
      image: '/assets/home-imgs/new-water-sports.webp',
      originalPrice: '$800',
      salePrice: '$360',
      unit: '/ 30 mins',
      specs: '2 Seater | Life Jackets Provided',
      code: 'JET55'
    }
  ];

  const filteredOffers = filter === 'all' ? offers : offers.filter(o => o.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER WITH COUNTDOWN */}
        <div className="bg-gradient-to-r from-teal-900 via-gray-900 to-[#121621] rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#008B9B]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-4 max-w-2xl">
              <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                ⚡ Flash Sale • Limited Quantity
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Limited Time Offers <br />
                <span className="text-[#008B9B]">Up to 60% OFF</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Grab the world's best rental deals on luxury yachts, supercars, and desert buggies before time runs out. Guaranteed lowest price direct booking.
              </p>
            </div>

            {/* TIMER BOX */}
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/15 text-center min-w-[280px]">
              <span className="text-xs uppercase font-bold tracking-widest text-teal-300 block mb-3">
                Offer Expires In:
              </span>
              <div className="flex justify-center items-center space-x-3">
                <div className="bg-black/40 px-4 py-3 rounded-2xl">
                  <span className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-400 block uppercase">Hours</span>
                </div>
                <span className="text-xl font-bold text-teal-400">:</span>
                <div className="bg-black/40 px-4 py-3 rounded-2xl">
                  <span className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-400 block uppercase">Mins</span>
                </div>
                <span className="text-xl font-bold text-teal-400">:</span>
                <div className="bg-black/40 px-4 py-3 rounded-2xl">
                  <span className="text-2xl sm:text-3xl font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-400 block uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {[
            { id: 'all', label: 'All Offers' },
            { id: 'yachts', label: 'Yachts (Up to 60%)' },
            { id: 'cars', label: 'Supercars (Up to 50%)' },
            { id: 'buggies', label: 'Dune Buggies (50%)' },
            { id: 'water', label: 'Watersports (55%)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === cat.id
                  ? 'bg-[#008B9B] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* OFFERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between group">
              <div>
                {/* IMAGE & BADGES */}
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg tracking-wider">
                    {offer.badge}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-xs font-bold text-gray-900 px-3 py-1 rounded-full shadow">
                    Code: <span className="text-[#008B9B] font-extrabold">{offer.code}</span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">
                    {offer.specs}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-4">{offer.title}</h3>
                  
                  <div className="flex items-baseline space-x-3 mb-4">
                    <span className="text-2xl font-black text-[#008B9B]">{offer.salePrice}</span>
                    <span className="text-sm font-medium text-gray-400 line-through">{offer.originalPrice}</span>
                    <span className="text-xs text-gray-500">{offer.unit}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-6 pt-0">
                <Link
                  href="/booking/retrieve"
                  className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md group-hover:shadow-lg"
                >
                  <span>Claim Offer & Book</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
