import Link from 'next/link';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-[#008B9B] text-xs font-black uppercase tracking-widest mb-4">Error 404</div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">
            Page not found
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-8">
            The page you&apos;re looking for doesn&apos;t exist, was moved, or is no longer available.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-2xl font-bold text-sm border border-gray-200 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
