import { z } from 'zod';

export const commentItemSchema = z.object({
  blockId: z.string().describe('The ID of the EditableTypography component this comment applies to'),
  text: z.string().describe('The comment text explaining what should be improved'),
  suggestedText: z.string().nullable().describe('Optional suggested replacement text (if provided, will show as a diff with apply button). Set to null if not providing a replacement.'),
  startOffset: z.number().nullable().describe('Character offset where the comment applies (null for whole-block comments)'),
  endOffset: z.number().nullable().describe('Character offset where the comment ends (null for whole-block comments)'),
});

export const commentResponseSchema = z.object({
  comments: z.array(commentItemSchema).describe('Array of comments for improving the CV'),
  summary: z.string().nullable().describe('Overall summary of the CV review (can be null)'),
});

export type CommentItem = z.infer<typeof commentItemSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
