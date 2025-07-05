"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"
import { Image as ImageIcon } from "lucide-react";

interface CreatePostProps {
  user: User;
  onAddPost: (content: string) => Promise<void>;
}

export function CreatePostForm({ user, onAddPost }: CreatePostProps) {
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
  }

  const userInitial = user.name ? user.name.charAt(0) : "🥳";

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-100 p-4 rounded-xl shadow-md flex items-center space-x-3">
        <Avatar className="w-10 h-10 border-2 border-yellow-400">
            <AvatarImage src={user.photoURL ?? `https://placehold.co/40x40/FFD700/FFFFFF?text=${userInitial}`} alt={user.name ?? ""} />
            <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <Input 
            type="text" 
            placeholder="What's happening today?" 
            className="flex-1 p-3 rounded-full bg-yellow-50 border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-yellow-800 placeholder-yellow-500 text-sm h-auto"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
        />
        <Button type="button" size="icon" className="p-2 bg-yellow-400 rounded-full shadow-md hover:bg-yellow-300 transition duration-200 h-10 w-10">
            <ImageIcon className="text-yellow-800" />
        </Button>
    </form>
  )
}
