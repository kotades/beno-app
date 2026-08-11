'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { subscribeToUserBookings, deleteBooking } from '@/lib/firestoreSync';
import type { BookingRecord } from '@/lib/bookingEngine';
import { formatCurrency } from '@/lib/currency';

export default function ManageBookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookingRef, setBookingRef] = useState('');
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Subscribe to Firestore bookings for logged-in user
  useEffect(() => {
    if (!user?.email) return;
    setBookingsLoading(true);
    const unsubscribe = subscribeToUserBookings(user.email, (bookings) => {
      setAllBookings(bookings);
      setFilteredBookings(bookings);
      setBookingsLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.email]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const query = bookingRef.trim().toLowerCase();
      const results = allBookings.filter(b =>
        b.id.toLowerCase().includes(query) ||
        b.guestEmail.toLowerCase().includes(query) ||
        (b.guestPhone && b.guestPhone.toLowerCase().includes(query))
      );
      setFilteredBookings(results);
      setHasSearched(true);
      setSearching(false);
    }, 400);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (bk: BookingRecord) => {
    if (!window.confirm(`Cancel and delete booking ${bk.id}? This cannot be undone.`)) return;
    setDeletingId(bk.id);
    try {
      await deleteBooking(bk.id);
    } catch (e) {
      console.error('Delete failed:', e);
      window.alert('Failed to delete booking. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClear = () => {
    setBookingRef('');
    setFilteredBookings(allBookings);
    setHasSearched(false);
  };

  // Auth loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#008B9B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirecting
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="bg-[#E0F7FC] text-[#00A8CC] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-3">
            BENO Executive Booking Concierge
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4">
            Manage &amp; Retrieve Your Booking
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Retrieve active luxury reservations for Supercars, Yachts, Helicopters, Buggies, Jet Skis &amp; Private Jets. View time slots, add-ons, or download your VIP pass.
          </p>
        </div>

        {/* SEARCH FORM CARD */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Booking Reference (e.g. BENO-BK-78912) or Email
              </label>
              <input
                type="text"
                placeholder="Enter booking ID or email address..."
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-[#008B9B]"
              />
            </div>

            <div className="flex space-x-3">
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold text-xs transition-all"
                >
                  Show All
                </button>
              )}
              <button
                type="submit"
                disabled={searching}
                className="flex-1 bg-[#008B9B] hover:bg-[#007684] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex justify-center items-center"
              >
                {searching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Retrieve Booking'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* BOOKING RESULTS */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-gray-900">
              {hasSearched ? `Search Results (${filteredBookings.length})` : `Active Reservations (${filteredBookings.length})`}
            </h3>
            <span className="text-xs text-gray-400 font-semibold">Realtime BENO Engine Sync</span>
          </div>

          {bookingsLoading ? (
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#008B9B] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-400 font-medium">Loading your reservations...</p>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500 px-6">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {hasSearched ? 'No Matching Bookings' : 'No Active Reservations'}
              </h3>
              <p className="text-sm mb-6">
                {hasSearched 
                  ? `No results for "${bookingRef}". Try your booking reference or email.`
                  : "You don't have any active reservations. Explore our luxury fleet and make your first booking!"
                }
              </p>
              {!hasSearched && (
                <Link href="/" className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md inline-block">
                  Explore Services
                </Link>
              )}
            </div>
          ) : (
            filteredBookings.map((bk) => (
              <div 
                key={bk.id} 
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in duration-300"
              >
                {/* TOP HEADER BAR */}
                <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-teal-950 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-[#008B9B] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {bk.status}
                      </span>
                      <span className="text-xs text-teal-300 font-bold">{bk.category}</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mt-2">{bk.id}</h2>
                    <p className="text-xs text-gray-400">Booked on {bk.createdAt} • VIP Concierge Escort Assigned</p>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <button
                      onClick={() => alert(`Downloading PDF Booking Pass for ${bk.id}...`)}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-white/20"
                    >
                      📄 Download PDF Pass
                    </button>
                    <button
                      onClick={() => handleDelete(bk)}
                      disabled={deletingId === bk.id}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-red-400/30 disabled:opacity-50"
                    >
                      {deletingId === bk.id ? 'Deleting…' : '🗑 Cancel Booking'}
                    </button>
                  </div>
                </div>

                {/* BODY DETAILS */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-gray-100">
                    {bk.image && (
                      <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0">
                        <img src={bk.image} alt={bk.serviceName} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">{bk.serviceName}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600 font-medium">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">Guest</span>
                          <span className="font-bold text-gray-900">{bk.guestName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">Date &amp; Slot</span>
                          <span className="font-bold text-gray-900">{bk.startDate} @ {bk.startTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase">Duration</span>
                          <span className="font-bold text-gray-900">{bk.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ADDONS & PRICING */}
                  {bk.addOns && bk.addOns.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Confirmed Package Add-ons</span>
                      <div className="flex flex-wrap gap-2">
                        {bk.addOns.map((addon, i) => (
                          <span key={i} className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200">
                            ✓ {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                    <div>
                      <span className="text-xs text-gray-400 block">Contact Info</span>
                      <span className="text-xs font-bold text-gray-800">{bk.guestEmail} • {bk.guestPhone}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-400 block">Total Guaranteed</span>
                      <span className="text-2xl font-black text-[#008B9B]">{formatCurrency(bk.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
