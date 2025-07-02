"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"
import { Send } from "lucide-react";

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
      // The parent component (`page.tsx`) is already handling and toasting the error.
      // We don't clear the content so the user can try again.
      console.error("Error submitting post from form:", error);
    } finally {
      // This ensures the submitting state is always reset, even if an error occurs.
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={user.photoURL ?? undefined} alt={user.name} data-ai-hint="person portrait" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder={`What's on your mind, ${user.name}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] text-base"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
