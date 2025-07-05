'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import type { User } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { CreatePostForm } from '@/components/fintrack/add-transaction-dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreatePostPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const user: User | null = firebaseUser ? {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || "Anonymous User",
    email: firebaseUser.email || "No email",
    photoURL: firebaseUser.photoURL
  } : null;
  
  const handleAddPost = useCallback(async (content: string) => {
    if (!user || !db || !content.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.name,
        authorPhotoURL: user.photoURL || `https://placehold.co/40x40/FFD700/FFFFFF?text=${user.name.charAt(0)}`,
        content: content,
        timestamp: Timestamp.now(),
        likes: [],
        comments: [],
      });
      toast({
        title: "Post Created!",
        description: "Your post has been successfully shared.",
      });
      router.push('/');
    } catch (error: any) {
       console.error("Error adding post:", error);
       let description = "An unexpected error occurred while adding the post.";
       if (error.code === 'permission-denied') {
           description = "You do not have permission to create a post. Please make sure you have updated the Firestore security rules in the Firebase Console.";
       }
       toast({
        variant: "destructive",
        title: "Could Not Create Post",
        description: description,
      });
      throw error;
    }
  }, [user, toast, router]);
  
  if (authLoading || !user) {
    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Header />
                <main className="container mx-auto max-w-2xl p-4 flex-1">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-start gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="w-full space-y-2">
                                    <Skeleton className="h-24 w-full" />
                                    <div className="flex justify-end">
                                        <Skeleton className="h-10 w-24" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </AuthGuard>
    );
  }

  return (
    <AuthGuard>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto max-w-2xl p-4 flex-1">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Post</CardTitle>
                    <CardDescription>Share what's happening today!</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreatePostForm 
                        user={user} 
                        onAddPost={handleAddPost}
                    />
                </CardContent>
            </Card>
          </main>
        </div>
    </AuthGuard>
  );
}
