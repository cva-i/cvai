export type ProposedActionType =
  | 'update_field'
  | 'add_entry'
  | 'delete_entry'
  | 'reorder_entries'
  | 'clarifying_question';

export type ProposedActionStatus = 'pending' | 'accepted' | 'rejected';

export type ChatMessageRole = 'user' | 'assistant';

export interface ProposedAction {
  _id: string;
  type: ProposedActionType;
  description: string;
  payload: Record<string, unknown>;
  status: ProposedActionStatus;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  cvId: string;
  userId: string;
  role: ChatMessageRole;
  content: string;
  proposedActions: ProposedAction[];
  cvVersionIdAtCreation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  messages: ChatMessage[];
  conversationId: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: Error | null;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  acceptAction: (messageId: string, actionId: string) => Promise<void>;
  rejectAction: (messageId: string, actionId: string) => Promise<void>;
  clearConversation: () => Promise<void>;
  fetchMessages: (cvId: string) => Promise<void>;

  // UI State
  setError: (error: Error | null) => void;
}
