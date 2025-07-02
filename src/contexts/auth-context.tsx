'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    // This listener now ONLY cares about the raw auth state. No database calls here.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth || !db) {
        const error = new Error("Firebase is not configured. Please add your Firebase project configuration to a .env file.");
        (error as any).code = 'auth/firebase-not-configured';
        throw error;
    }
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/');
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!auth || !db) {
        const error = new Error("Firebase is not configured. Please add your Firebase project configuration to a .env file.");
        (error as any).code = 'auth/firebase-not-configured';
        throw error;
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Set a default photo URL
    const photoURL = `https://placehold.co/100x100.png?text=${name.charAt(0)}`;
    
    // Update the core Firebase Auth profile
    await updateProfile(firebaseUser, { 
      displayName: name,
      photoURL: photoURL
    });

    // Create the user's document in Firestore. This is a one-time operation
    // and is less prone to the login race condition.
    await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: name,
        email: email,
        photoURL: photoURL
    });
    
    // The onAuthStateChanged listener will pick up the new user state,
    // so we just need to redirect.
    router.push('/');
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      router.push('/login');
      return;
    };
    await signOut(auth);
    router.push('/login');
  };

  const value = { user, loading, login, logout, signup };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
