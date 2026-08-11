import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-white pt-16 pb-8 px-4 sm:px-8 lg:px-16 border-t border-gray-800/80 font-sans">
      <div className="max-w-[1920px] mx-auto xl:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12 border-b border-gray-800/60 pb-12">
          
          {/* COL 1: LOGO & GLOBAL HQ IDENTITY */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-3xl sm:text-4xl font-black tracking-tighter text-white hover:text-[#008B9B] transition-colors inline-block">
                BENO
              </Link>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                🇺🇸 GLOBAL HQ • MIAMI, FL
              </span>
            </div>

            <p className="text-gray-400 font-medium text-xs sm:text-sm leading-relaxed max-w-md">
              BENO Global is the premier worldwide luxury experience platform headquartered in Miami, Florida. Charter superyachts, hypercars, private jets, executive helicopters, watersports, and supercar rallies across Miami, New York, Los Angeles, London, Monaco, and Paris.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 fill-current text-cyan-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9★ Rated Worldwide on Google & Trustpilot (1,250+ Verified Reviews)
              </span>
            </div>
          </div>

          {/* COL 2: GLOBAL DESTINATION HUBS */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#008B9B] mb-4">Global Hubs & Fleet</h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-semibold">
              <li><Link href="/yacht-rental" className="hover:text-[#008B9B] transition-colors">Miami & Riviera Superyachts</Link></li>
              <li><Link href="/rent-a-car" className="hover:text-[#008B9B] transition-colors">Hypercar & Exotic Rental</Link></li>
              <li><Link href="/aerials" className="hover:text-[#008B9B] transition-colors">Executive Helicopter Charters</Link></li>
              <li><Link href="/buggies" className="hover:text-[#008B9B] transition-colors">Off-Road & Desert Rallies</Link></li>
              <li><Link href="/water-activities" className="hover:text-[#008B9B] transition-colors">Coastal Watersports & Jet Skis</Link></li>
              <li><Link href="/private-jet" className="hover:text-[#008B9B] transition-colors">Global Private Jet Charters</Link></li>
              <li><Link href="/supercar-rally" className="hover:text-[#008B9B] transition-colors">Transcontinental Supercar Rallies</Link></li>
            </ul>
          </div>

          {/* COL 3: CUSTOMER PORTAL */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#008B9B] mb-4">Customer Portal</h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-semibold">
              <li><Link href="/profile" className="hover:text-[#008B9B] transition-colors">My VIP Profile</Link></li>
              <li>
                <Link href="/offers/limited" className="hover:text-[#008B9B] transition-colors flex items-center justify-between">
                  <span>Worldwide Offers</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 font-black px-2 py-0.5 rounded-full border border-cyan-800">60% OFF</span>
                </Link>
              </li>
              <li><Link href="/booking/retrieve" className="hover:text-[#008B9B] transition-colors">Manage Reservations</Link></li>
              <li>
                <Link href="/offers/exclusive" className="hover:text-[#008B9B] transition-colors flex items-center justify-between">
                  <span>Exclusive Deals</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 font-black px-2 py-0.5 rounded-full border border-cyan-800">30% OFF</span>
                </Link>
              </li>
              <li><Link href="/buy-vs-rent" className="hover:text-[#008B9B] transition-colors">Buy vs Rent Calculator</Link></li>

            </ul>
          </div>

          {/* COL 4: USA HQ & GLOBAL CONTACT */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#008B9B] mb-4">Global HQ & Contact</h4>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              <li><Link href="/about" className="hover:text-[#008B9B] transition-colors font-semibold">About BENO Global</Link></li>
              <li><Link href="/contact" className="hover:text-[#008B9B] transition-colors font-semibold">Contact VIP Concierge</Link></li>
              <li><Link href="/help" className="hover:text-[#008B9B] transition-colors font-semibold">Help Center & FAQ</Link></li>
              <li><Link href="/login" className="hover:text-[#008B9B] transition-colors font-semibold">Account Sign In</Link></li>
              <li className="pt-2 text-gray-400 text-[11px] leading-relaxed">
                🏢 <strong>USA HQ:</strong> 1000 Brickell Ave, Miami, FL 33131, USA
              </li>
              <li className="text-gray-400 text-[11px]">
                📞 <strong>Toll-Free USA:</strong> +1 (800) BENO-VIP
              </li>
              <li className="text-gray-400 text-[11px]">
                📞 <strong>Intl Hotline:</strong> +1 (305) 555-BENO
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-3 sm:space-y-0 pt-2">
          <div>© {new Date().getFullYear()} BENO Global Corporation (USA). All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="/help" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/help" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/help" className="hover:text-gray-300 transition-colors">Global Aviation & Maritime Insurance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
