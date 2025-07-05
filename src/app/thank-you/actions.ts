'use server';

import { db } from '@/lib/firebase-admin';

export async function verifyGiftCode(currentState: any, formData: FormData) {
  const code = formData.get('code') as string;

  if (!code || code.trim() === '') {
    return { success: false, message: 'Please enter a gift code.' };
  }

  try {
    const giftCodeRef = db.collection('giftCodes').doc(code.trim());
    const doc = await giftCodeRef.get();

    if (!doc.exists) {
      return { success: false, message: 'Invalid gift code.' };
    }
    
    const data = doc.data();
    if (data?.isUsed === true) {
       return { success: false, message: 'This gift code has already been used.' };
    }

    // You can uncomment the following line to mark the code as used upon verification.
    // await giftCodeRef.update({ isUsed: true });

    return { success: true, message: 'Gift code is valid! Thank you!' };

  } catch (error: any) {
      console.error("Error verifying gift code in action:", error);
      
      // Provide a more direct error message, catching the specific permission issue.
      if (error.code === 7 || error.message.toLowerCase().includes('permission denied')) {
           return { success: false, message: 'Permission Error: The application is not authorized to access the database. Please ensure the App Engine default service account has the "Firebase Admin" or "Cloud Datastore User" role in the Google Cloud Console.' };
      }
      if (error.message.includes('Could not refresh access token')) {
          return { success: false, message: 'Authentication Error: The server could not get an access token. Please ensure the "Service Account Token Creator" role is added to the App Engine default service account in the Google Cloud Console and wait a few minutes for permissions to apply.' };
      }

      return { success: false, message: `Server Error: An unexpected error occurred. (${error.code || 'UNKNOWN'})` };
  }
}
