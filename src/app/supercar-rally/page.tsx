'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import ReserveButton from '@/components/ReserveButton';
import supercarRallyData from '@/data/supercar_rally_db.json';

export default function SupercarRallyPage() {
  const packages = supercarRallyData.packages || [];
  const fleet = supercarRallyData.fleet || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden mb-16 shadow-2xl bg-gray-950 min-h-[480px] flex flex-col justify-between p-6 sm:p-12 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="/assets/beno.com-supercar-rally-resources/04_supercar_rally_4.webp" 
              alt="UAE Supercar Rally Convoy"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl pt-4">
            <span className="bg-red-500/20 border border-red-400/40 text-red-400 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-4">
              Transcontinental Worldwide Supercar Rally
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
              Drive 5 Iconic Supercars in 1 Day <br />
              <span className="text-red-500">Transcontinental Mountain & Coast Rallies</span>
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Rotate through Ferrari, Lamborghini, Porsche, McLaren & Corvette in a high-octane convoy with lead pace car escort, 5-star mountain summit dining, and 4K GoPro media package.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-4 pt-6 border-t border-white/10 mt-8">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
              <span className="text-red-500 text-base">🏎️</span>
              <span>Rotate 5 Supercars</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
              <span className="text-red-500 text-base">📻</span>
              <span>Pit Comms & Lead Escort</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
              <span className="text-red-500 text-base">🍽️</span>
              <span>1484 by Puro Summit Lunch</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
              <span className="text-red-500 text-base">📹</span>
              <span>4K GoPro & Drone Package</span>
            </div>
          </div>
        </div>

        {/* RALLY PACKAGES GRID */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-1">Official Beno Rally Events</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Choose Your Supercar Rally Tour</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg: any) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full bg-gray-900">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow">
                      {pkg.distance} • {pkg.duration}
                    </div>
                    <div className="absolute top-4 right-4 bg-gray-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                      {pkg.cars_count}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold">{pkg.location}</p>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      {pkg.highlights.map((hl: string, idx: number) => (
                        <div key={idx} className="flex items-start text-xs text-gray-700 font-medium">
                          <span className="text-red-500 font-bold mr-2">✓</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Rally Package Rate</span>
                    <span className="text-2xl font-black text-red-600">{pkg.price_display}</span>
                  </div>

                  <ReserveButton
                    serviceName={pkg.name}
                    category="Supercar Rally"
                    price={pkg.price}
                    serviceId={pkg.id}
                    image={pkg.image}
                    className="bg-gray-900 hover:bg-red-600 text-white px-6 py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUPERCAR ROTATION FLEET */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-16 space-y-8">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-1">Convoy Powerhouse</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Rally Rotation Supercar Fleet</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleet.map((car: any) => (
              <div key={car.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                <div className="h-40 rounded-xl overflow-hidden bg-gray-900">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">{car.name}</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power:</span>
                    <span className="font-bold text-gray-900">{car.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">0-100 km/h:</span>
                    <span className="font-bold text-red-600">{car.zero_to_hundred}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Speed:</span>
                    <span className="font-bold text-gray-900">{car.top_speed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        </main>

      <Footer />
    </div>
  );
}
