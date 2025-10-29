export interface Suggestion {
  _id: string;
  cvId?: string;
  cvVersionId?: string;
  blockId: string;
  text: string;
  startOffset?: number;
  endOffset?: number;
  createdAt?: Date;
  updatedAt?: Date;
  authorName?: string;
  status: 'open' | 'resolved' | 'rejected';
}

export interface SuggestionBlock {
  blockId: string; // Field ID from metadata
  suggestions: Suggestion[];
}

export interface SuggestionsContextType {
  suggestionBlocks: SuggestionBlock[];
  activeSuggestionId: string | null;
  hoveredBlockId: string | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: Error | null;

  // Actions
  fetchSuggestions: (cvId: string) => Promise<void>;
  generateSuggestions: (cvId: string) => Promise<void>;
  updateSuggestionStatus: (suggestionId: string, status: 'open' | 'resolved' | 'rejected') => Promise<void>;
  deleteSuggestion: (suggestionId: string) => Promise<void>;
  clearAllSuggestions: (cvId: string) => Promise<void>;

  // UI State
  setActiveSuggestionId: (id: string | null) => void;
  setHoveredBlockId: (blockId: string | null) => void;
  clearActiveSuggestion: () => void;

  // Helpers
  getSuggestionsForBlock: (blockId: string) => Suggestion[];
}
