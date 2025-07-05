'use server';
/**
 * @fileOverview A secure flow for verifying a gift code and updating the user's status.
 *
 * - verifyGiftCode - A function that validates a gift code and updates the user document.
 * - VerifyGiftCodeInput - The input type for the function.
 * - VerifyGiftCodeOutput - The return type for the function.
 */

import { z } from 'zod';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp(); // relies on Google Application Credentials in the cloud
}
const adminDb = admin.firestore();

const VerifyGiftCodeInputSchema = z.object({
  giftCode: z.string().min(1, 'Gift code is required.'),
  uid: z.string(),
});
export type VerifyGiftCodeInput = z.infer<typeof VerifyGiftCodeInputSchema>;

const VerifyGiftCodeOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type VerifyGiftCodeOutput = z.infer<typeof VerifyGiftCodeOutputSchema>;

export async function verifyGiftCode(input: VerifyGiftCodeInput): Promise<VerifyGiftCodeOutput> {
  try {
    const { giftCode, uid } = VerifyGiftCodeInputSchema.parse(input);
    const giftCodeRef = adminDb.collection('giftCodes').doc(giftCode);
    const userRef = adminDb.collection('users').doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const giftCodeDoc = await transaction.get(giftCodeRef);

      if (!giftCodeDoc.exists) {
        throw new Error('Invalid gift code.');
      }
      if (giftCodeDoc.data()?.isUsed) {
        throw new Error('This gift code has already been used.');
      }

      // Mark the code as used
      transaction.update(giftCodeRef, {
        isUsed: true,
        usedBy: uid,
        usedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      // Update the user's profile to mark them as verified
      transaction.update(userRef, {
        isGiftCodeVerified: true,
      });
    });

    return { success: true, message: 'Gift code successfully verified!' };
  } catch (error: any) {
    console.error('Gift code verification error:', error);
    
    // Check for specific permission errors
    if (error.code === 'permission-denied' || error.code === 7 || (error.message && error.message.toLowerCase().includes('permission denied'))) {
      return { success: false, message: 'Verification failed. The server does not have permission to access the database. Please check IAM roles.' };
    }

    // Return other known errors
    const clientMessage = error.message.includes('Invalid gift code') || error.message.includes('already been used')
      ? error.message
      : 'An unexpected error occurred during verification.';
    return { success: false, message: clientMessage };
  }
}
