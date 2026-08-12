import { app } from '@/lib/firebase';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import type { BookingRecord } from '@/lib/bookingEngine';

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

export async function deleteBooking(id: string): Promise<void> {
  const docRef = doc(db, 'bookings', id);
  await deleteDoc(docRef);
  console.log(`🔥 Firestore deleted booking ${id}`);
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

export function subscribeToUserBookings(userEmail: string, callback: (bookings: BookingRecord[]) => void) {
  try {
    const q = query(collection(db, 'bookings'), where('guestEmail', '==', userEmail.toLowerCase()));
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

// ── 1:1 conversations ─────────────────────────────
// conversation id = `${a}__${b}` (emails lowercased, sorted) so a thread
// between the same two users always maps to one Firestore doc.
export function conversationId(a: string, b: string): string {
  const sorted = [a.toLowerCase(), b.toLowerCase()].sort();
  return `${sorted[0]}__${sorted[1]}`;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderEmail: string;
  senderName: string;
  body: string;
  createdAt: string; // ISO
  read: boolean;
}

export function syncMessageToFirestore(msg: ConversationMessage): Promise<void> {
  // Derive participant emails from the sorted convId so array-contains queries work
  const [a, b] = msg.conversationId.split('__');
  return setDoc(doc(db, 'conversation_messages', msg.id), {
    ...msg,
    participantEmails: [a, b]
  }, { merge: true });
}

export function subscribeToConversation(convId: string, callback: (messages: ConversationMessage[]) => void) {
  try {
    const q = query(collection(db, 'conversation_messages'), where('conversationId', '==', convId));
    return onSnapshot(q, (snapshot) => {
      const list: ConversationMessage[] = [];
      snapshot.forEach((d) => list.push(d.data() as ConversationMessage));
      callback(list.sort((x, y) => x.createdAt.localeCompare(y.createdAt)));
    }, (err) => {
      console.warn('Conversation snapshot notice:', err);
    });
  } catch (e) {
    console.warn('Conversation subscription notice:', e);
    return () => {};
  }
}

export function subscribeToUserConversations(email: string, callback: (messages: ConversationMessage[]) => void) {
  try {
    const q = query(collection(db, 'conversation_messages'), where('participantEmails', 'array-contains', email.toLowerCase()));
    return onSnapshot(q, (snapshot) => {
      const list: ConversationMessage[] = [];
      snapshot.forEach((d) => list.push(d.data() as ConversationMessage));
      callback(list);
    }, (err) => {
      console.warn('User conversations snapshot notice:', err);
    });
  } catch (e) {
    console.warn('User conversations subscription notice:', e);
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
