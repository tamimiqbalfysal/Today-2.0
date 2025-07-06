
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SubmittedFeedback {
  category: string;
  message: string;
}

export function FeedbackCard() {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedback | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && message) {
      setSubmittedFeedback({ category, message });
      setCategory('');
      setMessage('');
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Share Your Thoughts</CardTitle>
          <CardDescription>We'd love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="feedback-category">Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="feedback-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bkash">Bkash</SelectItem>
                  <SelectItem value="Nagad">Nagad</SelectItem>
                  <SelectItem value="Upay">Upay</SelectItem>
                  <SelectItem value="Cellfin">Cellfin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="feedback-message">Message</Label>
              <Input
                id="feedback-message"
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!category || !message}>
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {submittedFeedback && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Submitted Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-left">
            <div>
              <p className="font-semibold text-muted-foreground">Category</p>
              <p>{submittedFeedback.category}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Message</p>
              <p>{submittedFeedback.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
