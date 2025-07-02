"use client"

import type { Post } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
    const timestamp = post.timestamp?.toDate ? post.timestamp.toDate() : new Date();

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={post.authorPhotoURL} alt={post.authorName} data-ai-hint="person portrait" />
                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{post.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(timestamp, { addSuffix: true })}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="ghost" className="text-muted-foreground">
                    <ThumbsUp className="mr-2" /> Like
                </Button>
                <Button variant="ghost" className="text-muted-foreground">
                    <MessageSquare className="mr-2" /> Comment
                </Button>
            </CardFooter>
        </Card>
    );
}


interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
  if (!posts.length) {
    return (
      <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-semibold">No posts yet</h3>
        <p className="text-sm">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
