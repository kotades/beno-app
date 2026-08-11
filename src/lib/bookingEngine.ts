import { syncBookingToFirestore } from '@/lib/firestoreSync';

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Yacht' | 'Car' | 'Helicopter' | 'Buggy' | 'Water Sports' | 'Private Jet' | 'Supercar Rally';
  providerId: string;
  durationMinutes: number;
  basePrice: number;
  currency: string;
}

export interface BlockedTime {
  id: string;
  serviceId: string;
  providerId: string;
  date: string;
  slotTime: string;
  reason: string;
  createdAt: string;
}

export interface BookingRecord {
  id: string; // e.g. "BENO-BK-98421"
  serviceId: string;
  serviceName: string;
  category: string;
  providerId: string;
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
  notes?: string;
  addOns?: string[];
  image?: string;
}

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  { id: 'sp-marine', name: 'Beno Marine Operations', email: 'yachts@beno.com', phone: '+971 4 800 2366', department: 'Yachts & Watersport' },
  { id: 'sp-supercar', name: 'Beno Supercar Fleet Desk', email: 'cars@beno.com', phone: '+971 4 800 2367', department: 'Supercars & Fleet' },
  { id: 'sp-aviation', name: 'Beno Executive Aviation', email: 'jets@beno.com', phone: '+971 4 800 2368', department: 'Helicopters & Private Jets' },
  { id: 'sp-desert', name: 'Beno Desert & Rally Ops', email: 'rally@beno.com', phone: '+971 4 800 2369', department: 'Buggies & Supercar Rally' }
];

const LOCAL_BOOKINGS_KEY = 'beno_saas_bookings';
const LOCAL_BLOCKED_KEY = 'beno_saas_blocked_times';

const INITIAL_SEED_BOOKINGS: BookingRecord[] = [];
const INITIAL_BLOCKED_TIMES: BlockedTime[] = [];

// Helper functions
export function getBookings(): BookingRecord[] {
  if (typeof window === 'undefined') return INITIAL_SEED_BOOKINGS;
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SEED_BOOKINGS;
  }
}

export function getBlockedTimes(): BlockedTime[] {
  if (typeof window === 'undefined') return INITIAL_BLOCKED_TIMES;
  try {
    const raw = localStorage.getItem(LOCAL_BLOCKED_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_BLOCKED_KEY, JSON.stringify(INITIAL_BLOCKED_TIMES));
      return INITIAL_BLOCKED_TIMES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BLOCKED_TIMES;
  }
}

export function isSlotAvailable(serviceId: string, date: string, slotTime: string): boolean {
  const bookings = getBookings();
  const blocked = getBlockedTimes();

  const isBlocked = blocked.some(b => b.serviceId === serviceId && b.date === date && b.slotTime === slotTime);
  if (isBlocked) return false;

  const isBooked = bookings.some(bk => 
    bk.serviceId === serviceId && 
    bk.startDate === date && 
    bk.startTime === slotTime && 
    bk.status !== 'Cancelled'
  );
  return !isBooked;
}

export function createBooking(payload: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>): BookingRecord {
  const current = getBookings();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newBk: BookingRecord = {
    ...payload,
    id: `BENO-BK-${randomNum}`,
    status: 'Confirmed',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newBk, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));
  }
  
  // Sync to Firebase Firestore asynchronously
  syncBookingToFirestore(newBk);

  return newBk;
}

export function updateBookingStatus(id: string, newStatus: BookingRecord['status']): BookingRecord[] {
  const current = getBookings();
  const updated = current.map(b => b.id === id ? { ...b, status: newStatus } : b);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function addBlockedTime(serviceId: string, providerId: string, date: string, slotTime: string, reason: string): BlockedTime[] {
  const current = getBlockedTimes();
  const newBlk: BlockedTime = {
    id: `blk-${Date.now()}`,
    serviceId,
    providerId,
    date,
    slotTime,
    reason,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [newBlk, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_BLOCKED_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getEngineMetrics() {
  const bookings = getBookings();
  const blocked = getBlockedTimes();

  const totalRevenue = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending Deposit').length;
  const totalBookings = bookings.length;

  return {
    totalRevenue,
    confirmedCount,
    pendingCount,
    totalBookings,
    blockedSlotsCount: blocked.length
  };
}
