import { db } from './firestoreSync';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export type UserRole = 'user' | 'admin';
export type VIPTier = 'Silver' | 'Gold' | 'Platinum' | 'Black Diamond';

export interface ManagedUser {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  role: UserRole;
  vipTier: VIPTier;
  photoURL?: string;
  createdAt: string;
}

const USERS_COLLECTION = 'users';

// Ensures a user exists in Firestore when they log in
export async function syncUserOnAuth(uid: string, email: string, displayName: string | null, photoURL: string | null) {
  if (!uid || !email) return;

  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // New user, create record
    const isSuperAdmin = email.toLowerCase() === 'beno@admin.com';
    const newUser: Partial<ManagedUser> = {
      email,
      name: displayName || email.split('@')[0],
      role: isSuperAdmin ? 'admin' : 'user',
      vipTier: 'Silver',
      createdAt: new Date().toISOString()
    };
    if (photoURL) {
      newUser.photoURL = photoURL;
    }
    await setDoc(userRef, { ...newUser, _createdAtServer: serverTimestamp() });
  }
}

// Subscribes to a single user's document (for their own auth context)
export function subscribeToUserDoc(uid: string, callback: (user: ManagedUser | null) => void) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as ManagedUser);
    } else {
      callback(null);
    }
  });
}

// Subscribes to all users (for Admin Dashboard)
export function subscribeToAllUsers(callback: (users: ManagedUser[]) => void) {
  const colRef = collection(db, USERS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const users: ManagedUser[] = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as ManagedUser);
    });
    // Sort by role (admins first), then by date
    users.sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    callback(users);
  });
}

// Admin: Update User Role
export async function updateUserRole(uid: string, newRole: UserRole) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, { role: newRole });
}

// Admin: Update VIP Tier
export async function updateUserVIPTier(uid: string, newTier: VIPTier) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, { vipTier: newTier });
}

// Admin: Delete User Doc (Note: this does not delete from Firebase Auth, just Firestore)
export async function deleteUserDoc(uid: string) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await deleteDoc(userRef);
}
