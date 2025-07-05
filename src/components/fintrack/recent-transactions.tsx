"use client"

import type { Post } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
    const timestamp = post.timestamp?.toDate ? post.timestamp.toDate() : new Date();

    return (
        <div className="bg-card p-6 rounded-2xl w-full border border-border shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-primary/50">
                    <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                    <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-headline text-lg text-card-foreground">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                </div>
            </div>
            <p className="font-sans text-card-foreground text-lg mb-4">{post.content}</p>
            
            <div className="bg-gradient-to-br from-secondary/80 to-primary/60 flex flex-col items-center justify-center w-full rounded-lg mb-4 shadow-inner aspect-video text-primary-foreground relative overflow-hidden">
                <Sparkles className="w-16 h-16 text-accent/80 absolute top-4 left-4 animate-pulse" />
                <p className="text-4xl font-bold font-headline text-primary-foreground drop-shadow-lg">Fun Times!</p>
                <Sparkles className="w-10 h-10 text-accent/60 absolute bottom-6 right-8 animate-pulse [animation-delay:500ms]" />
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
