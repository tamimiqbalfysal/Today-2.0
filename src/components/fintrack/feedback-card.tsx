
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
          <CardDescription>When any Gift Disbursement will happen, you will get your Gift percentage automatically to your given account.</CardDescription>
          <div className="flex justify-center gap-4 pt-2">
            <a href="https://x.com/TamimIqbalFysal" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.61 19.69h2.54l-14.48-16.6H3.34l13.95 16.6Z"></path>
                </svg>
            </a>
            <a href="https://www.facebook.com/Tamim.Iqbal.Fysal" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <g transform="scale(1.1) translate(-1.2, -1.2)">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.196h3.312z"></path>
                </g>
              </svg>
            </a>
            <a href="https://www.youtube.com/@Tamim-Iqbal-Fysal" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Youtube" className="text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                 <g transform="scale(1.1) translate(-1.2, -1.2)">
                    <path d="M21.582 7.188a2.766 2.766 0 0 0-1.944-1.953C17.926 4.75 12 4.75 12 4.75s-5.926 0-7.638.485a2.766 2.766 0 0 0-1.944 1.953C2 8.905 2 12 2 12s0 3.095.418 4.812a2.766 2.766 0 0 0 1.944 1.953C6.074 19.25 12 19.25 12 19.25s5.926 0 7.638-.485a2.766 2.766 0 0 0 1.944-1.953C22 15.095 22 12 22 12s0-3.095-.418-4.812zM9.75 15.25V8.75L15.25 12 9.75 15.25z"></path>
                 </g>
              </svg>
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
              Submit
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
