'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { subscribeToUserConversations, ConversationMessage } from '@/lib/firestoreSync';

// Lazy-load chat widget — heavy, only mounts when user opens chat
const LiveSupportWidget = dynamic(() => import('@/components/LiveSupportWidget'), { ssr: false });
import { useLocation, GLOBAL_DESTINATIONS } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';

const ADMIN_EMAIL = 'beno@admin.com';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { activeLocation, setActiveLocation } = useLocation();
  const { user, isAdmin, logout, refreshAdminState } = useAuth();

  // Subscribe to user's conversations to track unread messages
  useEffect(() => {
    if (!user?.email) {
      setUnreadCount(0);
      return;
    }
    const unsub = subscribeToUserConversations(user.email.toLowerCase(), (messages: ConversationMessage[]) => {
      const unread = messages.filter(m => m.senderEmail !== user.email?.toLowerCase() && !m.read).length;
      setUnreadCount(unread);
    });
    return unsub;
  }, [user?.email]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change (mobile UX) and refresh admin state
  useEffect(() => {
    setIsMenuOpen(false);
    refreshAdminState();
  }, [refreshAdminState]);

  const baseMenuItems = [
    { label: 'Profile', href: '/profile', hasDot: true },
    { label: 'Limited Offers', href: '/offers/limited', badge: 'Up to 60%' },
    { label: 'Manage Booking', href: '/booking/retrieve' },
    { label: 'Exclusive Offers', href: '/offers/exclusive', badge: 'Up to 30% off' },
    { label: 'Buy vs Rent Calculator', href: '/buy-vs-rent' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Help', href: '/help' },
  ];

  // Admin link only visible when authenticated as admin
  const menuItems = isAdmin
    ? [
        ...baseMenuItems.slice(0, 5),
        { label: 'Concierge Dashboard', href: '/admin/dashboard', badge: 'Provider Admin' },
        ...baseMenuItems.slice(5),
      ]
    : baseMenuItems;

  const mainCategories = [
    { label: 'Yachts', href: '/yacht-rental' },
    { label: 'Cars', href: '/rent-a-car' },
    { label: 'Helicopters', href: '/aerials' },
    { label: 'Buggies', href: '/buggies' },
    { label: 'Watersport', href: '/water-activities' },
    { label: 'Private Jets', href: '/private-jet' },
    { label: 'Supercar Rally', href: '/supercar-rally' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm text-gray-800 py-3' 
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white py-5'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex justify-between items-center h-12">
            
            {/* LOGO & HQ BADGE */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Link href="/" className={`text-2xl sm:text-3xl font-black tracking-tighter transition-colors ${isScrolled ? 'text-[#008B9B]' : 'text-white'}`}>
                BENO
              </Link>
              <span className={`hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider border ${
                isScrolled 
                  ? 'bg-amber-50 text-amber-900 border-amber-300' 
                  : 'bg-white/10 text-amber-300 border-amber-400/40 backdrop-blur-xs'
              }`}>
                🇺🇸 MIAMI HQ
              </span>
            </div>

            {/* DESKTOP NAV LINKS */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {mainCategories.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className={`text-[14px] font-medium transition-colors hover:opacity-100 ${
                    isScrolled ? 'text-gray-700 hover:text-[#008B9B]' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* GLOBAL DESTINATION / CURRENCY SWITCHER & HAMBURGER */}
            <div className="flex items-center space-x-4 sm:space-x-6 relative">
              
              {/* LOCATION & CURRENCY SELECTOR */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`flex items-center space-x-2 text-[13px] font-bold py-1.5 px-3.5 rounded-full transition-all ${
                    isScrolled ? 'text-gray-800 hover:bg-gray-100 border border-gray-200' : 'text-white hover:bg-white/10 border border-white/20'
                  }`}
                >
                  <span>{activeLocation.flagEmoji}</span>
                  <span className="font-bold hidden sm:inline">{activeLocation.city}</span>
                  <span className="text-[11px] opacity-75 font-mono hidden sm:inline">({activeLocation.currencyCode})</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* GLOBAL DESTINATION DROPDOWN */}
                {isLangOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl p-4 border border-gray-100 text-gray-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
                    <div className="text-[10px] font-black text-[#008B9B] px-3 py-1 uppercase tracking-wider mb-2">
                      🌎 Select Global Destination Hub
                    </div>
                    
                    <div className="space-y-1">
                      {GLOBAL_DESTINATIONS.map((loc) => {
                        const isSelected = loc.id === activeLocation.id;
                        return (
                          <button
                            key={loc.id}
                            onClick={() => {
                              setActiveLocation(loc);
                              setIsLangOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'bg-teal-50 text-[#008B9B] font-bold border border-teal-200' 
                                : 'hover:bg-gray-50 text-gray-700 font-semibold'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <span className="text-base">{loc.flagEmoji}</span>
                              <div>
                                <div className="text-xs font-bold">{loc.city}</div>
                                <div className="text-[10px] text-gray-400">{loc.country}</div>
                              </div>
                            </div>
                            
                            <span className="text-xs font-mono font-bold text-gray-500">
                              {loc.currencyCode} ({loc.currencySymbol})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* HAMBURGER TOGGLE BUTTON */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                  className={`p-2 rounded-full transition-all focus:outline-none ${
                    isScrolled 
                      ? 'text-gray-800 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {isMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>

                {/* HAMBURGER DROPDOWN MENU — SCROLLABLE ON MOBILE */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100/80 text-gray-800 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col"
                    style={{ maxHeight: 'calc(100vh - 90px)' }}
                  >
                    {/* Scrollable inner area */}
                    <div className="overflow-y-auto overscroll-contain p-5 flex flex-col gap-0" style={{ scrollbarWidth: 'none' }}>
                    
                      {/* MOBILE CATEGORY NAVIGATION */}
                      <div className="block lg:hidden border-b border-gray-100 pb-3 mb-3">
                        <div className="text-xs font-bold text-gray-400 px-3 py-1 uppercase tracking-wider mb-1">Categories</div>
                        {mainCategories.map((cat) => (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#008B9B] hover:bg-gray-50 rounded-xl transition-all"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>

                      {/* MAIN MENU ITEMS */}
                      <div className="space-y-1">
                        {menuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-between px-3.5 py-2.5 text-[15px] font-medium text-gray-700 hover:text-[#008B9B] hover:bg-teal-50/50 rounded-xl transition-all group"
                          >
                            <span className="flex items-center">
                              {item.label}
                              {item.hasDot && (
                                <span className="ml-1.5 inline-block w-2 h-2 bg-[#008B9B] rounded-full" />
                              )}
                            </span>

                            {item.badge && (
                              <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-semibold px-3 py-1 rounded-full group-hover:bg-[#d0f2f9] transition-colors">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 my-3" />

                      {/* AUTH ACTIONS */}
                      {user ? (
                        <div className="space-y-1">
                          <div className="px-3.5 py-2 text-xs text-gray-400 font-semibold truncate">
                            Signed in as <span className="text-gray-700">{user.email}</span>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3.5 py-2.5 text-[15px] font-semibold text-red-600 hover:bg-red-50/60 rounded-xl transition-all"
                          >
                            Log Out
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3.5 py-2.5 text-[15px] font-semibold text-white bg-[#008B9B] hover:bg-[#007684] rounded-xl transition-all text-center"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/login?mode=signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3.5 py-2.5 text-[15px] font-semibold text-gray-700 hover:text-[#008B9B] hover:bg-teal-50/50 rounded-xl transition-all text-center"
                          >
                            Create Account
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* FLOATING "CHAT WITH US" BUTTON */}
      {!isAdmin && (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center space-x-2.5 bg-white text-teal-800 hover:text-[#008B9B] px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
        >
          <span className="text-sm font-bold tracking-tight">Chat with us</span>
          <div className="w-8 h-8 rounded-full bg-[#E0F7FC] flex items-center justify-center text-[#00A8CC] group-hover:scale-110 transition-transform relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {unreadCount > 0 && !isChatOpen && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </button>
      </div>
      )}

      {/* LIVE SUPPORT CHAT POPUP WIDGET */}
      {isChatOpen && <LiveSupportWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </>
  );
}
