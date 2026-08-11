'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BuyVsRentCalculatorPage() {
  const [vehicleType, setVehicleType] = useState<'supercar' | 'yacht'>('supercar');
  const [usageDays, setUsageDays] = useState(20);
  const [ownershipYears, setOwnershipYears] = useState(3);

  // Asset preset parameters
  const assets = {
    supercar: {
      name: 'Ferrari 296 GTS / Lambo Huracan',
      buyPrice: 1400000,
      dailyRentPrice: 2499,
      annualDepreciationPct: 0.18,
      annualInsurancePct: 0.05,
      annualMaintenance: 45000,
      annualStorage: 30000
    },
    yacht: {
      name: '74ft Luxury Motor Yacht',
      buyPrice: 6500000,
      dailyRentPrice: 12000,
      annualDepreciationPct: 0.15,
      annualInsurancePct: 0.04,
      annualMaintenance: 220000,
      annualStorage: 180000
    }
  };

  const asset = assets[vehicleType];

  // Calculations over ownership duration
  const totalDepreciation = asset.buyPrice * asset.annualDepreciationPct * ownershipYears;
  const totalInsurance = asset.buyPrice * asset.annualInsurancePct * ownershipYears;
  const totalMaintenance = asset.annualMaintenance * ownershipYears;
  const totalStorage = asset.annualStorage * ownershipYears;

  const totalBuyCost = totalDepreciation + totalInsurance + totalMaintenance + totalStorage;
  const totalRentCost = usageDays * asset.dailyRentPrice * ownershipYears;
  const savings = totalBuyCost - totalRentCost;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
            Financial Analysis Tool
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
            Buy vs. Rent Calculator
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Compare the true cost of owning a supercar or mega yacht versus renting on-demand with BENO. See how much capital you save worldwide.
          </p>
        </div>

        {/* CALCULATOR MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CONTROLS (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-8">
            
            {/* ASSET TYPE TOGGLE */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Select Category</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setVehicleType('supercar')}
                  className={`p-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all ${
                    vehicleType === 'supercar'
                      ? 'bg-[#008B9B] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>🏎️ Supercar</span>
                </button>

                <button
                  onClick={() => setVehicleType('yacht')}
                  className={`p-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-3 transition-all ${
                    vehicleType === 'yacht'
                      ? 'bg-[#008B9B] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>🚤 Luxury Yacht</span>
                </button>
              </div>
            </div>

            {/* ASSET PREVIEW */}
            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-semibold block">Target Vehicle</span>
                <span className="text-base font-bold text-gray-900">{asset.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-semibold block">Market Value</span>
                <span className="text-base font-bold text-[#008B9B]">AED {asset.buyPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* SLIDER 1: USAGE DAYS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-800">Days used per year</label>
                <span className="text-lg font-black text-[#008B9B]">{usageDays} Days / Year</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                value={usageDays}
                onChange={(e) => setUsageDays(Number(e.target.value))}
                className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008B9B]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 font-medium">
                <span>5 Days (Occasional)</span>
                <span>45 Days</span>
                <span>90 Days (Frequent)</span>
              </div>
            </div>

            {/* SLIDER 2: YEARS */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-800">Ownership Period</label>
                <span className="text-lg font-black text-[#008B9B]">{ownershipYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={ownershipYears}
                onChange={(e) => setOwnershipYears(Number(e.target.value))}
                className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008B9B]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 font-medium">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
              </div>
            </div>

            {/* EXPENSE BREAKDOWN TABS */}
            <div className="border-t border-gray-100 pt-6 space-y-3 text-xs text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Estimated Depreciation ({asset.annualDepreciationPct * 100}%/yr):</span>
                <span className="font-bold text-gray-900">AED {totalDepreciation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance & Registration ({ownershipYears} yrs):</span>
                <span className="font-bold text-gray-900">AED {totalInsurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance & Servicing ({ownershipYears} yrs):</span>
                <span className="font-bold text-gray-900">AED {totalMaintenance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Docking / Garage Storage ({ownershipYears} yrs):</span>
                <span className="font-bold text-gray-900">AED {totalStorage.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* RIGHT: COMPARISON SUMMARY (5 COLS) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#121621] to-[#1a2336] rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-8">
            
            <h3 className="text-xl font-bold border-b border-gray-800 pb-4">
              Financial Summary ({ownershipYears} Years)
            </h3>

            {/* COST TO OWN */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <span className="text-xs uppercase tracking-wider text-red-400 font-bold block mb-1">
                Total Cost of Buying & Owning
              </span>
              <span className="text-3xl font-black text-white">
                AED {totalBuyCost.toLocaleString()}
              </span>
              <p className="text-xs text-gray-400 mt-1">Includes depreciation loss, maintenance, storage & insurance.</p>
            </div>

            {/* COST TO RENT */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <span className="text-xs uppercase tracking-wider text-teal-400 font-bold block mb-1">
                Total Cost of Renting with BENO
              </span>
              <span className="text-3xl font-black text-teal-300">
                AED {totalRentCost.toLocaleString()}
              </span>
              <p className="text-xs text-gray-400 mt-1">For {usageDays * ownershipYears} total usage days over {ownershipYears} years.</p>
            </div>

            {/* SAVINGS BADGE */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-2xl text-gray-900 shadow-xl">
              <span className="text-xs uppercase tracking-wider font-extrabold block text-teal-950">
                Estimated Capital Saved
              </span>
              <span className="text-3xl font-black block mt-1">
                AED {Math.max(0, savings).toLocaleString()}
              </span>
              <p className="text-xs font-semibold text-teal-950 mt-1">
                {savings > 0 ? "You save capital, avoid depreciation loss, and enjoy 0 maintenance hassle." : "Full ownership matches high frequency usage."}
              </p>
            </div>

            {/* CTA BUTTON */}
            <Link
              href="/rent-a-car"
              className="w-full bg-[#008B9B] hover:bg-teal-400 text-white hover:text-gray-900 py-3.5 rounded-2xl font-bold text-sm text-center block transition-all shadow-lg"
            >
              Browse Luxury Fleet Now
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
