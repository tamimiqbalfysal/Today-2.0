'use server';
/**
 * @fileOverview A flow to generate a social media post suggestion based on a topic.
 *
 * - suggestFunPost - A function that suggests a fun post.
 * - SuggestFunPostInput - The input type for the suggestFunPost function.
 * - SuggestFunPostOutput - The return type for the suggestFunPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFunPostInputSchema = z.object({
  topic: z.string().describe('The topic for the post suggestion.'),
});
export type SuggestFunPostInput = z.infer<typeof SuggestFunPostInputSchema>;

const SuggestFunPostOutputSchema = z.object({
    suggestion: z.string().describe('The suggested fun content for the social media post.'),
});
export type SuggestFunPostOutput = z.infer<typeof SuggestFunPostOutputSchema>;

export async function suggestFunPost(input: SuggestFunPostInput): Promise<SuggestFunPostOutput> {
  return funPostSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'funPostSuggesterPrompt',
  input: {schema: SuggestFunPostInputSchema},
  output: {schema: SuggestFunPostOutputSchema},
  prompt: `You are a super fun and creative friend who loves coming up with ideas for posts.
  
  Generate a short, playful, and exciting social media post about the following topic: {{{topic}}}.
  
  Use cheerful language and maybe an emoji!`,
});

const funPostSuggesterFlow = ai.defineFlow(
  {
    name: 'funPostSuggesterFlow',
    inputSchema: SuggestFunPostInputSchema,
    outputSchema: SuggestFunPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
