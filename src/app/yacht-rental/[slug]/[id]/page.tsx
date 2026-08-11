import Link from 'next/link';
import { notFound } from 'next/navigation';
import yachtsDb from '@/data/yachts_db.json';
import Footer from '@/components/Footer';
import ReserveButton from '@/components/ReserveButton';
import { formatCurrency } from '@/lib/currency';

export default async function YachtDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await params;
  
  // Find yacht by ID or slug match
  const yacht = yachtsDb.yachts.find(y => y.id === resolvedParams.id || y.slug === resolvedParams.slug);

  if (!yacht) {
    notFound();
  }

  // Get verified local images
  const images = yacht.localImages && yacht.localImages.length > 0
    ? yacht.localImages
    : ['/assets/home-imgs/new-yacht.webp'];

  const mainHero = images[0];
  const galleryThumbs = images.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/yacht-rental" className="hover:text-gray-900">Yachts</Link>
          <span>/</span>
          <span className="text-[#008B9B] font-bold">{yacht.name}</span>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* MAIN HERO IMAGE (2 COLS) */}
          <div className="lg:col-span-2 relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-gray-900 shadow-lg">
            <img src={mainHero} alt={yacht.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-teal-800 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
              {yacht.length_ft}ft Luxury Motor Yacht
            </div>
            {yacht.discount_pct > 0 && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow">
                Save {yacht.discount_pct}%
              </div>
            )}
          </div>

          {/* GALLERY THUMBNAILS GRID (1 COL) */}
          <div className="grid grid-cols-2 gap-4 h-[380px] sm:h-[500px] overflow-y-auto scrollbar-hide">
            {galleryThumbs.map((img, i) => (
              <div key={i} className="relative h-full min-h-[140px] rounded-2xl overflow-hidden bg-gray-200 border border-gray-100">
                <img src={img} alt={`${yacht.name} gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* DETAIL CONTENT & BOOKING WIDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* MAIN DETAILS (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TITLE & META */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{yacht.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Docked at {yacht.location || 'Global VIP Marina Berth'}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-teal-50 text-[#008B9B] px-4 py-2 rounded-2xl font-bold text-sm">
                  <span>★ {yacht.rating || '5.0'}</span>
                  <span className="text-gray-400">({yacht.reviews || 24} reviews)</span>
                </div>
              </div>

              {/* SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Length</span>
                  <span className="text-lg font-black text-gray-900">{yacht.length_ft} ft</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Guests</span>
                  <span className="text-lg font-black text-gray-900">{yacht.guests} Max</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Cabins</span>
                  <span className="text-lg font-black text-gray-900">{yacht.cabins}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Min Charter</span>
                  <span className="text-lg font-black text-gray-900">{yacht.min_rental_hours || 2} Hours</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">About {yacht.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {yacht.description || `${yacht.name} is a high-end luxury motor yacht offering spacious deck seating, sunbathing lounges, air-conditioned interior salons, and fully equipped entertainment systems. Ideal for private celebrations, corporate events, and sunset cruises.`}
              </p>
            </div>

            {/* FEATURES & INCLUSIONS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Charter Amenities & Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {(yacht.features || ["Air Conditioning", "Kitchen & Fridge", "Safety Gear", "Fuel Included", "Sound System", "Captain & Crew"]).map((f, i) => (
                  <div key={i} className="flex items-center text-xs font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <span className="text-teal-500 mr-2">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROUTE DETAILS */}
            {yacht.route_details && (
              <div className="bg-teal-50/60 rounded-3xl p-6 sm:p-8 border border-teal-100 space-y-3">
                <h3 className="text-lg font-bold text-teal-950">Recommended Cruise Routes</h3>
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed font-medium">
                  {yacht.route_details}
                </p>
              </div>
            )}

          </div>

          {/* RIGHT BOOKING SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-28 space-y-6">
            
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Charter Rate</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-[#008B9B]">{formatCurrency(yacht.price_per_hour || 0)}</span>
                <span className="text-gray-500 text-sm font-medium">/ hour</span>
              </div>
              {yacht.original_price_per_hour > 0 && (
                <span className="text-xs text-gray-400 line-through font-medium block mt-1">
                  Original: {formatCurrency(yacht.original_price_per_hour || 0)} / hour
                </span>
              )}
            </div>

            {/* SELECTION SUMMARY */}
            <div className="space-y-4 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Included:</span>
                <span className="font-bold text-gray-900">Captain, Crew & Fuel</span>
              </div>
              <div className="flex justify-between">
                <span>Refreshments:</span>
                <span className="font-bold text-gray-900">Soft Drinks & Water</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-bold text-gray-900">Global VIP Marina</span>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <ReserveButton
              serviceName={yacht.name}
              category="Yacht"
              price={yacht.price_per_hour}
              serviceId={yacht.id}
              image={mainHero}
            />

            <Link href="/yacht-rental" className="block text-center text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors pt-2">
              ← Back to All Yachts
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
