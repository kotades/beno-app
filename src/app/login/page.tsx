'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

// Maps internal auth error codes to clean user-facing messages
function getFriendlyError(err: any): string {
  const code = err?.code || '';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (code.includes('email-already-in-use')) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (code.includes('weak-password')) {
    return 'Password must be at least 6 characters.';
  }
  if (code.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  // Hide all other internal errors — show generic message
  return 'Sign in failed. Please check your credentials and try again.';
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signInWithEmail, signUpWithEmail, logout } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdminRedirect = searchParams.get('reason') === 'admin';

  // Set mode from URL param (?mode=signup)
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') setMode('signup');
  }, [searchParams]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }

      if (email.toLowerCase() === 'beno@admin.com') {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans pt-28">
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 w-full pb-20">

        <div className="max-w-md mx-auto">

          {/* ADMIN ACCESS NOTICE */}
          {isAdminRedirect && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-4 py-3 rounded-2xl mb-5 text-center">
              🔒 Restricted area. Please sign in to continue.
            </div>
          )}

          {/* BENO BRAND HEADER */}
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-black tracking-tighter text-[#008B9B] inline-block mb-2">
              BENO
            </Link>
            <h1 className="text-2xl font-black text-gray-900">
              {user ? 'Welcome Back' : mode === 'signin' ? 'Sign In to BENO' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Access your VIP profile, manage bookings &amp; exclusive offers.
            </p>
          </div>

          {/* AUTH CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">

            {user ? (
              /* ALREADY SIGNED IN STATE */
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 text-[#008B9B] mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900">You&apos;re signed in</h3>
                <p className="text-sm font-bold text-[#008B9B]">{user.displayName || user.email}</p>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/profile"
                    className="w-full bg-[#008B9B] text-white py-3 rounded-2xl font-bold text-sm block text-center shadow"
                  >
                    Go to My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-2xl font-bold text-xs block text-center"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* SIGN IN / SIGN UP TAB TOGGLE */}
                <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                  <button
                    onClick={() => setMode('signin')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* ERROR MESSAGE — user-friendly only, no tech details */}
                {error && (
                  <div className="bg-red-50 text-red-700 text-xs font-semibold p-3 rounded-xl mb-4 border border-red-200">
                    {error}
                  </div>
                )}

                {/* EMAIL / PASSWORD FORM */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#008B9B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#008B9B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#008B9B] hover:bg-[#007684] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      mode === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </form>
              </>
            )}

          </div>

          <div className="text-center mt-6 text-xs text-gray-400">
            By continuing, you agree to BENO&apos;s{' '}
            <Link href="/help" className="underline hover:text-gray-600">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/help" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
