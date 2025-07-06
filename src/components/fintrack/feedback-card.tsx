
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SubmittedFeedback {
  category: string;
  accountName: string;
  accountNumber: string;
}

export function FeedbackCard() {
  const [category, setCategory] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedback | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && accountName && accountNumber) {
      setSubmittedFeedback({ category, accountName, accountNumber });
      setCategory('');
      setAccountName('');
      setAccountNumber('');
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>I prefer to recieve my Gift</CardTitle>
          <CardDescription>We'd love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="feedback-category">Account</Label>
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
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                type="text"
                placeholder="Enter your account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                type="number"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!category || !accountName || !accountNumber}>
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
              <p className="font-semibold text-muted-foreground">Account</p>
              <p>{submittedFeedback.category}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Account Name</p>
              <p>{submittedFeedback.accountName}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Account Number</p>
              <p>{submittedFeedback.accountNumber}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
