'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Once auth resolves, redirect non-admins to login
    if (!loading && !isAdmin) {
      router.replace('/login?reason=admin');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-400">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirecting — show access denied briefly
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4 max-w-sm px-6">
          <div className="text-5xl">🔒</div>
          <h1 className="text-2xl font-black">Access Restricted</h1>
          <p className="text-gray-400 text-sm">This area is reserved for BENO admin accounts. Sign in with admin credentials to continue.</p>
          <Link href="/login?reason=admin" className="inline-block mt-4 bg-[#008B9B] hover:bg-[#007684] text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all">
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
