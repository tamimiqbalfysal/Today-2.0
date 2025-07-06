
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Facebook, Youtube } from 'lucide-react';

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
          <CardDescription>To know about Gift Disbursement follow TIF everywhere.</CardDescription>
          <div className="flex justify-center gap-4 pt-2">
            <a href="https://x.com/TamimIqbalFysal" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                </svg>
            </a>
            <a href="https://www.facebook.com/Tamim.Iqbal.Fysal" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://www.youtube.com/@Tamim-Iqbal-Fysal" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Youtube" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
          </div>
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
                onChange={(e) => setAccountName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                type="text"
                inputMode="numeric"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
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
