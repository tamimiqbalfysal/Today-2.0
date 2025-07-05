"use client";

import { useState } from "react";
import Link from 'next/link';
import { Bell, LogOut, Settings, User as UserIcon, Menu, PenSquare, PlusCircle, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="bg-pink-500 p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto grid grid-cols-3 items-center">
        {user ? (
          <>
            {/* Left: User Menu */}
            <div className="justify-self-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-pink-300">
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                      <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        Welcome to Today! Share what you're up to.
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Center: Bell */}
            <div className="justify-self-center">
              <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                <Bell />
              </Button>
            </div>

            {/* Right: Title and Drawer */}
            <div className="flex items-center space-x-2 justify-self-end">
                <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold">🗓️</span>
                    <h1 className="text-white text-2xl font-extrabold tracking-tight">Today</h1>
                </div>
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-white hover:bg-pink-400 rounded-full">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-yellow-50/50">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <div className="py-4 pt-8 space-y-4">
                            <Button asChild size="lg" className="w-full justify-start text-lg font-bold bg-pink-100 text-pink-700 hover:bg-pink-200">
                                <Link href="/today" onClick={() => setIsDrawerOpen(false)}>
                                    <PenSquare className="mr-4" />
                                    Today
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
              <span className="text-3xl font-bold">🗓️</span>
              <h1 className="text-white text-2xl font-extrabold tracking-tight">Today</h1>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
