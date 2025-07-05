'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useActionState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifyGiftCode } from './actions';
import Link from 'next/link';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Verifying...' : 'Submit'}
    </Button>
  );
}

export default function ThankYouPage() {
  const [state, formAction] = useActionState(verifyGiftCode, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

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
                    <form ref={formRef} action={formAction} className="flex w-full items-center space-x-2">
                      <Input
                        type="text"
                        name="code"
                        placeholder="Enter your gift code"
                        disabled={useFormStatus().pending}
                        aria-label="Gift Code"
                      />
                      <SubmitButton />
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
