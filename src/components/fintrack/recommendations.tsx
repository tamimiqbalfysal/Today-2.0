"use client"

import { useState } from "react"
import { suggestPost } from "@/ai/flows/spending-recommendations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wand2, Lightbulb } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "../ui/input"

export function AISuggestionCard() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");

  const handleGetSuggestion = async () => {
    if (!topic.trim()) {
        setError("Please enter a topic.");
        return;
    }
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const result = await suggestPost({ topic });
      setSuggestion(result.suggestion);
    } catch (e) {
      console.error(e);
      setError("Failed to get suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="text-primary" />
          Post Assistant
        </CardTitle>
        <CardDescription>
          Stuck? Get an AI-powered post idea.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., My weekend trip"
            />
            <Button onClick={handleGetSuggestion} disabled={loading} className="w-full">
              <Lightbulb className="mr-2" />
              {loading ? "Generating..." : "Get Suggestion"}
            </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {suggestion && (
          <Alert>
            <AlertTitle className="font-semibold">Suggestion:</AlertTitle>
            <AlertDescription>{suggestion}</AlertDescription>
          </Alert>
        )}
         {loading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-full" />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
