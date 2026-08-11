import Link from 'next/link';
import Footer from '@/components/Footer';

const reviews = [
  { name: 'serek2137', date: '25 February 2026', text: 'Everything was perfect. Professional service, amazing cars and no issues. Special thanks to Kareem. He was incredibly helpful throughout the process and made sure everything was 100%...' },
  { name: 'Osman Jusufi', date: '16 February 2026', text: 'I had an amazing experience with Ahmed Othman. From the very first moment we met on the street, he treated me not just like a client, but like a brother. He was extremely friendly,...' },
  { name: 'Sean', date: '6 February 2026', text: 'An absolutely unreal experience hiring the Lamborghini Huracán! From start to finish everything was smooth, professional, and genuinely exciting. The car itself was immaculate...' },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">

        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-[#121621] via-gray-900 to-[#008B9B] rounded-3xl p-8 sm:p-14 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Client Experiences
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              What People Say About Us
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Real feedback from BENO clients across our yacht, car and lifestyle concierge services.
            </p>
          </div>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-lg mr-3">
                    {review.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{review.name}</div>
                    <div className="text-yellow-400 text-xs">★★★★★</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{review.date}</div>
              </div>
              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/contact" className="text-teal-700 font-bold text-sm hover:underline">Share your experience with us →</Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
