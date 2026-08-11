'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-[#121621] via-gray-900 to-[#008B9B] rounded-3xl p-8 sm:p-14 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              About BENO Global Platform
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Redefining Luxury Rentals <br />
              <span className="text-[#008B9B]">All Over The World</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              BENO Global is the premier worldwide luxury experience platform headquartered in Miami, Florida. We connect guests directly with owned & managed fleets of supercars, mega yachts, desert buggies, and private aircraft across Miami, New York, Los Angeles, London, Monaco, and Paris.
            </p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { metric: '150+', label: 'Global Superyachts & Vessels' },
            { metric: '300+', label: 'Exotic Supercars Worldwide' },
            { metric: '25,000+', label: 'Global VIP Guests Served' },
            { metric: '4.9 ★', label: 'Worldwide Trustpilot Rating' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl sm:text-4xl font-black text-[#008B9B] block mb-2">{stat.metric}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#008B9B] flex items-center justify-center font-bold text-xl">
              🎯
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Global Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To deliver seamless, 1-click luxury experiences across ground, sea, and air all over the world. We eliminate middleman markups and guarantee transparent, uncompromised quality for every reservation.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#008B9B] flex items-center justify-center font-bold text-xl">
              ✨
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Excellence Standards</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every supercar, yacht, and private jet undergoes rigorous multi-point safety inspections prior to departure. Our guests receive white-glove 24/7 concierge assistance anywhere in the world.
            </p>
          </div>
        </div>

        {/* 4 PILLARS OF EXCELLENCE */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Why Guests Choose BENO Global</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Guaranteed 2026 Fleet', desc: 'Immaculately detailed, latest model supercars & superyachts with pristine interiors.' },
              { num: '02', title: '24/7 Global VIP Concierge', desc: 'Instant 24/7 assistance for door-to-door hotel & airport delivery and custom itineraries.' },
              { num: '03', title: 'No Hidden Fees', desc: 'Transparent upfront pricing including tax, full insurance options, and captain fees.' },
              { num: '04', title: 'Global Destination Hubs', desc: 'Operating across Miami, New York, Los Angeles, London, Monaco, Saint-Tropez & Paris.' }
            ].map((pillar, i) => (
              <div key={i} className="space-y-3">
                <span className="text-3xl font-black text-[#008B9B] block">{pillar.num}</span>
                <h4 className="font-bold text-gray-900 text-base">{pillar.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SPOTLIGHT LOCATION */}
        <div className="bg-gradient-to-r from-[#121621] to-[#1a2336] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">🇺🇸 Global Headquarters • Miami, FL</span>
            <h3 className="text-2xl sm:text-3xl font-bold">BENO Global Corporate HQ (Brickell Ave, Miami)</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Headquartered at 1000 Brickell Avenue in Miami, Florida, BENO operates dispatch terminals across the world's most prestigious luxury destinations.
            </p>
          </div>

          <Link
            href="/contact"
            className="bg-[#008B9B] hover:bg-teal-400 text-white hover:text-gray-900 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-lg"
          >
            Contact Global Concierge
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
