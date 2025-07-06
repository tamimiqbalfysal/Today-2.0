
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Terminal, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { isFirebaseConfigured } from '@/lib/firebase';

const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 280.9 92 248 92c-73.8 0-134.3 60.3-134.3 134s60.5 134 134.3 134c82.3 0 112.1-61.5 115.8-92.6H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);

function FirebaseConfigurationWarning() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 dark:bg-yellow-950">
      <Card className="w-full max-w-lg m-4 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle /> Action Required: Configure Firebase
          </CardTitle>
          <CardDescription>
            Your app is not connected to Firebase. Please follow these steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>To use authentication and other Firebase features, you need to provide your project's configuration.</p>
          <div className="p-4 rounded-md bg-muted">
            <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold">Firebase Console</a>.</li>
                <li>Select your project, then click the gear icon for <strong>Project settings</strong>.</li>
                <li>In the "Your apps" card, select the "Web" platform (<code>&lt;/&gt;</code>).</li>
                <li>Copy the configuration variables (apiKey, authDomain, etc.) into your <strong>.env</strong> file.</li>
                <li>Restart your development server.</li>
            </ol>
          </div>
           <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Example .env file</AlertTitle>
              <AlertDescription>
                <pre className="text-xs whitespace-pre-wrap mt-2 bg-secondary p-2 rounded">
                    {`NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...`}
                </pre>
              </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [showFirebaseWarning, setShowFirebaseWarning] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isFirebaseConfigured) {
      setShowFirebaseWarning(true);
    }
  }, []);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      let description = 'An unexpected error occurred during Google sign-up. Please try again.';
      if (error.code) {
          switch (error.code) {
              case 'auth/popup-closed-by-user':
                  description = 'The sign-up pop-up was closed. Please try again.';
                  break;
              case 'auth/cancelled-popup-request':
                  description = 'Multiple sign-up pop-ups were opened. Please try again.';
                  break;
              case 'auth/popup-blocked':
                  description = 'The sign-up pop-up was blocked by your browser. Please allow pop-ups for this site.';
                  break;
              case 'auth/unauthorized-domain':
                   description = "This app's domain is not authorized for Google Sign-In. Please check the Firebase console.";
                   break;
              default:
                  description = `An error occurred: ${error.message}`;
          }
      }
      toast({
        variant: 'destructive',
        title: 'Google Sign-Up Failed',
        description: description,
      });
    }
  }

  async function onSubmit(data: SignupFormValues) {
    try {
      await signup(data.name, data.email, data.password);
    } catch (error: any) {
      const errorCode = error.code;
      let description = 'An unexpected error occurred. Please try again.';

      switch (errorCode) {
        case 'auth/email-already-in-use':
          description = 'This email is already in use by another account.';
          break;
        case 'auth/weak-password':
          description = 'Password is too weak. Please choose a stronger one.';
          break;
        case 'auth/network-request-failed':
          description = 'Could not connect to Firebase. Please check your network connection and ensure your .env configuration is correct.';
          break;
      }
      
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: description,
      });
    }
  }

  if (showFirebaseWarning) {
    return <FirebaseConfigurationWarning />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center text-primary">Join the Adventure!</CardTitle>
          <CardDescription className="text-center">
            Create an account to begin your story.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={form.formState.isSubmitting}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Elara the Brave" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Forging Account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
