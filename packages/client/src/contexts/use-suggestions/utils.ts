import type { Suggestion, SuggestionBlock } from './types';

const STORAGE_KEY = 'cv-suggestions';

/**
 * Generates a unique ID for suggestions using crypto.randomUUID()
 * Falls back to timestamp + random string if crypto is not available
 */
export const generateSuggestionId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates a unique ID for suggestion blocks
 */
export const generateBlockId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safely loads suggestions from sessionStorage
 */
export const loadSuggestionsFromStorage = (): SuggestionBlock[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((block: SuggestionBlock) => ({
        ...block,
        suggestions: block.suggestions.map((suggestion: Suggestion) => ({
          ...suggestion,
          createdAt: suggestion.createdAt
            ? new Date(suggestion.createdAt)
            : undefined,
          updatedAt: suggestion.updatedAt
            ? new Date(suggestion.updatedAt)
            : undefined,
        })),
      }));
    }
  } catch (error) {
    console.error('Failed to parse stored suggestions:', error);
  }
  return [];
};

/**
 * Safely saves suggestions to sessionStorage
 */
export const saveSuggestionsToStorage = (
  suggestions: SuggestionBlock[]
): void => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
  } catch (error) {
    console.error('Failed to save suggestions to storage:', error);
  }
};

/**
 * Gets suggestions for a specific block ID
 */
export const getSuggestionsForBlock = (
  suggestionBlocks: SuggestionBlock[],
  blockId: string
): Suggestion[] => {
  const block = suggestionBlocks.find((block) => block.blockId === blockId);
  return block?.suggestions || [];
};

/**
 * Checks if a block has suggestions
 */
export const hasSuggestions = (
  suggestionBlocks: SuggestionBlock[],
  blockId: string
): boolean => {
  return getSuggestionsForBlock(suggestionBlocks, blockId).length > 0;
};

/**
 * Checks if a block has offset-based suggestions
 */
export const hasOffsetSuggestions = (
  suggestionBlocks: SuggestionBlock[],
  blockId: string
): boolean => {
  const suggestions = getSuggestionsForBlock(suggestionBlocks, blockId);
  return suggestions.some(
    (s) => s.startOffset !== undefined && s.endOffset !== undefined
  );
};
