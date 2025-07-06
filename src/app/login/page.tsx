
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 280.9 92 248 92c-73.8 0-134.3 60.3-134.3 134s60.5 134 134.3 134c82.3 0 112.1-61.5 115.8-92.6H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      let description = 'An unexpected error occurred during Google sign-in. Please try again.';
      if (error.code) {
          switch (error.code) {
              case 'auth/popup-closed-by-user':
                  description = 'The sign-in pop-up was closed. Please try again.';
                  break;
              case 'auth/cancelled-popup-request':
                  description = 'Multiple sign-in pop-ups were opened. Please try again.';
                  break;
              case 'auth/popup-blocked':
                  description = 'The sign-in pop-up was blocked by your browser. Please allow pop-ups for this site.';
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
        title: 'Google Sign-In Failed',
        description: description,
      });
    }
  }

  async function onSubmit(data: LoginFormValues) {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      const errorCode = error.code || 'auth/unknown-error';
      let message = 'An unexpected error occurred. Please try again.';
      
      switch (errorCode) {
        case 'auth/firebase-not-configured':
          message = 'Firebase is not configured. Please add your credentials to the .env file.';
          break;
        case 'auth/network-request-failed':
          message = 'Could not connect to Firebase. Please check your network connection and ensure your .env configuration is correct.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many login attempts. Please try again later.';
          break;
      }

      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: message,
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-center">
            Let's continue the adventure!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={form.formState.isSubmitting}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Log in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {form.formState.isSubmitting ? "Entering the realm..." : "Log In"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {process.env.NODE_ENV === 'development' && (
        <Alert variant="destructive" className="absolute bottom-4 right-4 max-w-md bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="font-bold">Developer Debug Info</AlertTitle>
          <AlertDescription>
            <p>
              <strong>Current Firebase Project ID:</strong>
              <code className="ml-2 font-mono bg-yellow-200 dark:bg-yellow-800/50 p-1 rounded">
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT SET!'}
              </code>
            </p>
            <p className="mt-2 text-xs">
              This ID must exactly match the Project ID of the Firebase project you are configuring in the console. Check your <strong>.env</strong> file.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
