"use client";

import { useState } from "react";
import Link from 'next/link';
import { Bell, LogOut, Settings, User as UserIcon, Menu, PenSquare, PlusCircle, Trash2, Smile } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

export function Header({ isVisible = true }: { isVisible?: boolean }) {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);

  return (
    <header className={cn(
      "bg-pink-500 p-4 sticky top-0 z-10 shadow-md transition-transform duration-300 ease-in-out",
      !isVisible && "-translate-y-full"
    )}>
      <div className="container mx-auto grid grid-cols-3 items-center">
        {user ? (
          <>
            {/* Left: User Menu Drawer */}
            <div className="justify-self-start">
              <Sheet open={isLeftDrawerOpen} onOpenChange={setIsLeftDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-pink-300">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                      <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-yellow-50/50 w-72 p-4">
                  <SheetHeader className="text-left mb-4 pb-4 border-b">
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
                  <div className="py-4 space-y-2">
                     <Button variant="ghost" className="w-full justify-start gap-2 text-md">
                      <UserIcon className="h-5 w-5" />
                      <span>Profile</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-md">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Button>
                  </div>
                  <Separator />
                  <div className="py-4">
                    <Button variant="ghost" onClick={() => {
                        logout();
                        setIsLeftDrawerOpen(false);
                      }} className="w-full justify-start gap-2 text-md">
                      <LogOut className="h-5 w-5" />
                      <span>Log out</span>
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

            {/* Right: Drawer */}
            <div className="justify-self-end">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-yellow-50/50">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                        </SheetHeader>
                        <div className="py-4 pt-8 space-y-4">
                            <Button asChild size="lg" className="w-full justify-start text-lg font-bold bg-pink-100 text-pink-700 hover:bg-pink-200">
                                <Link href="/today" onClick={() => setIsDrawerOpen(false)}>
                                    <PenSquare className="mr-4" />
                                    Create Post
                                </Link>
                            </Button>
                            <Button size="lg" className="w-full justify-start text-lg font-bold bg-green-100 text-green-700 hover:bg-green-200" disabled>
                                <PlusCircle className="mr-4" />
                                Add
                            </Button>
                            <Button size="lg" className="w-full justify-start text-lg font-bold bg-red-100 text-red-700 hover:bg-red-200" disabled>
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
