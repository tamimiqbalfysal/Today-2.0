
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

function ThankYouSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto max-w-2xl p-4 flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-12 w-full" />
            <div className="flex w-full items-center space-x-2">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-10 w-32 mx-auto" />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


export default function ThankYouPage() {
  const { user, loading: authLoading } = useAuth();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Please enter a gift code.',
      });
      return;
    }

    if (!db || !user) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to redeem a code.',
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
          description: 'This gift code is invalid or has already been used.',
        });
        setIsVerifying(false);
        return;
      }
      
      // Mark code as used
      await updateDoc(giftCodeRef, { isUsed: true });
      
      // Increment user's redeemed codes
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { redeemedGiftCodes: increment(1) });

      toast({
        title: 'Congratulations!',
        description: 'Your Gift Code is submitted.',
      });
      formRef.current?.reset();
      setCode('');

    } catch (error: any) {
      console.error("Error verifying gift code:", error);
      let description = "An unexpected error occurred.";
      if (error.code === 'permission-denied') {
        description = "Permission Denied. Please check your Firestore security rules to ensure authenticated users can read and update the 'giftCodes' and 'users' collections.";
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

  if (authLoading) {
    return <ThankYouSkeleton />;
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto max-w-2xl p-4 flex-1 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">Thank You, G!</CardTitle>
              <CardDescription>
                Your support and guidance are truly appreciated. Have a gift code?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {user && (user.redeemedGiftCodes || 0) > 0 && (
                <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    Gift Codes Submitted: {user.redeemedGiftCodes}
                  </p>
                </div>
              )}
              <form ref={formRef} onSubmit={handleVerifyCode} className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  name="code"
                  placeholder="Enter your gift code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isVerifying}
                  aria-label="Gift Code"
                />
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Submit'}
                </Button>
              </form>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}
