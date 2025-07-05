
'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifyGiftCode } from '@/ai/flows/verifyGiftCode';
import Link from 'next/link';

export default function ThankYouPage() {
  const [giftCode, setGiftCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a gift code.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyGiftCode({ code: giftCode });
      if (result.valid) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        setGiftCode(''); // Clear input on success
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error verifying gift code:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
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
                    <form onSubmit={handleVerifyCode} className="flex w-full items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Enter your gift code"
                        value={giftCode}
                        onChange={(e) => setGiftCode(e.target.value)}
                        disabled={isLoading}
                        aria-label="Gift Code"
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Submit'}
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
