import Link from 'next/link';
import { notFound } from 'next/navigation';
import watersportsDbData from '@/data/watersports_db.json';
import Footer from '@/components/Footer';
import ReserveButton from '@/components/ReserveButton';

export default async function WaterActivityDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await params;
  const activities = watersportsDbData.activities || [];

  const activity = activities.find((a: any) => a.id === resolvedParams.id || a.slug === resolvedParams.slug);

  if (!activity) {
    notFound();
  }

  const images = activity.localImages && activity.localImages.length > 0
    ? activity.localImages
    : ['/assets/home-imgs/watersports.webp'];

  const mainHero = images[0];
  const galleryThumbs = images.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-24">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* BREADCRUMBS */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/water-activities" className="hover:text-gray-900">Water Activities</Link>
          <span>/</span>
          <span className="text-[#008B9B] font-bold">{activity.name}</span>
        </div>

        {/* IMAGE GALLERY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
          {/* MAIN HERO (2 COLS) */}
          <div className="lg:col-span-2 relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-gray-900 shadow-lg">
            <img src={mainHero} alt={activity.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-cyan-800 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
              {activity.duration || '60 Minutes'} • ISO Life Vest Included
            </div>
          </div>

          {/* GALLERY THUMBNAILS (1 COL) */}
          <div className="grid grid-cols-2 gap-4 h-[380px] sm:h-[500px] overflow-y-auto scrollbar-hide">
            {galleryThumbs.map((img: string, i: number) => (
              <div key={i} className="relative h-full min-h-[140px] rounded-2xl overflow-hidden bg-gray-200 border border-gray-100">
                <img src={img} alt={`${activity.name} photo ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MAIN DETAILS & BOOKING SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ACTIVITY SPECS & INFORMATION (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TITLE & PRICE SUMMARY */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{activity.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">Location: Jumeirah Beach & Harbor Watersports Center</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-cyan-50 text-[#008B9B] px-4 py-2 rounded-2xl font-bold text-sm">
                  <span>🌊 Arabian Gulf Coast</span>
                </div>
              </div>

              {/* SPECIFICATIONS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Duration</span>
                  <span className="text-lg font-black text-gray-900">{activity.duration || '60 Minutes'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Category</span>
                  <span className="text-lg font-black text-gray-900">{activity.category || 'Water Sports'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Life Jacket</span>
                  <span className="text-lg font-black text-gray-900">ISO-Certified</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <span className="text-xs text-gray-400 font-bold uppercase block">Instructor</span>
                  <span className="text-lg font-black text-gray-900">Certified Escort</span>
                </div>
              </div>
            </div>

            {/* INCLUSIONS & AMENITIES */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Included With Your Water Activity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'ISO-Certified Safety Life Vests & Helmets Provided',
                  'Professional Certified Water Sports Instructor Escort',
                  'Waterproof Lockers & Changing Facility Access',
                  'Chilled Mineral Water & Towel Service',
                  'Full Pre-Flight / Pre-Ride Safety Briefing',
                  'Fresh Water Beach Shower Access'
                ].map((inc, idx) => (
                  <div key={idx} className="flex items-center text-xs font-semibold text-gray-700 bg-gray-50 p-3.5 rounded-xl">
                    <span className="text-teal-500 mr-2.5">✓</span>
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PARTICIPANT GUIDELINES & SAFETY */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Participant Guidelines & Swimming Rules</h3>
              <div className="space-y-3 text-xs text-gray-600 font-medium">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50">
                  <span className="text-base">🪪</span>
                  <div>
                    <span className="font-bold text-gray-900 block">ID Requirements:</span>
                    <span>Original Passport or Emirates ID required for beach reception registration.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50">
                  <span className="text-base">🏊</span>
                  <div>
                    <span className="font-bold text-gray-900 block">Swimming Requirement:</span>
                    <span>Basic swimming skills are required for all non-towed water sports. Life jackets must be worn at all times in the water.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT BOOKING SIDEBAR (4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 sticky top-28 space-y-6">
            
            <div className="border-b border-gray-100 pb-6">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Activity Session Rate</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-[#008B9B]">AED {Number(activity.price).toLocaleString()}</span>
                <span className="text-gray-500 text-sm font-medium">/ session</span>
              </div>
              <span className="text-xs text-gray-400 block mt-1">Includes Life Vest + Certified Instructor</span>
            </div>

            <div className="space-y-3 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-bold text-gray-900">Jumeirah Beach</span>
              </div>
              <div className="flex justify-between">
                <span>Locker Rental:</span>
                <span className="font-bold text-gray-900">Included Free</span>
              </div>
              <div className="flex justify-between">
                <span>Safety Rating:</span>
                <span className="font-bold text-gray-900">★ 5.0 (Certified Lifeguard)</span>
              </div>
            </div>

            <ReserveButton
              serviceName={activity.name}
              category="Water Activity"
              price={Number(activity.price)}
              image={mainHero}
            />

            <Link href="/water-activities" className="block text-center text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors pt-2">
              ← Back to All Water Activities
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
