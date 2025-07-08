
'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';

const apps = [
  { name: 'Think', logo: '/think-logo.png', href: '#' },
  { name: 'Findit', logo: '/findit-logo.png', href: '#' },
  { name: 'Mingle', logo: '/mingle-logo.png', href: '#' },
];

export default function AddPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
                    {filteredApps.map((app) => (
                      <a key={app.name} href={app.href} rel="noopener noreferrer" className="block hover:bg-accent/50 rounded-lg transition-colors">
                        <div className="flex flex-col items-center justify-center p-4 h-full border rounded-lg">
                          <Image src={app.logo} alt={`${app.name} logo`} width={48} height={48} />
                          <p className="mt-2 font-semibold text-lg">{app.name}</p>
                        </div>
                      </a>
                    ))}
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
