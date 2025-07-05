"use client"

import type { Post } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

const postColors = [
    { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", button: "text-blue-700 hover:text-blue-900", avatar: "border-blue-400" },
    { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", button: "text-green-700 hover:text-green-900", avatar: "border-green-400" },
    { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", button: "text-purple-700 hover:text-purple-900", avatar: "border-purple-400" },
];

interface PostCardProps {
  post: Post;
  colorTheme: typeof postColors[0];
}

function PostCard({ post, colorTheme }: PostCardProps) {
    const timestamp = post.timestamp?.toDate ? post.timestamp.toDate() : new Date();

    return (
        <div className={`${colorTheme.bg} p-6 rounded-2xl shadow-lg w-full`}>
            <div className="flex items-center space-x-4 mb-4">
                <Avatar className={`w-12 h-12 border-2 ${colorTheme.avatar}`}>
                    <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                    <AvatarFallback className="text-xl">{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className={`font-bold text-lg ${colorTheme.text}`}>{post.authorName}</p>
                    <p className={`text-sm ${colorTheme.text}/80`}>
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                </div>
            </div>
            <p className={`${colorTheme.text} text-lg mb-4`}>{post.content}</p>
            
            <Image 
                src={`https://placehold.co/800x450.png`} 
                alt="Post Image"
                data-ai-hint="kids drawing"
                width={800}
                height={450}
                className="w-full rounded-lg mb-4 shadow-md aspect-video object-cover"
            />
            
            <div className={`flex justify-around items-center pt-3 border-t ${colorTheme.border}`}>
                <Button variant="ghost" className={`${colorTheme.button} transition duration-200 text-base`}>
                    <Heart className="mr-2" />
                    <span className="font-semibold">Like</span>
                </Button>
                <Button variant="ghost" className={`${colorTheme.button} transition duration-200 text-base`}>
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
      {posts.map((post, index) => (
        <div key={post.id} className="h-full w-full snap-center flex items-center justify-center shrink-0 p-4">
          <PostCard post={post} colorTheme={postColors[index % postColors.length]} />
        </div>
      ))}
    </div>
  );
}
