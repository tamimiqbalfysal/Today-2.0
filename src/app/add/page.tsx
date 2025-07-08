'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useDrawer } from '@/contexts/drawer-context';
import type { DrawerApp } from '@/contexts/drawer-context';

const apps: DrawerApp[] = [
  { id: 'think', name: 'Think', logo: '/think-logo.png', href: '#' },
  { id: 'findit', name: 'Findit', logo: '/findit-logo.png', href: '#' },
  { id: 'mingle', name: 'Mingle', logo: '/mingle-logo.png', href: '#' },
];

export default function AddPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { addAppToDrawer, isAppInDrawer } = useDrawer();

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="px-6 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search applications..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CardContent>
                {filteredApps.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {filteredApps.map((app) => {
                      const isAdded = isAppInDrawer(app.id);
                      return (
                        <div key={app.id} className="flex flex-col items-center justify-between p-4 h-full border rounded-lg space-y-4">
                          <div className="flex flex-col items-center space-y-2 text-center">
                            <Image src={app.logo} alt={`${app.name} logo`} width={48} height={48} />
                            <p className="mt-2 font-semibold text-lg">{app.name}</p>
                          </div>
                          <Button
                            onClick={() => addAppToDrawer(app)}
                            disabled={isAdded}
                            className="w-full mt-auto"
                            variant={isAdded ? 'secondary' : 'default'}
                          >
                            {isAdded ? <CheckCircle className="mr-2" /> : null}
                            {isAdded ? 'Added' : 'Add'}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No applications found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
