import Footer from '@/components/Footer';
import homeDb from '@/data/home_db.json';

export default function PartnersPage() {
  const partnerSection = homeDb.sections.find(s => s.id === 'section_11');
  const partners = partnerSection?.assets
    ?.filter(a => a.src)
    .map(a => a.src)
    .filter((src, i, arr) => arr.indexOf(src) === i) || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">

        {/* HERO HEADER */}
        <div className="bg-gradient-to-r from-[#121621] via-gray-900 to-[#008B9B] rounded-3xl p-8 sm:p-14 text-white shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Our Global Network
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Trusted Partners Worldwide
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              BENO collaborates with the world&apos;s most prestigious hospitality, marine and lifestyle brands to deliver an unmatched luxury rental experience.
            </p>
          </div>
        </div>

        {/* PARTNERS GRID */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Our Partners</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
            {partners.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="BENO partner logo"
                className="h-10 md:h-14 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
