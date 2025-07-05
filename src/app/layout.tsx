import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'Kidbook',
  description: 'Fun for Kids!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-blue-300 to-purple-300" suppressHydrationWarning>
        <AuthProvider>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md h-[95vh] max-h-[800px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
                    {children}
                </div>
            </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
