import { app } from '@/lib/firebase';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import type { BookingRecord } from '@/lib/bookingEngine';
import { ChatMessage } from '@/lib/supportChatStore';

const db = getFirestore(app);

export { db };

export async function syncBookingToFirestore(booking: any): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', booking.id);
    await setDoc(docRef, {
      ...booking,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`🔥 Firestore synced booking ${booking.id}`);
  } catch (e) {
    console.warn(`Firestore booking sync notice (Fallback active):`, e);
  }
}

export async function syncBookingStatusToFirestore(id: string, status: string): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', id);
    await setDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`🔥 Firestore synced booking status ${id} → ${status}`);
  } catch (e) {
    console.warn(`Firestore booking status sync notice:`, e);
  }
}

export async function syncChatMessageToFirestore(message: ChatMessage): Promise<void> {
  try {
    const docRef = doc(db, 'support_messages', message.id);
    await setDoc(docRef, {
      ...message,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`🔥 Firestore synced support message ${message.id}`);
  } catch (e) {
    console.warn(`Firestore message sync notice (Fallback active):`, e);
  }
}

export function subscribeToUserBookings(userEmail: string, callback: (bookings: BookingRecord[]) => void) {
  try {
    const q = query(collection(db, 'bookings'), where('guestEmail', '==', userEmail));
    return onSnapshot(q, (snapshot) => {
      const list: BookingRecord[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as BookingRecord);
      });
      callback(list);
    }, (err) => {
      console.warn("Firestore snapshot notice:", err);
    });
  } catch (e) {
    console.warn("Firestore subscription notice:", e);
    return () => {};
  }
}

export function subscribeToAllBookings(callback: (bookings: BookingRecord[]) => void) {
  try {
    const q = query(collection(db, 'bookings'));
    return onSnapshot(q, (snapshot) => {
      const list: BookingRecord[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as BookingRecord);
      });
      callback(list);
    }, (err) => {
      console.warn("Firestore snapshot all bookings notice:", err);
    });
  } catch (e) {
    console.warn("Firestore subscribe all bookings notice:", e);
    return () => {};
  }
}
