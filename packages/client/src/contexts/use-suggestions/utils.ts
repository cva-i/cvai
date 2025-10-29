import type { Suggestion, SuggestionBlock } from './types';

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
 * Checks if a block has offset-based suggestions (only open status)
 */
export const hasOffsetSuggestions = (
  suggestionBlocks: SuggestionBlock[],
  blockId: string
): boolean => {
  const suggestions = getSuggestionsForBlock(suggestionBlocks, blockId);
  return suggestions.some(
    (s) => s.status === 'open' && s.startOffset !== undefined && s.endOffset !== undefined
  );
};
