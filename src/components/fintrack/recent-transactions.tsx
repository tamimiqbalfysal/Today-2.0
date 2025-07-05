"use client"

import { useState, useEffect } from "react";
import type { Post } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
    const timestamp = post.timestamp?.toDate ? post.timestamp.toDate() : new Date();
    const [borderColor, setBorderColor] = useState('transparent');

    useEffect(() => {
        // Generate a random vibrant color for the border
        const hue = Math.floor(Math.random() * 360);
        setBorderColor(`hsl(${hue}, 90%, 60%)`);
    }, []); // Empty dependency array ensures this runs once on mount, only on the client

    return (
        <div 
            className="bg-card p-6 rounded-2xl w-full border-2 shadow-md transition-shadow hover:shadow-lg"
            style={{ borderColor: borderColor }}
        >
            <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-primary/50">
                    <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                    <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-lg text-card-foreground">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                </div>
            </div>
            <p className="font-sans text-card-foreground text-lg mb-4">{post.content}</p>
            
            <div 
                className="bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950 flex flex-col items-center justify-center w-full rounded-lg mb-4 shadow-inner aspect-video text-muted-foreground relative overflow-hidden border-2"
                style={{ borderColor: borderColor }}
            >
                <p className="text-2xl font-bold">Media Placeholder</p>
            </div>
            
            <div className="flex justify-around items-center pt-3 border-t border-border">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary transition duration-200 text-base">
                    <Heart className="mr-2" />
                    <span className="font-semibold">Like</span>
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-primary transition duration-200 text-base">
                    <MessageCircle className="mr-2" />
                    <span className="font-semibold">Comment</span>
                </Button>
            </div>
        </div>
    );
}


interface PostFeedProps {
  posts: Post[];
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
}

export function PostFeed({ posts, scrollContainerRef, onScroll }: PostFeedProps) {
  if (!posts.length) {
    return (
      <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-semibold font-headline">No tales yet!</h3>
        <p className="text-sm">Be the first to share something magical!</p>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} onScroll={onScroll} className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth">
      {posts.map((post) => (
        <div key={post.id} className="h-full w-full snap-center flex items-center justify-center shrink-0 p-4">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
