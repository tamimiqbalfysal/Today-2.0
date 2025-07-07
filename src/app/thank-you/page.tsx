
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
                <CardTitle className="text-3xl font-bold text-primary">Thank u, G!</CardTitle>
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
                          Total Gift Codes in the system: {totalGiftCodes}
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
                      Your Share: {percentage.toFixed(2)}%
                    </p>
                  </div>
                )}
                <form ref={formRef} onSubmit={handleVerifyCode} className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    name="code"
                    placeholder="Enter your Gift Code"
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
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Check Out Our Other Apps!</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="#" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <Image src="/think-logo.png" alt="Think logo" width={32} height={32} />
                    <p className="mt-2 font-semibold text-sm">Think</p>
                  </div>
                </a>
                <a href="#" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <Image src="/findit-logo.png" alt="Findit logo" width={32} height={32} />
                    <p className="mt-2 font-semibold text-sm">Findit</p>
                  </div>
                </a>
                <a href="#" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <Image src="/mingle-logo.png" alt="Mingle logo" width={32} height={32} />
                    <p className="mt-2 font-semibold text-sm">Mingle</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Find Gift Codes Here!</CardTitle>
                <CardDescription className="text-center">
                  Follow our social channels for new gift codes.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="https://x.com/TamimIqbalFysal" target="_blank" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-foreground">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.61 19.69h2.54l-14.48-16.6H3.34l13.95 16.6Z"></path>
                    </svg>
                    <p className="mt-2 font-semibold text-sm">X</p>
                  </div>
                </a>
                <a href="https://www.facebook.com/Tamim.Iqbal.Fysal" target="_blank" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-foreground">
                      <g transform="scale(1.1) translate(-1.2, -1.2)">
                        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.196h3.312z"></path>
                      </g>
                    </svg>
                    <p className="mt-2 font-semibold text-sm">Facebook</p>
                  </div>
                </a>
                <a href="https://www.youtube.com/@Tamim-Iqbal-Fysal" target="_blank" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-foreground">
                      <g transform="scale(1.1) translate(-1.2, -1.2)">
                          <path d="M21.582 7.188a2.766 2.766 0 0 0-1.944-1.953C17.926 4.75 12 4.75 12 4.75s-5.926 0-7.638.485a2.766 2.766 0 0 0-1.944 1.953C2 8.905 2 12 2 12s0 3.095.418 4.812a2.766 2.766 0 0 0 1.944 1.953C6.074 19.25 12 19.25 12 19.25s5.926 0 7.638-.485a2.766 2.766 0 0 0 1.944-1.953C22 15.095 22 12 22 12s0-3.095-.418-4.812zM9.75 15.25V8.75L15.25 12 9.75 15.25z"></path>
                      </g>
                    </svg>
                    <p className="mt-2 font-semibold text-sm">YouTube</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">Today</Link>
            </Button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
