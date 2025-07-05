'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { verifyGiftCode } from '@/ai/flows/verifyGiftCode';
import { useAuth } from '@/contexts/auth-context';

interface GiftCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GiftCodeDialog({ isOpen, onClose }: GiftCodeDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [giftCode, setGiftCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!giftCode.trim() || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a gift code.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyGiftCode({ giftCode, uid: user.uid });
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        // The dialog will close automatically because the `user.isGiftCodeVerified`
        // status will update, causing the `useEffect` in `page.tsx` to fire.
        // We don't need to call onClose() here.
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected network error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Your Gift Code</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your gift code to continue. This will reappear in one minute if you cancel.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Input
            placeholder="Your gift code"
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Submit'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
