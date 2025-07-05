"use client";

import { useState } from "react";
import Link from 'next/link';
import { Bell, Menu, PenSquare, PlusCircle, Trash2, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
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
                    <SheetContent side="left" className="bg-yellow-50/50 w-72 flex flex-col p-0">
                      <SheetHeader className="p-4 border-b border-yellow-200 items-center">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <Avatar className="h-16 w-16 border-4 border-pink-300">
                          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                          <AvatarFallback className="text-2xl">{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </SheetHeader>
                      <div className="flex-grow py-4 px-4 space-y-4">
                          <Button asChild size="lg" className="w-full justify-start text-lg font-bold bg-pink-100 text-pink-700 hover:bg-pink-200">
                              <Link href="/today" onClick={() => setIsNavDrawerOpen(false)}>
                                  <PenSquare className="mr-4" />
                                  Create Post
                              </Link>
                          </Button>
                          <Button asChild size="lg" className="w-full justify-start text-lg font-bold bg-blue-100 text-blue-700 hover:bg-blue-200">
                            <Link href="/profile" onClick={() => setIsNavDrawerOpen(false)}>
                                <User className="mr-4" />
                                Profile
                            </Link>
                          </Button>
                           <Button size="lg" className="w-full justify-start text-lg font-bold bg-green-100 text-green-700 hover:bg-green-200">
                              <PlusCircle className="mr-4" />
                              Add
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full justify-start text-lg font-bold bg-red-100 text-red-700 hover:bg-red-200"
                          >
                              <Trash2 className="mr-4" />
                              Remove
                          </Button>
                      </div>
                      <div className="p-4 border-t border-yellow-200">
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
            
            {/* Center: Bell */}
            <div className="justify-self-center">
              <Link href="/" aria-label="Home">
                <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                  <Bell />
                </Button>
              </Link>
            </div>

            {/* Right: Another Drawer */}
            <div className="justify-self-end">
              <Sheet open={isProfileDrawerOpen} onOpenChange={setIsProfileDrawerOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-yellow-50/50 w-72 flex flex-col p-0">
                  <SheetHeader>
                      <SheetTitle className="sr-only">User Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex-grow py-4 px-4 space-y-4">
                        <Button asChild size="lg" className="w-full justify-start text-lg font-bold bg-pink-100 text-pink-700 hover:bg-pink-200">
                            <Link href="/today" onClick={() => setIsProfileDrawerOpen(false)}>
                                <PenSquare className="mr-4" />
                                Today
                            </Link>
                        </Button>
                        <Button size="lg" className="w-full justify-start text-lg font-bold bg-green-100 text-green-700 hover:bg-green-200">
                            <PlusCircle className="mr-4" />
                            Add
                        </Button>
                        <Button 
                            size="lg" 
                            className="w-full justify-start text-lg font-bold bg-red-100 text-red-700 hover:bg-red-200"
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
