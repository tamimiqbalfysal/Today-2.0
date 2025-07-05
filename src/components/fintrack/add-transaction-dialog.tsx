"use client"

import { useState } from "react";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostFormProps {
  user: User;
  onAddPost: (content: string) => Promise<void>;
}

export function CreatePostForm({ user, onAddPost }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddPost(content);
      setContent("");
    } catch (error) {
      console.error("Error submitting post from form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userInitial = user.name ? user.name.charAt(0) : "🥳";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 border-2 border-yellow-400">
            <AvatarImage src={user.photoURL ?? `https://placehold.co/40x40/FFD700/FFFFFF?text=${userInitial}`} alt={user.name ?? ""} />
            <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <Textarea
            placeholder={`What's happening today, ${user.name}?`}
            className="flex-1 p-3 rounded-lg bg-yellow-50 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-yellow-800 placeholder-yellow-500 text-sm h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            />
        </div>
        <div className="flex justify-end">
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post"}
            </Button>
        </div>
    </form>
  );
}
