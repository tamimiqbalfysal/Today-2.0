'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface GiftCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string | null;
}

export function GiftCodeDialog({ open, onOpenChange, userId }: GiftCodeDialogProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Please enter a Think Code.',
      });
      return;
    }

    if (!db) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase is not configured correctly.',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const giftCodeRef = doc(db, 'giftCodes', code.trim());
      const docSnap = await getDoc(giftCodeRef);

      if (!docSnap.exists() || docSnap.data()?.isUsed === true) {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: 'This Think Code is invalid or has already been used.',
        });
        setIsVerifying(false);
        return;
      }
      
      await updateDoc(giftCodeRef, { isUsed: true });

      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { hasRedeemedGiftCode: true });
      }

      toast({
        title: 'Success!',
        description: 'Think Code is valid! Redirecting...',
      });
      
      router.push('/thank-you');
      onOpenChange(false);
      setCode('');

    } catch (error: any) {
      console.error("Error verifying Think Code:", error);
      let description = "An unexpected error occurred.";
      if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED') {
        description = "Permission Denied. Your security rules must allow 'update' on both the 'giftCodes' and 'users' collections for this to work. Please check your Firestore rules in the Firebase Console.";
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: description,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleCloseDialog = () => {
    if (!isVerifying) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>A Think Code For You!</DialogTitle>
          <DialogDescription>
            Have a special Think Code? Enter it below to claim your reward.
          </DialogDescription>
        </DialogHeader>
        <form id="gift-code-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            id="code"
            placeholder="Enter your Think Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isVerifying}
            aria-label="Think Code"
          />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog} disabled={isVerifying}>
            Cancel
          </Button>
          <Button type="submit" form="gift-code-form" disabled={isVerifying || !code.trim()}>
            {isVerifying ? 'Verifying...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
