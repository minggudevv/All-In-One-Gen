'use server';

/**
 * @fileOverview Enhances a generated fake identity by adding a plausible backstory or profession using a GenAI model.
 *
 * - enhanceIdentity - A function that enhances the fake identity with a backstory.
 * - EnhanceIdentityInput - The input type for the enhanceIdentity function, extending the RandomUser type.
 * - EnhanceIdentityOutput - The return type for the enhanceIdentity function, including the enhanced backstory.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define a schema for the basic identity information (adjust according to the actual RandomUser API response)
const BasicIdentitySchema = z.object({
  name: z.object({
    title: z.string(),
    first: z.string(),
    last: z.string(),
  }),
  email: z.string().email(),
  location: z.object({
    street: z.object({
      number: z.number(),
      name: z.string(),
    }),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postcode: z.any(), // Can be string or number
  }),
  phone: z.string(),
  dob: z.object({
    date: z.string(),
    age: z.number(),
  }),
  picture: z.object({
    large: z.string(),
    medium: z.string(),
    thumbnail: z.string(),
  }),
});

export type BasicIdentity = z.infer<typeof BasicIdentitySchema>;

const EnhanceIdentityInputSchema = BasicIdentitySchema.extend({
  // No additional fields needed here as we're extending the RandomUser type directly
});

export type EnhanceIdentityInput = z.infer<typeof EnhanceIdentityInputSchema>;

const EnhanceIdentityOutputSchema = z.object({
  enhancedBackstory: z.string().describe('A plausible backstory or profession based on the generated identity attributes.'),
});

export type EnhanceIdentityOutput = z.infer<typeof EnhanceIdentityOutputSchema>;

export async function enhanceIdentity(input: EnhanceIdentityInput): Promise<EnhanceIdentityOutput> {
  return enhanceIdentityFlow(input);
}

const enhanceIdentityPrompt = ai.definePrompt({
  name: 'enhanceIdentityPrompt',
  input: {schema: EnhanceIdentityInputSchema},
  output: {schema: EnhanceIdentityOutputSchema},
  prompt: `You are an expert in creating plausible backstories for fictional characters.

  Given the following identity information, create a short backstory or profession that fits the person.

  Name: {{name.title}} {{name.first}} {{name.last}}
  Email: {{email}}
  Location: {{location.street.number}} {{location.street.name}}, {{location.city}}, {{location.state}}, {{location.country}} {{location.postcode}}
  Phone: {{phone}}
  Date of Birth: {{dob.date}} (Age: {{dob.age}})

  Backstory:`, // Provide clear instructions for the backstory generation
});

const enhanceIdentityFlow = ai.defineFlow(
  {
    name: 'enhanceIdentityFlow',
    inputSchema: EnhanceIdentityInputSchema,
    outputSchema: EnhanceIdentityOutputSchema,
  },
  async input => {
    const {output} = await enhanceIdentityPrompt(input);
    return output!;
  }
);
