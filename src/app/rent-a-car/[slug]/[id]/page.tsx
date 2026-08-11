import Link from 'next/link';
import { notFound } from 'next/navigation';
import carsDbData from '@/data/cars_db.json';
import Footer from '@/components/Footer';
import ReserveButton from '@/components/ReserveButton';

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await params;
  const cars = carsDbData.cars || [];

  // Match car by ID or slug
  const car = cars.find((c: any) => c.id === resolvedParams.id || c.slug === resolvedParams.slug);

  if (!car) {
    notFound();
  }

  const images = car.localImages && car.localImages.length > 0
    ? car.localImages
    : ['/assets/home-imgs/new-car.webp'];

  const mainHero = images[0];
  const galleryThumbs = images.slice(1, 7);
  const price = car.price_per_day || (car.price_display ? car.price_display.replace(/[^0-9]/g, '') : 499);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* BREADCRUMBS */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/rent-a-car" className="hover:text-gray-900">Cars</Link>
          <span>/</span>
          <span className="text-[#008B9B] font-bold">{car.name}</span>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* MAIN HERO (2 COLS) */}
          <div className="lg:col-span-2 relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-gray-900 shadow-lg">
            <img src={mainHero} alt={car.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-teal-800 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
              {car.brand || 'BENO'} • {car.category || 'Luxury'}
            </div>
          </div>

          {/* GALLERY THUMBNAILS (1 COL) */}
          <div className="grid grid-cols-2 gap-4 h-[380px] sm:h-[500px] overflow-y-auto scrollbar-hide">
            {galleryThumbs.map((img: string, i: number) => (
              <div key={i} className="relative h-full min-h-[140px] rounded-2xl overflow-hidden bg-gray-200 border border-gray-100">
                <img src={img} alt={`${car.name} gallery ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MAIN DETAILS & BOOKING SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* CAR SPECS & INFORMATION (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TITLE & PRICE SUMMARY */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{car.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Available for immediate delivery worldwide (Miami, NY, LA, London, Monaco, Paris)</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-teal-50 text-[#008B9B] px-4 py-2 rounded-2xl font-bold text-sm">
                  <span>★ 4.9</span>
                  <span className="text-gray-400">(Verified Fleet)</span>
                </div>
              </div>

              {/* SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Seating</span>
                  <span className="text-lg font-black text-gray-900">{(car.specs as any)?.seats || '4 Seats'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Doors</span>
                  <span className="text-lg font-black text-gray-900">{(car.specs as any)?.doors || '4 Doors'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Transmission</span>
                  <span className="text-lg font-black text-gray-900">Automatic</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Daily Mileage</span>
                  <span className="text-lg font-black text-gray-900">250 km / Day</span>
                </div>
              </div>
            </div>

            {/* INCLUSIONS & BENEFITS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Included With Your Rental</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Comprehensive Worldwide Insurance Included',
                  '24/7 Roadside Assistance & Breakdown Support',
                  'Free Doorstep Hotel & DXB Airport Delivery',
                  'Cleaned & Sanitized 2026 Model Condition',
                  'Flexible Security Deposit Terms',
                  'GPS Navigation & Apple CarPlay Enabled'
                ].map((inc, idx) => (
                  <div key={idx} className="flex items-center text-xs font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl">
                    <span className="text-teal-500 mr-2.5">✓</span>
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENTATION REQUIREMENTS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Required Documents for Rental</h3>
              <div className="space-y-3 text-xs text-gray-600 font-medium">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50">
                  <span className="text-base">🪪</span>
                  <div>
                    <span className="font-bold text-gray-900 block">Domestic Residents:</span>
                    <span>Valid State / National Driver's License + Government Issued Photo ID</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50">
                  <span className="text-base">✈️</span>
                  <div>
                    <span className="font-bold text-gray-900 block">International Guests / Tourists:</span>
                    <span>Passport + Home Country Driver's License (USA, EU, UK, GCC, Canada, Australia IDs accepted directly).</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT BOOKING SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-28 space-y-6">
            
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Rental Rate</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-[#008B9B]">AED {Number(price).toLocaleString()}</span>
                <span className="text-gray-500 text-sm font-medium">/ day</span>
              </div>
              <span className="text-xs text-gray-400 block mt-1">Includes 250 km / day allowance + VAT</span>
            </div>

            <div className="space-y-3 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Delivery Option:</span>
                <span className="font-bold text-gray-900">Free Hotel / Airport</span>
              </div>
              <div className="flex justify-between">
                <span>Deposit Term:</span>
                <span className="font-bold text-gray-900">Pre-auth Card Release</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Policy:</span>
                <span className="font-bold text-gray-900">Same-to-Same</span>
              </div>
            </div>

            <ReserveButton
              serviceName={car.name}
              category={car.category || 'Car'}
              price={Number(price)}
              serviceId={car.id}
              image={mainHero}
            />

            <Link href="/rent-a-car" className="block text-center text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors pt-2">
              ← Back to All Cars
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
