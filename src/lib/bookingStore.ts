import { syncBookingToFirestore } from '@/lib/firestoreSync';
import { CURRENCY } from '@/lib/currency';

export interface BookingItem {
  id: string; // e.g. "BENO-BK-98421"
  serviceName: string;
  category: string;
  startDate: string;
  startTime: string;
  duration: string;
  totalPrice: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  status: 'Confirmed' | 'Pending Deposit' | 'Completed' | 'Cancelled';
  createdAt: string;
  addOns?: string[];
  notes?: string;
  image?: string;
  serviceId?: string;
  providerId?: string;
}

const LOCAL_STORAGE_KEY = 'beno_user_bookings';

// Version key — bumping this wipes all old seeded/demo data from localStorage
const DATA_VERSION_KEY = 'beno_data_version';
const CURRENT_VERSION = '2'; // bump this to force a clear of old demo data

/**
 * On first load with a new version, clear any old demo/seed data from localStorage.
 * This ensures users see a clean slate with real Firestore data.
 */
export function clearOldDemoDataIfNeeded(): void {
  if (typeof window === 'undefined') return;
  const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
  if (storedVersion !== CURRENT_VERSION) {
    // Wipe all legacy local booking data
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Also clear any legacy auth mock state
    localStorage.removeItem('beno_auth_mock');
    localStorage.removeItem('beno_user_bookings');
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
    console.log('🧹 Cleared legacy demo data from localStorage (migration to Firestore)');
  }
}

export function getStoredBookings(): BookingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    clearOldDemoDataIfNeeded();
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading bookings from localStorage:', e);
    return [];
  }
}

export function saveBooking(booking: Omit<BookingItem, 'id' | 'createdAt' | 'status'>): BookingItem {
  const current = getStoredBookings();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newBooking: BookingItem = {
    ...booking,
    id: `BENO-BK-${randomNum}`,
    status: 'Confirmed',
    currency: CURRENCY,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newBooking, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }

  // Synchronize immediately to Firebase Firestore
  const firestoreRecord = {
    ...newBooking,
    serviceId: newBooking.serviceId || newBooking.id,
    providerId: newBooking.providerId || 'sp-fleet'
  };
  syncBookingToFirestore(firestoreRecord);

  return newBooking;
}

export function findBooking(referenceOrEmail: string): BookingItem[] {
  const all = getStoredBookings();
  const query = referenceOrEmail.trim().toLowerCase();
  return all.filter(b =>
    b.id.toLowerCase().includes(query) ||
    b.guestEmail.toLowerCase().includes(query) ||
    b.guestPhone.toLowerCase().includes(query)
  );
}
