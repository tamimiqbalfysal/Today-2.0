
"use client";

import { useState } from "react";
import Link from 'next/link';
import { Menu, PenSquare, Trash2, User, LogOut, Globe2, PlusCircle, Heart } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Header({ isVisible = true }: { isVisible?: boolean }) {
  const { user, logout, deleteAccount } = useAuth();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (!deleteAccount) return;
    try {
      await deleteAccount(password);
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      setIsNavDrawerOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred while deleting your account.",
      });
    } finally {
      setPassword("");
    }
  };

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
                    <SheetContent side="left" className="bg-white w-72 flex flex-col p-0">
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
                           <Button asChild size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                              <Link href="/add" onClick={() => setIsNavDrawerOpen(false)}>
                                  <PlusCircle className="mr-4" />
                                  Add
                              </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="lg"
                                variant="ghost"
                                className="w-full justify-start text-lg font-bold text-destructive hover:text-destructive"
                              >
                                <Trash2 className="mr-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. To confirm, please enter your password. This will permanently delete your account and remove your data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                               <div className="space-y-2">
                                <Label htmlFor="password-confirm" className="sr-only">
                                  Password
                                </Label>
                                <Input
                                  id="password-confirm"
                                  type="password"
                                  placeholder="Enter your password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setPassword("")}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteAccount}
                                  disabled={!password}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Account
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                  <Globe2 />
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
                <SheetContent side="right" className="bg-white w-72 flex flex-col p-0">
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
                        <Button asChild size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                            <Link href="/thank-you" onClick={() => setIsProfileDrawerOpen(false)}>
                                <Heart className="mr-4" />
                                Thanku G
                            </Link>
                        </Button>
                        <Button 
                            size="lg" 
                            variant="ghost"
                            className="w-full justify-start text-lg font-bold"
                        >
                            <Trash2 className="mr-4" />
                            Remove
                        </Button>
                        <Button asChild size="lg" className="w-full justify-start text-lg font-bold" variant="ghost">
                            <Link href="/add" onClick={() => setIsProfileDrawerOpen(false)}>
                                <PlusCircle className="mr-4" />
                                Add
                            </Link>
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
