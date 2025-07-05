'use server';
/**
 * @fileOverview A secure flow for handling user sign-up with a gift code.
 *
 * - signupWithGiftCode - A function that validates a gift code and creates a new user.
 * - SignupWithGiftCodeInput - The input type for the function.
 * - SignupWithGiftCodeOutput - The return type for the function.
 */

import { z } from 'zod';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp(); // relies on Google Application Credentials in the cloud
}
const adminDb = admin.firestore();
const adminAuth = admin.auth();

const SignupWithGiftCodeInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  giftCode: z.string().min(1, 'Gift code is required.'),
});
export type SignupWithGiftCodeInput = z.infer<typeof SignupWithGiftCodeInputSchema>;

const SignupWithGiftCodeOutputSchema = z.object({
  uid: z.string(),
  name: z.string(),
  email: z.string(),
});
export type SignupWithGiftCodeOutput = z.infer<typeof SignupWithGiftCodeOutputSchema>;

// This is now a self-contained Server Action
export async function signupWithGiftCode(input: SignupWithGiftCodeInput): Promise<SignupWithGiftCodeOutput> {
    try {
      const { name, email, password, giftCode } = input;
      const giftCodeRef = adminDb.collection('giftCodes').doc(giftCode);

      // 1. First, perform a non-transactional read to fail early if code is obviously invalid.
      const initialGiftCodeDoc = await giftCodeRef.get();
      if (!initialGiftCodeDoc.exists) {
        throw new Error('Invalid gift code.');
      }
      if (initialGiftCodeDoc.data()?.isUsed) {
        throw new Error('This gift code has already been used.');
      }

      // 2. Create the Firebase Auth user.
      let newUser;
      try {
        newUser = await adminAuth.createUser({
          email,
          password,
          displayName: name,
          photoURL: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
        });
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          throw new Error('This email address is already in use by another account.');
        }
        console.error('Firebase Auth user creation failed:', error);
        throw new Error('Could not create user account.');
      }

      // 3. Try to "claim" the gift code and create the user document in a transaction.
      try {
        await adminDb.runTransaction(async (transaction) => {
          const freshGiftCodeDoc = await transaction.get(giftCodeRef);
          if (!freshGiftCodeDoc.exists || freshGiftCodeDoc.data()?.isUsed) {
            // This means someone else used the code between our initial check and now.
            throw new Error('Gift code was just used by someone else. Please try another.');
          }

          // Mark the code as used
          transaction.update(giftCodeRef, {
            isUsed: true,
            usedBy: newUser.uid,
            usedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          
          // Also create the user's public profile document in 'users' collection
          const userDocRef = adminDb.collection('users').doc(newUser.uid);
          transaction.set(userDocRef, {
              name: name,
              email: email,
              photoURL: newUser.photoURL
          });
        });
      } catch (error: any) {
        // If the transaction failed, we must delete the orphaned Auth user.
        await adminAuth.deleteUser(newUser.uid);
        // Re-throw the error to inform the user.
        throw new Error(error.message || 'Could not claim gift code. Your account was not created.');
      }

      // 4. If we got here, everything succeeded. Return the new user's details.
      return {
        uid: newUser.uid,
        name: newUser.displayName || name,
        email: newUser.email || email,
      };
    } catch (error: any) {
        console.error('Full signup error:', error); // Log the full error on the server for debugging
        if (error.message && (error.message.includes('Could not refresh access token') || error.message.includes('Getting metadata from plugin failed') || error.message.includes('permission-denied') || error.message.includes('PERMISSION_DENIED'))) {
            throw new Error('Sign-up failed due to a server configuration issue. Please ensure the backend service has the correct Firebase/Google Cloud IAM permissions (e.g., Firebase Admin, Service Account User roles).');
        }
        // Re-throw other specific errors (like "Invalid gift code") so the user sees them.
        throw error;
    }
}
