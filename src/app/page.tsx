"use client";

import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import type { Post, User } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

import { AuthGuard } from '@/components/auth/auth-guard';
import { Header } from '@/components/fintrack/header';
import { PostFeed } from '@/components/fintrack/recent-transactions';
import { Skeleton } from '@/components/ui/skeleton';

function TodaySkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-pink-500 p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-full bg-pink-400" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32 bg-pink-400" />
            <Skeleton className="h-10 w-10 rounded-full bg-pink-400" />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 max-w-2xl space-y-6 flex-1">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
      </main>
    </div>
  );
}


export default function TodayPage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { toast } = useToast();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const currentScrollY = scrollContainerRef.current.scrollTop;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    }
  };

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
  
  if (authLoading || (isDataLoading && firebaseUser)) {
    return <TodaySkeleton />;
  }

  return (
    <AuthGuard>
        <div className="flex flex-col h-screen bg-gray-100">
          <Header isVisible={isHeaderVisible} />
          <main className="container mx-auto max-w-2xl p-4 flex-1 overflow-hidden">
            <PostFeed 
              posts={posts} 
              scrollContainerRef={scrollContainerRef}
              onScroll={handleScroll}
            />
          </main>
        </div>
    </AuthGuard>
  );
}
