'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@/lib/firebase';
import { syncUserOnAuth, subscribeToUserDoc, UserRole } from '@/lib/userStoreFirestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userRole: UserRole;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  refreshAdminState: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  userRole: 'user',
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
  uploadAvatar: async () => '',
  refreshAdminState: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [dbUserLoading, setDbUserLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        // Sync user to Firestore
        await syncUserOnAuth(
          currentUser.uid, 
          currentUser.email, 
          currentUser.displayName || null, 
          currentUser.photoURL || null
        );

        // Listen for realtime role updates from their Firestore document
        unsubscribeDoc = subscribeToUserDoc(currentUser.uid, (dbUser) => {
          if (dbUser) {
            const isSuper = currentUser.email?.toLowerCase() === 'beno@admin.com';
            const role = isSuper ? 'admin' : dbUser.role;
            setIsAdmin(role === 'admin');
            setUserRole(role);
          } else {
            setIsAdmin(false);
            setUserRole('user');
          }
          setDbUserLoading(false);
          setLoading(false);
        });
      } else {
        // Not logged in
        setIsAdmin(false);
        setUserRole('user');
        setDbUserLoading(false);
        setLoading(false);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const refreshAdminState = () => {
    // Left for backwards compatibility if any component calls it. 
    // State is now entirely driven by real-time Firestore listeners.
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setUser(null);
    setIsAdmin(false);
    setUserRole('user');
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('User must be logged in to upload avatar');
    try {
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.warn('Firebase storage upload notice (using Object URL preview):', e);
      return URL.createObjectURL(file);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading: loading || (user !== null && dbUserLoading), 
      isAdmin,
      userRole,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      uploadAvatar,
      refreshAdminState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
