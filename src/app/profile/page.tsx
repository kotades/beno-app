'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { subscribeToUserBookings } from '@/lib/firestoreSync';
import type { BookingRecord } from '@/lib/bookingEngine';

export default function ProfilePage() {
  const { user, loading, logout, uploadAvatar } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'bookings' | 'documents' | 'payments'>('details');
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Set avatar from user photo
  useEffect(() => {
    if (user?.photoURL) setAvatarUrl(user.photoURL);
  }, [user]);

  // Subscribe to user's Firestore bookings
  useEffect(() => {
    if (!user?.email) return;
    setBookingsLoading(true);
    const unsubscribe = subscribeToUserBookings(user.email, (bookings) => {
      setUserBookings(bookings);
      setBookingsLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.email]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const newUrl = await uploadAvatar(file);
        setAvatarUrl(newUrl);
      } catch (err) {
        console.error('Failed uploading avatar:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  // Show loading spinner while auth resolves
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#008B9B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Auth gate — redirecting, show nothing
  if (!user) return null;

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'BENO Member';
  const email = user?.email || '';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">
        
        {/* HERO PROFILE BANNER */}
        <div className="bg-gradient-to-r from-[#121621] via-[#1a2336] to-[#008B9B] rounded-3xl p-6 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            
            {/* AVATAR WITH FIREBASE STORAGE UPLOAD */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#008B9B] to-teal-200 p-1 shadow-lg overflow-hidden relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white uppercase border-2 border-white/20">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* OVERLAY UPLOAD INPUT */}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold text-white cursor-pointer rounded-full">
                  <span>{uploading ? 'Uploading...' : '📷 Change Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={uploading} />
                </label>
              </div>

              <span className="absolute bottom-1 right-1 w-6 h-6 bg-teal-400 border-2 border-gray-900 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold" title="Firebase Verified">
                ✓
              </span>
            </div>

            {/* USER META */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{displayName}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E0F7FC] text-[#00A8CC] w-max mx-auto md:mx-0">
                  BENO MEMBER
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block">Active Bookings</span>
                  <span className="text-lg font-bold text-teal-300">{userBookings.length}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-300 block">Auth UID</span>
                  <span className="text-xs font-mono font-bold text-white tracking-wide truncate max-w-[120px] block">{user?.uid}</span>
                </div>
              </div>
            </div>

            {/* LOG OUT BTN */}
            <div>
              <button 
                onClick={async () => { await logout(); router.push('/'); }}
                className="bg-white/20 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all duration-200"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-gray-200 overflow-x-auto mb-8 scrollbar-hide">
          {[
            { id: 'details', label: 'Personal Details' },
            { id: 'bookings', label: 'My Active Bookings' },
            { id: 'documents', label: 'Verification Documents' },
            { id: 'payments', label: 'Saved Payment Methods' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#008B9B] text-[#008B9B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PERSONAL DETAILS */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={displayName}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#008B9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={email}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Preferred Currency</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#008B9B]">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Country of Residence</label>
                <input 
                  type="text" 
                  placeholder="Enter your country..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#008B9B]"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button className="bg-[#008B9B] hover:bg-[#007684] text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-md">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS — LIVE FIRESTORE DATA */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookingsLoading ? (
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[#008B9B] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-gray-400 font-medium">Loading your bookings...</p>
                </div>
              </div>
            ) : userBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="text-5xl mb-4">🚤</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Bookings</h3>
                <p className="text-sm text-gray-500 mb-6">You haven&apos;t made any reservations yet. Explore our luxury fleet and book your first experience.</p>
                <Link href="/" className="bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md inline-block">
                  Explore Services
                </Link>
              </div>
            ) : (
              userBookings.map((bk) => (
                <div key={bk.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-6 w-full md:w-auto">
                    {bk.image && (
                      <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-gray-900 flex-shrink-0">
                        <img src={bk.image} alt={bk.serviceName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="bg-teal-50 text-[#008B9B] text-xs font-bold px-3 py-0.5 rounded-full">{bk.status}</span>
                        <span className="text-xs text-gray-400 font-semibold">Ref: {bk.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{bk.serviceName}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {bk.startDate} @ {bk.startTime} • {bk.duration}
                      </p>
                    </div>
                  </div>

                  <Link href="/booking/retrieve" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all">
                    Manage Booking
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: VERIFICATION DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Documents</h2>
            <p className="text-sm text-gray-500 mb-8">Upload your ID, passport or driving license to unlock premium booking options.</p>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-[#008B9B] transition-colors cursor-pointer">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG — Max 10MB</p>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT METHODS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Saved Payment Methods</h2>
            <p className="text-sm text-gray-500 mb-8">Your saved payment methods will appear here after your first booking.</p>
            
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💳</div>
              <p className="text-sm text-gray-400">No payment methods saved yet.</p>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
