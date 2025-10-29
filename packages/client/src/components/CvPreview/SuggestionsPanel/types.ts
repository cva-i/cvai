/**
 * Type definitions for the Suggestions Panel
 */

export type FilterType = 'open' | 'resolved';

export interface SuggestionData {
  _id: string;
  blockId?: string | null;
  text: string;
  suggestedText?: string | null;
  highlightType?: string | null;
  sentenceIndex?: number | null;
  startOffset?: number | null;
  endOffset?: number | null;
  status: string;
  authorName?: string | null;
  createdAt?: Date;
}

export interface SuggestionBlock {
  blockId: string;
  suggestions: SuggestionData[];
}

export interface PanelActions {
  clearAllSuggestions: (cvId: string) => Promise<void>;
  generateSuggestions: (cvId: string) => Promise<void>;
  updateSuggestionStatus: (id: string, status: string) => Promise<void>;
  deleteSuggestion: (id: string) => Promise<void>;
}

export interface PanelState {
  isExpanded: boolean;
  activeFilter: FilterType;
  filteredSuggestionBlocks: SuggestionBlock[];
  setActiveFilter: (filter: FilterType) => void;
  handleToggleExpanded: () => void;
}
