import Link from 'next/link';
import Footer from '@/components/Footer';

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-4xl mx-auto px-4 sm:px-8 w-full pb-20">
        
        {/* BACK TO BLOGS */}
        <Link href="/blogs" className="inline-flex items-center text-xs font-bold text-[#008B9B] hover:underline mb-6">
          ← Back to Beno Journal
        </Link>

        {/* ARTICLE HEADER */}
        <div className="space-y-4 mb-8">
          <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Worldwide Luxury Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            The Ultimate Guide to Worldwide Superyacht Chartering 2026
          </h1>
          <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium border-y border-gray-200 py-3">
            <span>By Beno Concierge Editorial</span>
            <span>•</span>
            <span>Aug 08, 2026</span>
            <span>•</span>
            <span>6 min read</span>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-xl mb-10 bg-gray-900">
          <img src="/assets/home-imgs/new-yacht.webp" alt="Yacht Chartering Guide" className="w-full h-full object-cover" />
        </div>

        {/* ARTICLE CONTENT */}
        <article className="prose prose-lg max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-gray-900 text-lg">
            BENO is globally renowned for its iconic waterfront fleets, pristine ocean waters, and world-class mega yacht harbors across Miami, Monaco, Amalfi, London, and Paris. Whether you are hosting an intimate sunset celebration or a corporate VIP gathering, chartering a private luxury yacht with BENO offers an unmatched experience.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-4">1. Choosing the Right Yacht Size for Your Party</h2>
          <p>
            Select your vessel according to your guest capacity and event style. For intimate couples or families up to 10 guests, the 42ft Luxury Yacht <strong>Arya</strong> or 45ft <strong>Cali</strong> provide plush sunbeds, air-conditioned lounges, and intimate dining decks. For larger gatherings up to 27 guests, the 74ft <strong>Jude</strong> offers three full cabins, flybridge dance decks, and sound systems.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-4">2. Best Cruise Routes & Photo Locations</h2>
          <p>
            Standard 3-hour charters depart directly from premier global marinas. Key highlights along the routes include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Miami Biscayne Bay & Star Island:</strong> Spectacular backdrop under luxury waterfront mansions and skyline lights.</li>
            <li><strong>Monaco Port Hercules & Riviera Coast:</strong> Crystal clear waters ideal for jet ski add-ons and swimming stops.</li>
            <li><strong>Amalfi Coast & Capri Grottos:</strong> Cruise through iconic Mediterranean coastal formations.</li>
            <li><strong>Sunset Anchorage Points:</strong> Anchor beside world-famous landmarks for golden hour photo opportunities.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 pt-4">3. Onboard Catering & Watersports Add-Ons</h2>
          <p>
            Every BENO charter includes complimentary soft drinks, mineral water, ice, and dedicated licensed crew. You can easily request live BBQ chefs, gourmet catering platters, live DJs, or high-powered Yamaha Jet Skis delivered directly to your yacht deck during the cruise.
          </p>

          {/* CTA BOX */}
          <div className="bg-gradient-to-r from-[#121621] to-teal-900 text-white rounded-3xl p-8 my-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to book your private yacht?</h3>
              <p className="text-xs text-gray-300">Guaranteed lowest rates direct with instant booking confirmation.</p>
            </div>
            <Link
              href="/yacht-rental"
              className="bg-[#008B9B] hover:bg-teal-400 text-white hover:text-gray-900 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-md"
            >
              Browse Available Yachts
            </Link>
          </div>
        </article>

      </main>

      <Footer />
    </div>
  );
}
