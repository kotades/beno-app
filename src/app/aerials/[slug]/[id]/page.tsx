import Link from 'next/link';
import { notFound } from 'next/navigation';
import aerialsDbData from '@/data/aerials_db.json';
import Footer from '@/components/Footer';
import ReserveButton from '@/components/ReserveButton';

export default async function AerialDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await params;
  const aerials = aerialsDbData.aerials || [];

  const aerial = aerials.find((a: any) => a.id === resolvedParams.id || a.slug === resolvedParams.slug);

  if (!aerial) {
    notFound();
  }

  const images = aerial.localImages && aerial.localImages.length > 0
    ? aerial.localImages
    : ['/assets/home-imgs/helicopter.webp'];

  const mainHero = images[0];
  const galleryThumbs = images.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* BREADCRUMBS */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/aerials" className="hover:text-gray-900">Helicopter Tours</Link>
          <span>/</span>
          <span className="text-[#008B9B] font-bold">{aerial.name}</span>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* MAIN HERO (2 COLS) */}
          <div className="lg:col-span-2 relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-gray-900 shadow-lg">
            <img src={mainHero} alt={aerial.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-cyan-800 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
              {aerial.duration || '12 Minutes'} • VIP Helipad Lounge
            </div>
          </div>

          {/* GALLERY THUMBNAILS (1 COL) */}
          <div className="grid grid-cols-2 gap-4 h-[380px] sm:h-[500px] overflow-y-auto scrollbar-hide">
            {galleryThumbs.map((img: string, i: number) => (
              <div key={i} className="relative h-full min-h-[140px] rounded-2xl overflow-hidden bg-gray-200 border border-gray-100">
                <img src={img} alt={`${aerial.name} photo ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MAIN DETAILS & BOOKING SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* FLIGHT SPECS & INFORMATION (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TITLE & SUMMARY */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{aerial.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Departure: Executive VIP Helipad Lounge (Worldwide Airport & Coastal Terminals)</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-cyan-50 text-[#008B9B] px-4 py-2 rounded-2xl font-bold text-sm">
                  <span>🚁 Guaranteed Window Seats</span>
                </div>
              </div>

              {/* SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Flight Duration</span>
                  <span className="text-lg font-black text-gray-900">{aerial.duration}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Helicopter Model</span>
                  <span className="text-lg font-black text-gray-900">Eurocopter H125</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Max Capacity</span>
                  <span className="text-lg font-black text-gray-900">5 Passengers</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Check-In</span>
                  <span className="text-lg font-black text-gray-900">45 Mins Prior</span>
                </div>
              </div>
            </div>

            {/* FLIGHT ROUTE LANDMARKS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Iconic Landmarks Seen During Flight</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {aerial.landmarks?.map((lm: string, idx: number) => (
                  <div key={idx} className="flex items-center text-xs font-semibold text-gray-700 bg-gray-50 p-3.5 rounded-xl">
                    <span className="text-[#008B9B] font-bold mr-3 text-sm">0{idx+1}</span>
                    <span>{lm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PASSENGER REQUIREMENTS & SAFETY */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Flight Requirements & Safety Guidelines</h3>
              <div className="space-y-3 text-xs text-gray-600 font-medium">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50">
                  <span className="text-base">🪪</span>
                  <div>
                    <span className="font-bold text-gray-900 block">Original ID Required:</span>
                    <span>All passengers must bring an Original Passport or Emirates ID for helipad security clearance.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50">
                  <span className="text-base">🌤️</span>
                  <div>
                    <span className="font-bold text-gray-900 block">Weather Guarantee:</span>
                    <span>Flights are subject to weather condition safety approvals. In case of poor visibility, full free rescheduling or 100% refund is guaranteed.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT BOOKING SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-28 space-y-6">
            
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Per Person Sharing Rate</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-[#008B9B]">AED {Number(aerial.price_per_person).toLocaleString()}</span>
                <span className="text-gray-500 text-sm font-medium">/ person</span>
              </div>
              <span className="text-xs text-gray-400 block mt-1">Guaranteed window seat + VIP Lounge Check-in</span>
            </div>

            <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100 space-y-1">
              <span className="text-xs font-bold text-[#008B9B] uppercase block">Private Charter Option</span>
              <span className="text-base font-black text-gray-900">AED {Number(aerial.private_charter_price || aerial.price_per_person * 4).toLocaleString()}</span>
              <span className="text-[11px] text-gray-500 block">Book the entire 5-seater helicopter exclusively for your group</span>
            </div>

            <ReserveButton
              serviceName={aerial.name}
              category="Helicopter"
              price={Number(aerial.price_per_person)}
              image={mainHero}
            />

            <Link href="/aerials" className="block text-center text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors pt-2">
              ← Back to All Helicopter Tours
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
