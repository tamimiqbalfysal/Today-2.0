'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ThankYouPage() {
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

    if (!db) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase is not configured correctly. Please check your .env file.',
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
        return;
      }
      
      // Optional: You could add logic here to mark the code as used, for example:
      // import { updateDoc } from 'firebase/firestore';
      // await updateDoc(giftCodeRef, { isUsed: true });

      toast({
        title: 'Success!',
        description: 'Gift code is valid! Thank you!',
      });
      formRef.current?.reset();
      setCode('');

    } catch (error: any) {
      console.error("Error verifying gift code:", error);
      let description = "An unexpected error occurred.";
      if (error.code === 'permission-denied') {
        description = "Permission Denied. Please check your Firestore security rules to ensure you can read 'giftCodes'.";
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
