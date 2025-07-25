'use server';

/**
 * @fileOverview Corrects the geographical coordinates for a given textual address using a GenAI model.
 *
 * - correctLocation - A function that takes an address and returns accurate latitude and longitude.
 * - CorrectLocationInput - The input type for the correctLocation function.
 * - CorrectLocationOutput - The return type for the correctLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CorrectLocationInputSchema = z.object({
  address: z.string().describe('The full street address, including city, state, and country.'),
});
export type CorrectLocationInput = z.infer<typeof CorrectLocationInputSchema>;

export const CorrectLocationOutputSchema = z.object({
  latitude: z.string().describe('The corrected latitude for the address.'),
  longitude: z.string().describe('The corrected longitude for the address.'),
});
export type CorrectLocationOutput = z.infer<typeof CorrectLocationOutputSchema>;

export async function correctLocation(input: CorrectLocationInput): Promise<CorrectLocationOutput> {
  return correctLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctLocationPrompt',
  input: {schema: CorrectLocationInputSchema},
  output: {schema: CorrectLocationOutputSchema},
  prompt: `You are a geocoding expert. Your task is to find the most accurate latitude and longitude for the given address.

Address: {{{address}}}

Return only the coordinates.`,
});

const correctLocationFlow = ai.defineFlow(
  {
    name: 'correctLocationFlow',
    inputSchema: CorrectLocationInputSchema,
    outputSchema: CorrectLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
