"use client";

import { useState } from "react";
import Link from 'next/link';
import { Menu, PenSquare, Bell, Trash2, User, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/auth-context';
import { cn } from "@/lib/utils";

export function Header({ isVisible = true }: { isVisible?: boolean }) {
  const { user, logout } = useAuth();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  return (
    <header className={cn(
      "bg-background/80 backdrop-blur-sm border-b p-4 sticky top-0 z-10 transition-transform duration-300 ease-in-out",
      !isVisible && "-translate-y-full"
    )}>
      <div className="container mx-auto grid grid-cols-3 items-center">
        {user ? (
          <>
            {/* Left: Navigation Drawer */}
            <div className="justify-self-start">
                <Sheet open={isNavDrawerOpen} onOpenChange={setIsNavDrawerOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-background w-72 flex flex-col p-0">
                      <SheetHeader className="p-4 border-b border-border items-center">
                        <SheetTitle className="sr-only">User Menu</SheetTitle>
                        <Avatar className="h-16 w-16 border-4 border-primary/50">
                          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                          <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </SheetHeader>
                      <div className="flex-grow py-4 px-4 space-y-4">
                          <Button asChild size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                              <Link href="/today" onClick={() => setIsNavDrawerOpen(false)}>
                                  <PenSquare className="mr-4" />
                                  Create Post
                              </Link>
                          </Button>
                          <Button asChild size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                            <Link href="/profile" onClick={() => setIsNavDrawerOpen(false)}>
                                <User className="mr-4" />
                                Profile
                            </Link>
                          </Button>
                           <Button size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                              <Bell className="mr-4" />
                              Notifications
                          </Button>
                          <Button 
                            size="lg" 
                            variant="ghost"
                            className="w-full justify-start text-lg font-bold text-destructive hover:text-destructive"
                          >
                              <Trash2 className="mr-4" />
                              Remove
                          </Button>
                      </div>
                      <div className="p-4 border-t border-border">
                         <Button 
                            size="lg" 
                            className="w-full justify-start text-lg font-bold"
                            variant="ghost"
                            onClick={() => {
                                logout();
                                setIsNavDrawerOpen(false);
                            }}
                          >
                              <LogOut className="mr-4" />
                              Log Out
                          </Button>
                      </div>
                    </SheetContent>
                </Sheet>
            </div>
            
            {/* Center: Home */}
            <div className="justify-self-center">
              <Link href="/" aria-label="Home">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <Globe />
                </Button>
              </Link>
            </div>

            {/* Right: Another Drawer */}
            <div className="justify-self-end">
              <Sheet open={isProfileDrawerOpen} onOpenChange={setIsProfileDrawerOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background w-72 flex flex-col p-0">
                  <SheetHeader>
                      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex-grow py-4 px-4 space-y-4">
                        <Button asChild size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                            <Link href="/today" onClick={() => setIsProfileDrawerOpen(false)}>
                                <PenSquare className="mr-4" />
                                Today
                            </Link>
                        </Button>
                        <Button size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                            <Bell className="mr-4" />
                            Notifications
                        </Button>
                        <Button 
                            size="lg" 
                            variant="ghost"
                            className="w-full justify-start text-lg font-bold text-destructive hover:text-destructive"
                        >
                            <Trash2 className="mr-4" />
                            Remove
                        </Button>
                    </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <>
            {/* LOGGED OUT STATE */}
            <div className="col-span-3 flex items-center justify-center space-x-2">
            </div>
          </>
        )}
      </div>
    </header>
  );
}
