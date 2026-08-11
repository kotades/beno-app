'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ExclusiveOffersPage() {
  const exclusiveBundles = [
    {
      id: 1,
      title: 'Supercar & Sunset Yacht Combo',
      badge: '30% OFF',
      category: 'VIP Experience Bundle',
      price: '$4,800',
      oldPrice: '$6,900',
      image: '/assets/home-imgs/Ferrari_296_GTS_.webp',
      description: 'Spend the afternoon cruising in a Ferrari 296 GTS, then step directly onto your private 45ft Luxury Yacht charter at the marina for a sunset voyage.',
      perks: ['24-Hour Ferrari Rental', '2-Hour Private Yacht Charter', 'Free Hotel Delivery', 'Chilled Champagne']
    },
    {
      id: 2,
      title: 'Desert Buggy & Helicopter Skyline Package',
      badge: '25% OFF',
      category: 'Thrill & Aviation',
      price: '$3,200',
      oldPrice: '$4,250',
      image: '/assets/home-imgs/Polaris_RZR_XP_1000cc__2_seate.webp',
      description: 'Conquer high desert dunes in a 1000cc Polaris RZR Buggy followed by a panoramic Helicopter flight over iconic coastal skylines.',
      perks: ['1000cc Buggy Rental (2-Seater)', '17-Min Heli Flight for 2', 'Safety Gear Provided', 'VIP Transfer']
    },
    {
      id: 3,
      title: 'Weekend Executive Jet & Lamborghini Pass',
      badge: '30% OFF',
      category: 'Private Jet + Supercar',
      price: '$18,500',
      oldPrice: '$26,000',
      image: '/assets/home-imgs/Lamborghini_Huracan_EVO_Spyder.webp',
      description: 'Private Jet flight between premier global destinations plus full weekend access to a Lamborghini Huracan EVO Spyder awaiting you on the tarmac.',
      perks: ['Private Jet Flight (Return)', 'Tarmac Supercar Delivery', 'VIP Lounge Access', 'Zero Deposit Option']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-gray-900 via-[#121621] to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              👑 BENO VIP Privileges
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Exclusive Luxury Packages <br />
              <span className="text-[#008B9B]">Up to 30% OFF</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Curated multi-vehicle experience bundles combining supercars, yachts, and private flights for discerning guests who demand the extraordinary.
            </p>
          </div>
        </div>

        {/* MEMBER PERKS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'VIP Host Assigned', desc: 'Dedicated 24/7 concierge for custom requests', icon: '👤' },
            { title: 'Zero Deposit Option', desc: 'Flexible verification for verified members', icon: '🛡️' },
            { title: 'Doorstep Delivery', desc: 'Free luxury vehicle delivery to your hotel or villa', icon: '🚚' },
            { title: 'Guaranteed Condition', desc: 'Immaculate 2026 fleet inspected before every booking', icon: '⭐' }
          ].map((perk, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
              <span className="text-3xl">{perk.icon}</span>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{perk.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* EXCLUSIVE BUNDLES LIST */}
        <div className="space-y-8">
          {exclusiveBundles.map((bundle) => (
            <div key={bundle.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col lg:flex-row items-stretch">
              
              {/* IMAGE SIDE */}
              <div className="relative lg:w-2/5 h-64 lg:h-auto bg-gray-900 overflow-hidden flex-shrink-0">
                <img src={bundle.image} alt={bundle.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-teal-800 text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {bundle.badge}
                </div>
              </div>

              {/* DETAILS SIDE */}
              <div className="p-6 sm:p-8 lg:w-3/5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                    {bundle.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{bundle.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{bundle.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {bundle.perks.map((p, idx) => (
                      <div key={idx} className="flex items-center text-xs font-semibold text-gray-700">
                        <span className="text-teal-500 mr-2">✓</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 block">Exclusive Package Rate</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-gray-900">{bundle.price}</span>
                      <span className="text-sm text-gray-400 line-through">{bundle.oldPrice}</span>
                    </div>
                  </div>

                  <Link
                    href="/booking/retrieve"
                    className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all"
                  >
                    Reserve VIP Bundle
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
