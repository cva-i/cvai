export interface Suggestion {
  id: string;
  text: string;
  startOffset?: number;
  endOffset?: number;
  createdAt?: Date;
  updatedAt?: Date;
  authorId?: string;
  authorName?: string;
  status?: 'open' | 'resolved' | 'rejected';
  replies?: SuggestionReply[];
}

export interface SuggestionReply {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface SuggestionBlock {
  id: string;
  blockId: string; // EditableTypography ID
  suggestions: Suggestion[];
}

export interface SuggestionsContextType {
  suggestionBlocks: SuggestionBlock[];
  activeSuggestionId: string | null;
  hoveredBlockId: string | null;
  addSuggestion: (blockId: string, suggestion: Omit<Suggestion, 'id'>) => void;
  removeSuggestion: (blockId: string, suggestionId: string) => void;
  acceptSuggestion: (blockId: string, suggestionId: string) => void;
  rejectSuggestion: (blockId: string, suggestionId: string) => void;
  setActiveSuggestionId: (id: string | null) => void;
  setHoveredBlockId: (blockId: string | null) => void;
  clearActiveSuggestion: () => void;
  clearAllSuggestions: () => void;
  loadDemoSuggestions: () => void;
  getSuggestionsForBlock: (blockId: string) => Suggestion[];
}
