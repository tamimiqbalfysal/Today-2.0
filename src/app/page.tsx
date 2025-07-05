"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import type { Post, User } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { CreatePostForm } from '@/components/fintrack/add-transaction-dialog';
import { PostFeed } from '@/components/fintrack/recent-transactions';
import { BottomNav } from '@/components/fintrack/overview';
import { Skeleton } from '@/components/ui/skeleton';

function KidbookSkeleton() {
  return (
    <div className="flex flex-col h-full">
        <header className="bg-pink-500 p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full bg-pink-400" />
                <Skeleton className="h-7 w-28 bg-pink-400" />
            </div>
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full bg-pink-400" />
                <Skeleton className="h-10 w-10 rounded-full bg-pink-400" />
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
        </main>
        <nav className="bg-indigo-500 p-3 flex justify-around items-center shadow-lg shrink-0">
            <Skeleton className="h-10 w-12 bg-indigo-400" />
            <Skeleton className="h-10 w-12 bg-indigo-400" />
            <Skeleton className="h-10 w-12 bg-indigo-400" />
            <Skeleton className="h-10 w-12 bg-indigo-400" />
        </nav>
    </div>
  );
}


export default function KidbookPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { toast } = useToast();

  const user: User | null = firebaseUser ? {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || "Anonymous User",
    email: firebaseUser.email || "No email",
    photoURL: firebaseUser.photoURL
  } : null;

  useEffect(() => {
    if (authLoading || !db) return; 
    
    if (!firebaseUser) {
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    const postsCol = collection(db, 'posts');
    const q = query(postsCol, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts: Post[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as Post;
      });
      setPosts(fetchedPosts);
      setIsDataLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      let description = "Could not load posts.";
      if (error.code === 'permission-denied') {
        description = "You don't have permission to view posts. Please check your Firestore security rules in the Firebase Console.";
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: description,
      });
      setIsDataLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseUser, authLoading, toast]);
  
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
  }, [user, toast]);
  
  if (authLoading || (isDataLoading && !posts.length)) {
    return <KidbookSkeleton />;
  }

  return (
    <AuthGuard>
        <div className="flex flex-col h-full bg-gray-50">
          <Header />
          <main className="flex-1 overflow-y-auto scrollable-content p-4 space-y-6">
            {user && <CreatePostForm user={user} onAddPost={handleAddPost} />}
            <PostFeed posts={posts} />
          </main>
          <BottomNav />
        </div>
    </AuthGuard>
  );
}
