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
import { registerOrUpdateUser, UserRole } from '@/lib/userManagementStore';

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
  uploadAvatar: async () => ''
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const isAdm = currentUser.email.toLowerCase() === 'beno@admin.com';
        const uRec = registerOrUpdateUser(currentUser.email, currentUser.displayName || undefined, isAdm ? 'admin' : 'user');
        setIsAdmin(uRec.role === 'admin' || isAdm);
        setUserRole(uRec.role);
      } else {
        setIsAdmin(false);
        setUserRole('user');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Real Firebase Google Sign-In — no mock fallback
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    // Special Admin Account: authenticate via Firebase
    // The admin account beno@admin.com must exist in Firebase Auth
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      // Admin-only fallback: if beno@admin.com credentials are correct but Firebase
      // auth isn't configured, allow local admin session
      const isSpecialAdmin = email.toLowerCase() === 'beno@admin.com' && pass === 'sannibeno';
      if (isSpecialAdmin) {
        const mockAdmin = {
          uid: 'usr-admin-01',
          email: 'beno@admin.com',
          displayName: 'BENO Administrator',
          photoURL: ''
        } as any;
        setUser(mockAdmin);
        setIsAdmin(true);
        setUserRole('admin');
        registerOrUpdateUser(email, 'BENO Administrator', 'admin');
        return;
      }
      // For regular users, re-throw so the UI can show the error
      throw e;
    }
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
      loading, 
      isAdmin, 
      userRole, 
      signInWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      logout, 
      uploadAvatar 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
