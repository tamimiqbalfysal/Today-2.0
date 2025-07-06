
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { doc, getDoc, updateDoc, increment, collection, getDocs } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedbackCard } from '@/components/fintrack/feedback-card';

function ThankYouSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto max-w-2xl p-4 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader className="text-center space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <div className="flex w-full items-center space-x-2">
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Skeleton className="h-10 w-full" />
        </div>
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
  const [totalGiftCodes, setTotalGiftCodes] = useState<number | null>(null);
  const [isTotalCodesLoading, setIsTotalCodesLoading] = useState(true);

  useEffect(() => {
    if (!db) {
        setIsTotalCodesLoading(false);
        return;
    }

    const fetchTotalCodes = async () => {
        setIsTotalCodesLoading(true);
        try {
            const giftCodesCollection = collection(db, 'giftCodes');
            const giftCodesSnapshot = await getDocs(giftCodesCollection);
            setTotalGiftCodes(giftCodesSnapshot.size);
        } catch (error) {
            console.error("Error fetching total gift codes count:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load the total number of gift codes."
            });
        } finally {
            setIsTotalCodesLoading(false);
        }
    };

    fetchTotalCodes();
  }, [toast]);

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

  const redeemedCodes = user?.redeemedGiftCodes || 0;
  const percentage = totalGiftCodes && totalGiftCodes > 0 ? (redeemedCodes / totalGiftCodes) * 100 : 0;

  if (authLoading) {
    return <ThankYouSkeleton />;
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto max-w-2xl p-4 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <Card className="w-full text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">Thank You, G!</CardTitle>
                <CardDescription>
                  Your support and guidance are truly appreciated. Have a gift code?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isTotalCodesLoading ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : totalGiftCodes !== null && (
                  <div className="p-3 rounded-md bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800">
                      <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                          Total Gift Codes in System: {totalGiftCodes}
                      </p>
                  </div>
                )}
                {user && (
                  <div className="p-3 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <p className="font-semibold text-green-800 dark:text-green-300">
                      Gift Codes You Have Submitted: {redeemedCodes}
                    </p>
                  </div>
                )}
                {totalGiftCodes !== null && totalGiftCodes > 0 && user?.redeemedGiftCodes !== undefined && (
                  <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-blue-800 dark:text-blue-300">
                      Your Redemption Rate: {percentage.toFixed(2)}%
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">You've claimed {redeemedCodes} of the {totalGiftCodes} Gift Codes.</p>
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
              </CardContent>
            </Card>

            <FeedbackCard />
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Today</Link>
            </Button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
