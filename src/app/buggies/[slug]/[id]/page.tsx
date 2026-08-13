import Link from 'next/link';
import { notFound } from 'next/navigation';
import buggiesDbData from '@/data/buggies_db.json';
import Footer from '@/components/Footer';
import ReserveButton from '@/components/ReserveButton';
import { formatCurrency } from '@/lib/currency';

export default async function BuggyDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await params;
  const buggies = buggiesDbData.buggies || [];

  const buggy = buggies.find((b: any) => b.id === resolvedParams.id || b.slug === resolvedParams.slug);

  if (!buggy) {
    notFound();
  }

  const images = buggy.localImages && buggy.localImages.length > 0
    ? buggy.localImages
    : ['/assets/home-imgs/buggy.webp'];

  const mainHero = images[0];
  const galleryThumbs = images.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* BREADCRUMBS */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/buggies" className="hover:text-gray-900">Buggies & Quad Bikes</Link>
          <span>/</span>
          <span className="text-amber-600 font-bold">{buggy.name}</span>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* MAIN HERO (2 COLS) */}
          <div className="lg:col-span-2 relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-gray-900 shadow-lg">
            <img src={mainHero} alt={buggy.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-amber-700 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
              {buggy.engine || '1000cc Turbo'} • {buggy.capacity || '2 Seater'}
            </div>
          </div>

          {/* GALLERY THUMBNAILS (1 COL) */}
          <div className="grid grid-cols-2 gap-4 h-[380px] sm:h-[500px] overflow-y-auto scrollbar-hide">
            {galleryThumbs.map((img: string, i: number) => (
              <div key={i} className="relative h-full min-h-[140px] rounded-2xl overflow-hidden bg-gray-200 border border-gray-100">
                <img src={img} alt={`${buggy.name} photo ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MAIN DETAILS & BOOKING SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* VEHICLE SPECS & INFORMATION (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TITLE & PRICE SUMMARY */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{buggy.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Location: Al Lahbab Red Dunes Desert Safari Park (Hotel Transfers Included)</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-2xl font-bold text-sm">
                  <span>🏜️ Red Dunes Safari</span>
                </div>
              </div>

              {/* SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Capacity</span>
                  <span className="text-lg font-black text-gray-900">{buggy.capacity || '2 Seater'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Engine</span>
                  <span className="text-lg font-black text-gray-900">{buggy.engine || '1000cc'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Transmission</span>
                  <span className="text-lg font-black text-gray-900">Automatic CVTech</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Safety Gear</span>
                  <span className="text-lg font-black text-gray-900">Helmets & Goggles</span>
                </div>
              </div>
            </div>

            {/* INCLUSIONS & AMENITIES */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Included With Your Desert Ride</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Sanitized Helmet & Protective Safety Goggles',
                  'Professional Desert Lead Escort & Guide',
                  'Unlimited Chilled Mineral Water & Soft Drinks',
                  'Complimentary Sandboarding Experience in Red Dunes',
                  'Doorstep Hotel Pickup & Drop-off Available',
                  'Full Safety Briefing & Orientation'
                ].map((inc, idx) => (
                  <div key={idx} className="flex items-center text-xs font-semibold text-gray-700 bg-gray-50 p-3.5 rounded-xl">
                    <span className="text-amber-500 mr-2.5">✓</span>
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIDER GUIDELINES & AGE REQUIREMENTS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Rider Guidelines & Safety Rules</h3>
              <div className="space-y-3 text-xs text-gray-600 font-medium">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50">
                  <span className="text-base">🪪</span>
                  <div>
                    <span className="font-bold text-gray-900 block">ID Requirements:</span>
                    <span>Valid Passport or Emirates ID required for rider registration. Driving license is recommended but not mandatory for off-road dune tracks.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50">
                  <span className="text-base">🦺</span>
                  <div>
                    <span className="font-bold text-gray-900 block">Age Requirements:</span>
                    <span>Drivers must be 16+ years of age. Passengers in 2-Seater / 4-Seater buggies must be 6+ years old.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT BOOKING SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-28 space-y-6">
            
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Desert Rental Rate</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-amber-600">{formatCurrency(Number(buggy.price_per_day))}</span>
                <span className="text-gray-500 text-sm font-medium">/day</span>
              </div>
              <span className="text-xs text-gray-400 block mt-1">Includes Safety Gear + Desert Escort Guide</span>
            </div>

            <div className="space-y-3 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Pickup Transfer:</span>
                <span className="font-bold text-gray-900">Free Hotel Pickup</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Policy:</span>
                <span className="font-bold text-gray-900">Full Tank Included</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Rating:</span>
                <span className="font-bold text-gray-900">★ 5.0 (Verified Fleet)</span>
              </div>
            </div>

            <ReserveButton
              serviceName={buggy.name}
              category="Buggy"
              price={Number(buggy.price_per_day)}
              serviceId={buggy.id}
              image={mainHero}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl font-bold text-sm text-center block transition-all shadow-lg active:scale-95"
            />

            <Link href="/buggies" className="block text-center text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors pt-2">
              ← Back to All Buggies & Quad Bikes
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
