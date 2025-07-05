
'use server';
/**
 * @fileOverview A flow to verify a gift code.
 *
 * - verifyGiftCode - A function that verifies a gift code.
 * - VerifyGiftCodeInput - The input type for the verifyGiftCode function.
 * - VerifyGiftCodeOutput - The return type for the verifyGiftCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from '@/lib/firebase-admin';

const VerifyGiftCodeInputSchema = z.object({
  code: z.string().describe('The gift code to verify.'),
});
export type VerifyGiftCodeInput = z.infer<typeof VerifyGiftCodeInputSchema>;

const VerifyGiftCodeOutputSchema = z.object({
  valid: z.boolean().describe('Whether the gift code is valid.'),
  message: z.string().describe('A message about the verification result.'),
});
export type VerifyGiftCodeOutput = z.infer<typeof VerifyGiftCodeOutputSchema>;

export async function verifyGiftCode(input: VerifyGiftCodeInput): Promise<VerifyGiftCodeOutput> {
  return verifyGiftCodeFlow(input);
}

const verifyGiftCodeFlow = ai.defineFlow(
  {
    name: 'verifyGiftCodeFlow',
    inputSchema: VerifyGiftCodeInputSchema,
    outputSchema: VerifyGiftCodeOutputSchema,
  },
  async ({ code }) => {
    if (!code || code.trim() === '') {
      return { valid: false, message: 'Please enter a gift code.' };
    }

    try {
      const giftCodeRef = db.collection('giftCodes').doc(code.trim());
      const doc = await giftCodeRef.get();

      if (!doc.exists) {
        return { valid: false, message: 'Invalid gift code.' };
      }
      
      const data = doc.data();
      if (data?.isUsed === true) {
         return { valid: false, message: 'This gift code has already been used.' };
      }

      return { valid: true, message: 'Gift code is valid! Thank you!' };

    } catch (error: any) {
        console.error("Error verifying gift code in flow:", error);
        // Handle potential permission errors from Firestore
        if (error.code === 7 || (error.message && error.message.toLowerCase().includes('permission denied'))) {
             return { valid: false, message: 'Error: The application does not have permission to verify gift codes. Please check server configuration.' };
        }
        return { valid: false, message: 'An unexpected server error occurred while verifying the code.' };
    }
  }
);

