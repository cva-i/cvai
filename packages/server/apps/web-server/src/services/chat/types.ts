import { z } from 'zod';

// For update_field action
const updateFieldPayloadSchema = z.object({
  actionType: z.literal('update_field'),
  fieldPath: z.string().describe('For top-level fields: "title", "name", or "aboutMe". For entry fields: use the entry type like "workExperienceEntries", "educationEntries", "projectEntries", "skillEntries", "contactInfoEntries"'),
  entryId: z.string().optional().describe('Required when updating an entry field. The _id of the specific entry to update'),
  fieldName: z.string().optional().describe('Required when updating an entry field. The field within the entry to update, e.g. "duration", "position", "description", "name", "skills", "location"'),
  value: z.string().describe('The new value as a string'),
});

// For add_entry action
const addEntryPayloadSchema = z.object({
  actionType: z.literal('add_entry'),
  entryFieldName: z.enum(['workExperienceEntries', 'educationEntries', 'projectEntries', 'skillEntries', 'contactInfoEntries']),
  name: z.string().optional().describe('Name/title of the entry'),
  position: z.string().optional().describe('Position/role (for work experience)'),
  degree: z.string().optional().describe('Degree (for education)'),
  duration: z.string().optional().describe('Duration/dates'),
  location: z.string().optional().describe('Location'),
  description: z.string().optional().describe('Description text'),
  skills: z.array(z.string()).optional().describe('Skills array'),
  category: z.string().optional().describe('Category (for skills)'),
  linkName: z.string().optional().describe('Link name (for contact)'),
  link: z.string().optional().describe('Link URL (for contact)'),
});

// For delete_entry action
const deleteEntryPayloadSchema = z.object({
  actionType: z.literal('delete_entry'),
  entryFieldName: z.enum(['workExperienceEntries', 'educationEntries', 'projectEntries', 'skillEntries', 'contactInfoEntries']),
  entryId: z.string().describe('The _id of the entry to delete'),
  entryName: z.string().optional().describe('Name of entry being deleted for confirmation'),
});

// For reorder_entries action - supports multiple entry types at once
const reorderEntriesPayloadSchema = z.object({
  actionType: z.literal('reorder_entries'),
  reorders: z.array(z.object({
    entryFieldName: z.enum(['workExperienceEntries', 'educationEntries', 'projectEntries', 'skillEntries', 'contactInfoEntries']),
    entryIds: z.array(z.string()).describe('Array of entry _ids in the new desired order'),
  })).describe('Array of reorder operations, each specifying an entry type and the new order of its entries'),
});

// For clarifying_question action
const clarifyingQuestionPayloadSchema = z.object({
  actionType: z.literal('clarifying_question'),
  question: z.string().describe('The clarifying question to ask'),
});

const payloadSchema = z.discriminatedUnion('actionType', [
  updateFieldPayloadSchema,
  addEntryPayloadSchema,
  deleteEntryPayloadSchema,
  reorderEntriesPayloadSchema,
  clarifyingQuestionPayloadSchema,
]);

export const proposedActionSchema = z.object({
  type: z.enum([
    'update_field',
    'add_entry',
    'delete_entry',
    'reorder_entries',
    'clarifying_question',
  ]),
  description: z
    .string()
    .describe('A clear description of what this action will do'),
  payload: payloadSchema,
});

export const chatResponseSchema = z.object({
  message: z
    .string()
    .describe('The conversational response message to the user'),
  proposedActions: z
    .array(proposedActionSchema)
    .describe(
      'Array of proposed actions the user can accept or reject. Empty if just responding conversationally.'
    ),
});

export type ProposedActionResponse = z.infer<typeof proposedActionSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;

// Inferred payload types from Zod schemas
export type UpdateFieldPayload = z.infer<typeof updateFieldPayloadSchema>;
export type AddEntryPayload = z.infer<typeof addEntryPayloadSchema>;
export type DeleteEntryPayload = z.infer<typeof deleteEntryPayloadSchema>;
export type ReorderEntriesPayload = z.infer<typeof reorderEntriesPayloadSchema>;
export type ClarifyingQuestionPayload = z.infer<typeof clarifyingQuestionPayloadSchema>;
