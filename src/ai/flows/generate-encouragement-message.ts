// use server'
'use server';

/**
 * @fileOverview Generates an encouraging message for a student based on their class and progress.
 *
 * - generateEncouragementMessage - A function that generates the encouragement message.
 * - GenerateEncouragementMessageInput - The input type for the generateEncouragementMessage function.
 * - GenerateEncouragementMessageOutput - The return type for the generateEncouragementMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEncouragementMessageInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  className: z.string().describe('The name of the class the student is in.'),
  progressDescription: z
    .string()
    .describe(
      'A description of the student\'s progress, including strengths and areas for improvement.'
    ),
});
export type GenerateEncouragementMessageInput = z.infer<
  typeof GenerateEncouragementMessageInputSchema
>;

const GenerateEncouragementMessageOutputSchema = z.object({
  encouragementMessage: z
    .string()
    .describe('An encouraging message tailored to the student.'),
});
export type GenerateEncouragementMessageOutput = z.infer<
  typeof GenerateEncouragementMessageOutputSchema
>;

export async function generateEncouragementMessage(
  input: GenerateEncouragementMessageInput
): Promise<GenerateEncouragementMessageOutput> {
  return generateEncouragementMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEncouragementMessagePrompt',
  input: {schema: GenerateEncouragementMessageInputSchema},
  output: {schema: GenerateEncouragementMessageOutputSchema},
  prompt: `You are a motivational coach for children at Tricks Land academy.

  Generate an encouraging message for the student, {{studentName}}, who is in the class, {{className}}.

  Here's a description of their progress: {{progressDescription}}

  The message should be positive, specific, and aimed at motivating the student to continue improving. It should also be suitable for children.
  The message should also be in both English and Arabic.
  `,
});

const generateEncouragementMessageFlow = ai.defineFlow(
  {
    name: 'generateEncouragementMessageFlow',
    inputSchema: GenerateEncouragementMessageInputSchema,
    outputSchema: GenerateEncouragementMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
