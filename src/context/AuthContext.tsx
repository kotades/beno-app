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
import { registerOrUpdateUser, getManagedUsers, UserRole } from '@/lib/userManagementStore';

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

function computeAdminState(email: string | null | undefined): { isAdmin: boolean; userRole: UserRole } {
  if (!email) return { isAdmin: false, userRole: 'user' };
  const isSuper = email.toLowerCase() === 'beno@admin.com';
  const managed = getManagedUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  const role = managed?.role ?? (isSuper ? 'admin' : 'user');
  return { isAdmin: isSuper || role === 'admin', userRole: role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');

  const refreshAdminState = (email: string | null | undefined) => {
    const { isAdmin: newIsAdmin, userRole: newRole } = computeAdminState(email);
    setIsAdmin(newIsAdmin);
    setUserRole(newRole);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        registerOrUpdateUser(currentUser.email, currentUser.displayName || undefined);
      }
      refreshAdminState(currentUser?.email);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for localStorage changes (e.g., when admin promotes a user)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'beno_managed_users' && user?.email) {
        refreshAdminState(user.email);
      }
    };
    const handleCustom = () => {
      if (user?.email) refreshAdminState(user.email);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('beno-users-changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('beno-users-changed', handleCustom);
    };
  }, [user?.email]);

  const signInWithGoogle = async () => {
    // Real Firebase Google Sign-In — no mock fallback
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    // Real Firebase Auth only. Admin (beno@admin.com) must exist in Firebase Auth.
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
