
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, updateDoc, increment, collection, getDocs, deleteField, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

import { db } from '@/lib/firebase';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedbackCard, type FeedbackData } from '@/components/fintrack/feedback-card';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';

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
  const [isCelebrating, setIsCelebrating] = useState(false);
  const { width, height } = useWindowSize();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferCode, setTransferCode] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

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
        description: 'Please enter a Gift Code.',
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

      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 5000); // Celebrate for 5 seconds

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

  const handleSaveFeedback = async (feedback: FeedbackData) => {
    if (!user || !db) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        paymentCategory: feedback.category,
        paymentAccountName: feedback.accountName,
        paymentAccountNumber: feedback.accountNumber,
        paymentNotes: feedback.anythingElse,
      });
      toast({
        title: 'Success!',
        description: 'Your payment information has been saved.',
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your payment information.',
      });
    }
  };
  
  const handleDeleteFeedback = async () => {
    if (!user || !db) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        paymentCategory: deleteField(),
        paymentAccountName: deleteField(),
        paymentAccountNumber: deleteField(),
        paymentNotes: deleteField(),
      });
      toast({
        title: 'Removed',
        description: 'Your payment information has been removed.',
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not remove your payment information.',
      });
    }
  };

  const handleTransferCode = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanRecipientEmail = recipientEmail.trim();
    const cleanTransferCode = transferCode.trim();

    if (!cleanRecipientEmail || !cleanTransferCode) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out both the recipient email and the gift code.',
      });
      return;
    }
    
    if (!db || !user) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to transfer a code.',
      });
      return;
    }

    if (cleanRecipientEmail === user.email) {
      toast({
        variant: 'destructive',
        title: 'Cannot Transfer to Self',
        description: 'You cannot send a gift code to yourself. Use the submission form above instead.',
      });
      return;
    }

    setIsTransferring(true);

    try {
      // Step 1: Check if the gift code is valid and not yet used.
      const giftCodeRef = doc(db, 'giftCodes', cleanTransferCode);
      const giftCodeSnap = await getDoc(giftCodeRef);

      if (!giftCodeSnap.exists() || giftCodeSnap.data()?.isUsed === true) {
        toast({
          variant: 'destructive',
          title: 'Transfer Failed',
          description: 'This gift code is invalid or has already been used.',
        });
        setIsTransferring(false);
        return;
      }
      
      // Step 2: Find the recipient user by their email address.
      // NOTE: This requires a Firestore index on the 'email' field in the 'users' collection.
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("email", "==", cleanRecipientEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
          toast({
              variant: 'destructive',
              title: 'Transfer Failed',
              description: 'No user found with that email address on this platform.',
          });
          setIsTransferring(false);
          return;
      }
      
      const recipientUserDoc = querySnapshot.docs[0];
      const recipientUserRef = recipientUserDoc.ref;
      
      // In a production app, use a transaction to ensure both updates succeed or fail together.
      // For this prototype, we'll perform sequential updates.

      // Step 3: Mark the gift code as used.
      await updateDoc(giftCodeRef, { isUsed: true });

      // Step 4: Increment the recipient's redeemed code count.
      await updateDoc(recipientUserRef, { redeemedGiftCodes: increment(1) });
      
      toast({
        title: 'Transfer Sent!',
        description: `Your gift code has been successfully sent to ${cleanRecipientEmail}.`,
      });
      
      setRecipientEmail('');
      setTransferCode('');

    } catch (error: any) {
      console.error("Error transferring gift code:", error);
      let description = "An unexpected error occurred during the transfer.";
      if (error.code === 'permission-denied') {
        description = "Permission Denied. Please check Firestore security rules. You may also need to create a Firestore index on the 'email' field of the 'users' collection.";
      } else if (error.code === 'failed-precondition') {
        description = "The query requires an index. You can create it in the Firebase console. The link to create it might be in your browser's developer console.";
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: description,
      });
    } finally {
        setIsTransferring(false);
    }
  };

  const redeemedCodes = user?.redeemedGiftCodes || 0;
  const percentage = totalGiftCodes && totalGiftCodes > 0 ? (redeemedCodes / totalGiftCodes) * 100 : 0;

  if (authLoading || !user) {
    return <ThankYouSkeleton />;
  }

  return (
    <AuthGuard>
      {isCelebrating && width > 0 && height > 0 && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
        />
      )}
      <div className="theme-navy flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto max-w-2xl p-4 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <Card className="w-full text-center">
              <CardHeader>
                <motion.div
                  whileHover={{ rotate: [0, -1, 1, -1, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="cursor-pointer"
                >
                  <CardTitle className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent">Thank u, G!</CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isTotalCodesLoading ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : totalGiftCodes !== null && (
                  <div className="p-3 rounded-md bg-[hsl(var(--chart-1))]">
                      <p className="font-semibold text-primary-foreground">
                          Total Gift Codes: {totalGiftCodes}
                      </p>
                  </div>
                )}
                {user && (
                  <div className="p-3 rounded-md bg-[hsl(var(--chart-2))]">
                    <p className="font-semibold text-primary-foreground">
                      Gift Codes You Have Submitted: {redeemedCodes}
                    </p>
                  </div>
                )}
                {totalGiftCodes !== null && totalGiftCodes > 0 && user?.redeemedGiftCodes !== undefined && (
                  <div className="p-3 rounded-md bg-[hsl(var(--chart-3))]">
                    <p className="font-semibold text-primary-foreground">
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
                    disabled={isVerifying || isCelebrating}
                    aria-label="Gift Code"
                  />
                  <motion.button
                    className={cn(buttonVariants())}
                    type="submit"
                    disabled={isVerifying || isCelebrating}
                    animate={isCelebrating ? "celebrate" : "initial"}
                    variants={{
                      initial: { scale: 1, rotate: 0 },
                      celebrate: {
                        scale: [1, 1.1, 1, 1.1, 1],
                        rotate: [0, -3, 3, -3, 0],
                        transition: { duration: 0.5, ease: "easeInOut" },
                      },
                    }}
                  >
                    {isVerifying ? 'Verifying...' : isCelebrating ? 'Success!' : 'Submit'}
                  </motion.button>
                </form>
              </CardContent>
            </Card>

            <FeedbackCard
              user={user}
              onSave={handleSaveFeedback}
              onDelete={handleDeleteFeedback}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Share a Gift with a Friend 🎁</CardTitle>
                <CardDescription className="text-center">
                  Want to send one of your gift codes to someone else?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransferCode} className="space-y-4">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="recipientEmail">Recipient's Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="friend@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      disabled={isTransferring}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <Label htmlFor="transferCode">Gift Code to Send</Label>
                    <Input
                      id="transferCode"
                      type="text"
                      placeholder="Enter the gift code"
                      value={transferCode}
                      onChange={(e) => setTransferCode(e.target.value)}
                      disabled={isTransferring}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isTransferring || !recipientEmail || !transferCode}>
                    {isTransferring ? 'Sending...' : 'Send Gift Code'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
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
                <a href="https://x.com/TamimIqbalFysal" target="_blank" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-foreground">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.61 19.69h2.54l-14.48-16.6H3.34l13.95 16.6Z"></path>
                    </svg>
                    <p className="mt-2 font-semibold text-sm">X</p>
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
