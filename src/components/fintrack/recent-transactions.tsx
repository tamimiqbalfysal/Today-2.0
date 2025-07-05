"use client"

import type { Post } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
    const timestamp = post.timestamp?.toDate ? post.timestamp.toDate() : new Date();

    return (
        <div className="bg-card p-6 rounded-2xl w-full border border-border shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-12 h-12 border-2 border-border">
                    <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                    <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold text-lg text-card-foreground">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                </div>
            </div>
            <p className="text-card-foreground text-lg mb-4">{post.content}</p>
            
            <div className="bg-gradient-to-br from-secondary to-background flex items-center justify-center w-full rounded-lg mb-4 shadow-inner aspect-video">
                <p className="text-4xl font-bold text-primary">Fun Times!</p>
            </div>
            
            <div className="flex justify-around items-center pt-3 border-t border-border">
                <Button variant="secondary" className="text-muted-foreground hover:text-primary transition duration-200 text-base">
                    <Heart className="mr-2" />
                    <span className="font-semibold">Like</span>
                </Button>
                <Button variant="secondary" className="text-muted-foreground hover:text-primary transition duration-200 text-base">
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
      <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-semibold">No posts yet!</h3>
        <p className="text-sm">Be the first to share something fun!</p>
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
