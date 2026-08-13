import Link from 'next/link';
import Image from 'next/image';
import yachtsDb from '@/data/yachts_db.json';
import Footer from '@/components/Footer';

export default function YachtsPage() {
  const yachts = yachtsDb.yachts || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-[#121621] via-gray-900 to-[#008B9B] rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Worldwide Premier Yacht Berths
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Luxury Yacht Rental Worldwide
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Witness pristine coastal sunsets on a luxury yacht charter across Miami, Monaco, Saint-Tropez, Amalfi, London & Paris. Relish golden hour from the comfort of your private deck.
            </p>
          </div>
        </div>

        {/* YACHTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {yachts.map((yacht) => {
            // Prioritize localImages, fallback to gallery if needed
            const mainImage = yacht.localImages?.[0] || '/assets/home-imgs/new-yacht.webp';

            return (
              <Link 
                key={yacht.id} 
                href={`/yacht-rental/${yacht.slug}/${yacht.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 justify-between"
              >
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={mainImage} 
                      alt={yacht.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* BADGES */}
                    <div className="absolute top-4 left-4 bg-teal-800 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Premium
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow flex items-center">
                      ★ {yacht.rating || '5.0'}
                    </div>

                    {yacht.discount_pct > 0 && (
                      <div className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                        {yacht.discount_pct}% OFF
                      </div>
                    )}
                  </div>
                  
                  {/* CONTENT DETAILS */}
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 font-semibold space-x-2 mb-2">
                      <span>{yacht.length_ft} ft</span>
                      <span>•</span>
                      <span>{yacht.guests} Guests</span>
                      <span>•</span>
                      <span>{yacht.cabins} Cabins</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 truncate mb-4">{yacht.name}</h2>
                    
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-[#008B9B]">${yacht.price_per_day?.toLocaleString()}</span>
                      {yacht.original_price_per_day > 0 && (
                        <span className="text-xs text-gray-400 line-through font-medium">${yacht.original_price_per_day?.toLocaleString()}</span>
                      )}
                      <span className="text-xs text-gray-500 font-medium">/day</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="p-6 pt-0">
                  <div className="w-full bg-gray-100 group-hover:bg-[#008B9B] group-hover:text-white text-gray-800 py-3 rounded-2xl font-bold text-xs text-center transition-all flex items-center justify-center space-x-2">
                    <span>View Yacht & Book</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
