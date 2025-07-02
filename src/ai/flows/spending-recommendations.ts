'use server';
/**
 * @fileOverview A flow to generate a social media post suggestion based on a topic.
 *
 * - suggestPost - A function that suggests a post.
 * - SuggestPostInput - The input type for the suggestPost function.
 * - SuggestPostOutput - The return type for the suggestPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostInputSchema = z.object({
  topic: z.string().describe('The topic for the post suggestion.'),
});
export type SuggestPostInput = z.infer<typeof SuggestPostInputSchema>;

const SuggestPostOutputSchema = z.object({
    suggestion: z.string().describe('The suggested content for the social media post.'),
});
export type SuggestPostOutput = z.infer<typeof SuggestPostOutputSchema>;

export async function suggestPost(input: SuggestPostInput): Promise<SuggestPostOutput> {
  return postSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postSuggesterPrompt',
  input: {schema: SuggestPostInputSchema},
  output: {schema: SuggestPostOutputSchema},
  prompt: `You are a creative social media assistant.
  
  Generate a short, engaging social media post about the following topic: {{{topic}}}.
  
  Keep it concise and friendly.`,
});

const postSuggesterFlow = ai.defineFlow(
  {
    name: 'postSuggesterFlow',
    inputSchema: SuggestPostInputSchema,
    outputSchema: SuggestPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
