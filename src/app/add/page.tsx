'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AddPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto max-w-2xl p-4 flex-1">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Find and Add</h1>
            <div className="flex w-full items-center space-x-2">
              <Input type="text" placeholder="Search for something to add..." />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
