'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User as FirebaseUser, signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signupWithGiftCode } from '@/ai/flows/signupWithGiftCode';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, giftCode: string) => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
        const error = new Error("Firebase is not configured. Please add your Firebase project configuration to a .env file.");
        (error as any).code = 'auth/firebase-not-configured';
        throw error;
    }
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/');
  };

  const signup = async (name: string, email: string, password: string, giftCode: string) => {
    if (!auth) {
        const error = new Error("Firebase is not configured.");
        (error as any).code = 'auth/firebase-not-configured';
        throw error;
    }
    
    // Call the server-side flow to handle validation and user creation
    const result = await signupWithGiftCode({ name, email, password, giftCode });
    
    // Sign in the user on the client with the custom token returned from the flow
    await signInWithCustomToken(auth, result.customToken);
    
    // The onAuthStateChanged listener will pick up the new user state.
    // We just need to redirect.
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
