'use server';

/**
 * @fileOverview A task description suggestion AI agent.
 *
 * - suggestTaskDescription - A function that suggests a task description.
 * - SuggestTaskDescriptionInput - The input type for the suggestTaskDescription function.
 * - SuggestTaskDescriptionOutput - The return type for the suggestTaskDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the task.'),
  existingDescription: z.string().describe('The existing description of the task.'),
});
export type SuggestTaskDescriptionInput = z.infer<typeof SuggestTaskDescriptionInputSchema>;

const SuggestTaskDescriptionOutputSchema = z.object({
  suggestedDescription: z.string().describe('The suggested description for the task.'),
});
export type SuggestTaskDescriptionOutput = z.infer<typeof SuggestTaskDescriptionOutputSchema>;

export async function suggestTaskDescription(input: SuggestTaskDescriptionInput): Promise<SuggestTaskDescriptionOutput> {
  return suggestTaskDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskDescriptionPrompt',
  input: {schema: SuggestTaskDescriptionInputSchema},
  output: {schema: SuggestTaskDescriptionOutputSchema},
  prompt: `You are a helpful AI assistant that suggests task descriptions based on the task title and existing description.

  Title: {{{title}}}
  Existing Description: {{{existingDescription}}}

  Suggest a new and improved description for the task:
  `,
});

const suggestTaskDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestTaskDescriptionFlow',
    inputSchema: SuggestTaskDescriptionInputSchema,
    outputSchema: SuggestTaskDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
