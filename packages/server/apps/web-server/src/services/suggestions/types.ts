import { z } from 'zod';

export const suggestionItemSchema = z.object({
  blockId: z.string().describe('The ID of the EditableTypography component this suggestion applies to'),
  text: z.string().describe('The suggestion text explaining what should be improved'),
  startOffset: z.number().nullable().describe('Character offset where the suggestion applies (null for whole-block suggestions)'),
  endOffset: z.number().nullable().describe('Character offset where the suggestion ends (null for whole-block suggestions)'),
});

export const suggestionResponseSchema = z.object({
  suggestions: z.array(suggestionItemSchema).describe('Array of suggestions for improving the CV'),
  summary: z.string().nullable().describe('Overall summary of the CV review (can be null)'),
});

export type SuggestionItem = z.infer<typeof suggestionItemSchema>;
export type SuggestionResponse = z.infer<typeof suggestionResponseSchema>;
