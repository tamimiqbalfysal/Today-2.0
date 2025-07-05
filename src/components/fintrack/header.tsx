"use client";

import { useState } from "react";
import Link from 'next/link';
import { Bell, LogOut, User as UserIcon, Menu, PenSquare } from "lucide-react";
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
      "bg-pink-500 p-4 sticky top-0 z-10 shadow-md transition-transform duration-300 ease-in-out",
      !isVisible && "-translate-y-full"
    )}>
      <div className="container mx-auto grid grid-cols-3 items-center">
        {user ? (
          <>
            {/* Left: Navigation Drawer */}
            <div className="justify-self-start">
                <Sheet open={isNavDrawerOpen} onOpenChange={setIsNavDrawerOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-yellow-50/50 w-72">
                      <SheetHeader>
                          <SheetTitle className="sr-only">Menu</SheetTitle>
                      </SheetHeader>
                      <div className="py-4 pt-8 space-y-4">
                          <Button asChild size="lg" className="w-full justify-start text-lg font-bold bg-pink-100 text-pink-700 hover:bg-pink-200">
                              <Link href="/today" onClick={() => setIsNavDrawerOpen(false)}>
                                  <PenSquare className="mr-4" />
                                  Create Post
                              </Link>
                          </Button>
                          <Button size="lg" className="w-full justify-start text-lg font-bold bg-green-100 text-green-700 hover:bg-green-200">
                              <UserIcon className="mr-4" />
                              Profile
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full justify-start text-lg font-bold bg-red-100 text-red-700 hover:bg-red-200"
                            onClick={() => {
                              logout();
                              setIsNavDrawerOpen(false);
                            }}
                          >
                              <LogOut className="mr-4" />
                              Log out
                          </Button>
                      </div>
                    </SheetContent>
                </Sheet>
            </div>
            
            {/* Center: Bell */}
            <div className="justify-self-center">
              <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                <Bell />
              </Button>
            </div>

            {/* Right: Profile Drawer */}
            <div className="justify-self-end">
              <Sheet open={isProfileDrawerOpen} onOpenChange={setIsProfileDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-pink-300">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                      <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-yellow-50/50 w-72 p-4">
                  <SheetHeader className="text-left mb-4 pb-4 border-b">
                      <SheetTitle className="sr-only">Profile Menu</SheetTitle>
                      <Avatar className="h-16 w-16 border-4 border-pink-300 mb-2">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                      <AvatarFallback className="text-2xl">{user.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <SheetTitle className="text-xl">{user.displayName}</SheetTitle>
                      <p className="text-sm text-muted-foreground">
                      {user.email}
                      </p>
                      <p className="text-sm text-muted-foreground italic pt-2">
                      Welcome to Today! Share what you're up to.
                      </p>
                  </SheetHeader>
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
