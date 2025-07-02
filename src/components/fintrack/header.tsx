"use client";

import Link from 'next/link';
import { User, Settings, LifeBuoy, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="flex items-center justify-between p-2 px-4 border-b bg-card sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        {loading ? (
          <>
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-7 w-28" />
          </>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto focus-visible:ring-0 focus-visible:ring-offset-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL ?? undefined} alt={user.name} data-ai-hint="person portrait" />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0) : <User />}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold font-headline text-primary">
                  FaceLook
                </h1>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/">
            <h1 className="text-2xl font-bold font-headline text-primary">
              FaceLook
            </h1>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <Skeleton className="h-9 w-9 rounded-md" />
        ) : user ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 py-4">
                <Button variant="ghost" className="w-full justify-start text-base">
                  Today
                </Button>
                <Button variant="ghost" className="w-full justify-start text-base">
                  Add
                </Button>
                <Button variant="ghost" className="w-full justify-start text-base">
                  Remove
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
