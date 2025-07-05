'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, listen for their profile changes from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          setLoading(true);
          if (doc.exists()) {
            const firestoreData = doc.data() as Omit<AppUser, 'uid'>;
            setUser({
              uid: firebaseUser.uid,
              ...firestoreData,
              name: firebaseUser.displayName || firestoreData.name,
              email: firebaseUser.email || firestoreData.email,
              photoURL: firebaseUser.photoURL || firestoreData.photoURL,
            });
          } else {
            // This case might happen if Firestore doc creation fails during signup
            // Or for users that existed before the users collection was standard.
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL,
              isGiftCodeVerified: false, // Default value
            });
          }
          setLoading(false);
        }, (error) => {
            console.error("Error fetching user document:", error);
            setLoading(false);
        });

        return () => unsubscribeFirestore(); // Cleanup Firestore listener
      } else {
        // User is signed out
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
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

  const signup = async (name: string, email: string, password: string) => {
    if (!auth || !db) {
        const error = new Error("Firebase is not configured. Please add your Firebase project configuration to a .env file.");
        (error as any).code = 'auth/firebase-not-configured';
        throw error;
    }
    
    // Create user with client SDK
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Set a default photo URL
    const photoURL = `https://placehold.co/100x100.png?text=${name.charAt(0)}`;
    
    // Update the core Firebase Auth profile
    await updateProfile(firebaseUser, { 
      displayName: name,
      photoURL: photoURL
    });

    // Create the user's document in Firestore
    try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
            name: name,
            email: email,
            photoURL: photoURL,
            isGiftCodeVerified: false,
        });
    } catch (error) {
        // This is a good place to log a warning, but we don't want to fail the whole signup
        // if just the firestore doc creation fails. The auth user is already created.
        console.warn("Could not create user document in Firestore. Check security rules.", error);
    }
    
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
