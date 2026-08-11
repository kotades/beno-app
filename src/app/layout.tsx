import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BENO Global | Worldwide Luxury Rentals (Miami, NY, LA, London, Monaco, Paris)',
  description: "BENO Global is the premier worldwide luxury experience platform headquartered in Miami, FL. Charter Superyachts, Hypercars, Private Jets, Helicopters, and Exotic Rallies worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <Header />
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
