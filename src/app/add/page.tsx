'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AddPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto max-w-2xl p-4 flex-1 flex items-center justify-center">
          <div className="w-full space-y-6">
             <Card>
              <CardHeader>
                <CardTitle className="text-center">Explore Our Ecosystem</CardTitle>
                <CardDescription className="text-center">Discover other applications to enhance your experience.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="#" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <Image src="/think-logo.png" alt="Think logo" width={48} height={48} />
                    <p className="mt-2 font-semibold text-lg">Think</p>
                  </div>
                </a>
                <a href="#" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <Image src="/findit-logo.png" alt="Findit logo" width={48} height={48} />
                    <p className="mt-2 font-semibold text-lg">Findit</p>
                  </div>
                </a>
                <a href="#" rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                    <Image src="/mingle-logo.png" alt="Mingle logo" width={48} height={48} />
                    <p className="mt-2 font-semibold text-lg">Mingle</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
