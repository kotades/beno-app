'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import privateJetData from '@/data/private_jet_db.json';

const BookingEngineModal = dynamic(() => import('@/components/BookingEngineModal'), { ssr: false });

export default function PrivateJetPage() {
  const [flightType, setFlightType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [fromCity, setFromCity] = useState('Miami Intl (MIA)');
  const [toCity, setToCity] = useState('Paris (LBG)');
  const [flightDate, setFlightDate] = useState('2026-08-20');
  const [passengers, setPassengers] = useState('4 Passengers');
  const [booking, setBooking] = useState<{ serviceName: string; category: string; price: number; serviceId: string; image?: string } | null>(null);

  const routes = privateJetData.routes || [];
  const fleet = privateJetData.fleet || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO SEARCH CONTAINER WITH LUXURY CABIN BACKGROUND */}
        <div className="relative rounded-3xl overflow-hidden mb-16 shadow-2xl bg-gray-950 min-h-[480px] flex flex-col justify-between p-6 sm:p-12 text-white">
          
          {/* BACKGROUND CABIN IMAGE */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/assets/beno.com-private-jet-resources/01_private_jet_1.jpg" 
              alt="Private Jet Luxury Interior"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          </div>

          {/* TITLE HEADER */}
          <div className="relative z-10 max-w-2xl pt-4">
            <span className="bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-4">
              Beno Executive Aviation
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-2">
              Search Private Jet Flights
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm">
              Global bespoke air charter with zero delays, VIP FBO terminal handling, and custom fine dining.
            </p>
          </div>

          {/* FLIGHT SEARCH BAR WIDGET */}
          <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-3xl mt-8 shadow-2xl">
            
            {/* TRIP TYPE TABS */}
            <div className="flex items-center space-x-2 mb-6">
              <button
                onClick={() => setFlightType('oneway')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  flightType === 'oneway'
                    ? 'bg-white text-gray-950 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                One Way
              </button>
              <button
                onClick={() => setFlightType('roundtrip')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  flightType === 'roundtrip'
                    ? 'bg-white text-gray-950 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Round Trip
              </button>
              <button
                onClick={() => setFlightType('multicity')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  flightType === 'multicity'
                    ? 'bg-white text-gray-950 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Multi-City
              </button>
            </div>

            {/* INPUT FIELDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* FROM */}
              <div className="md:col-span-3 bg-white/95 text-gray-900 p-3.5 rounded-2xl flex items-center space-x-3">
                <span className="text-gray-400 text-lg">🛫</span>
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">From</label>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none text-gray-900"
                    placeholder="Departure airport"
                  />
                </div>
              </div>

              {/* TO */}
              <div className="md:col-span-3 bg-white/95 text-gray-900 p-3.5 rounded-2xl flex items-center space-x-3">
                <span className="text-gray-400 text-lg">🛬</span>
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">To</label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none text-gray-900"
                    placeholder="Destination airport"
                  />
                </div>
              </div>

              {/* DATE */}
              <div className="md:col-span-2 bg-white/95 text-gray-900 p-3.5 rounded-2xl flex items-center space-x-3">
                <span className="text-gray-400 text-lg">📅</span>
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Date</label>
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* PASSENGERS */}
              <div className="md:col-span-2 bg-white/95 text-gray-900 p-3.5 rounded-2xl flex items-center space-x-3">
                <span className="text-gray-400 text-lg">👥</span>
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Passengers</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none text-gray-900"
                  >
                    <option value="1-4 Passengers">1 - 4 Passengers</option>
                    <option value="4-8 Passengers">4 - 8 Passengers</option>
                    <option value="8-14 Passengers">8 - 14 Passengers</option>
                  </select>
                </div>
              </div>

              {/* SEARCH CTA BUTTON */}
              <div className="md:col-span-2">
                <button
                  onClick={() => setBooking({ serviceName: `${fromCity} → ${toCity}`, category: 'Private Jet', price: 0, serviceId: 'custom-charter' })}
                  className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-4 rounded-2xl font-bold text-xs tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Search a flight</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* POPULAR ROUTES SECTION */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
            <div>
              <span className="text-xs font-bold text-[#008B9B] uppercase tracking-wider block mb-1">Global Direct Charters</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Popular Private Jet Routes</h2>
            </div>
            <p className="text-xs text-gray-500 max-w-md mt-2 sm:mt-0">
              Direct charter rates for non-stop VIP flights departing from Miami, New York, London, Monaco, Geneva, or Paris.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route: any) => (
              <div
                key={route.id}
                onClick={() => setBooking({ serviceName: `${route.from} → ${route.to}`, category: 'Private Jet', price: route.price, serviceId: route.id, image: route.image })}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-gray-100 hover:shadow-2xl transition-all"
              >
                <img 
                  src={route.image} 
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                    Flight Time: {route.duration}
                  </span>
                  <h3 className="text-xl font-black tracking-tight">{route.to.split('(')[0]}</h3>
                  <p className="text-xs text-gray-300 mb-3">{route.from} → {route.to}</p>
                  
                  <div className="flex justify-between items-center border-t border-white/20 pt-3">
                    <span className="text-xs text-gray-400 font-semibold">From {route.price_display}</span>
                    <span className="bg-white/20 group-hover:bg-[#008B9B] text-white px-3 py-1 rounded-full text-xs font-bold transition-all">
                      Inquire Flight →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRIVATE JET FLEET SHOWCASE */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-16 space-y-8">
          <div>
            <span className="text-xs font-bold text-[#008B9B] uppercase tracking-wider block mb-1">Ultra-Luxury Aviation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Featured Private Jet Fleet</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fleet.map((jet: any) => (
              <div key={jet.id} className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex flex-col justify-between">
                <div className="relative h-64 w-full bg-gray-900">
                  <img src={jet.images[0]} alt={jet.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    {jet.type}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{jet.name}</h3>
                      <p className="text-xs text-gray-500">{jet.passengers} • {jet.bed_setup}</p>
                    </div>
                    <span className="text-base font-black text-[#008B9B]">${Number(jet.price_per_hour).toLocaleString()} / hr</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-gray-700 pt-2 border-t border-gray-200">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-[10px] uppercase">Non-Stop Range</span>
                      <span>{jet.range}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-[10px] uppercase">Cruising Speed</span>
                      <span>{jet.speed}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setBooking({ serviceName: jet.name, category: 'Private Jet', price: +jet.price_per_hour, serviceId: `jet-${jet.id}` })}
                    className="w-full bg-gray-900 hover:bg-[#008B9B] text-white py-3 rounded-2xl font-bold text-xs text-center transition-all block"
                  >
                    Charter {jet.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING ENGINE MODAL */}
        {booking && (
          <BookingEngineModal
            isOpen={!!booking}
            onClose={() => setBooking(null)}
            serviceName={booking.serviceName}
            category={booking.category}
            price={booking.price}
            serviceId={booking.serviceId}
            image={booking.image}
          />
        )}

      </main>

      <Footer />
    </div>
  );
}
