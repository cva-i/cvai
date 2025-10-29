import { z } from 'zod';

export const commentItemSchema = z.object({
  blockId: z.string().describe('The ID of the EditableTypography component this comment applies to'),
  text: z.string().describe('The comment text explaining what should be improved'),
  suggestedText: z.string().nullable().describe('Optional suggested replacement text (if provided, will show as a diff with apply button). Set to null if not providing a replacement.'),
  highlightType: z.enum(['chunk', 'sentence', 'section']).describe('Type of highlighting: "chunk" for exact character positions (hard to get right), "sentence" for whole sentence by index (easier), or "section" for entire field'),
  sentenceIndex: z.number().nullable().describe('For highlightType="sentence": which sentence to highlight (0-based index). Set to null for other types.'),
  startOffset: z.number().nullable().describe('For highlightType="chunk": exact character offset where highlighting starts. Set to null for sentence/section types.'),
  endOffset: z.number().nullable().describe('For highlightType="chunk": exact character offset where highlighting ends. Set to null for sentence/section types.'),
});

export const commentResponseSchema = z.object({
  comments: z.array(commentItemSchema).describe('Array of comments for improving the CV'),
  summary: z.string().nullable().describe('Overall summary of the CV review (can be null)'),
});

export type CommentItem = z.infer<typeof commentItemSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
