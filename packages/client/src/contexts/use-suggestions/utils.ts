import type { Suggestion, SuggestionBlock } from './types';

export const getSuggestionsForBlock = (
  suggestionBlocks: SuggestionBlock[],
  blockId: string
): Suggestion[] => {
  const block = suggestionBlocks.find((block) => block.blockId === blockId);
  return block?.suggestions || [];
};

export const hasSuggestions = (
  suggestionBlocks: SuggestionBlock[],
  blockId: string
): boolean => {
  return getSuggestionsForBlock(suggestionBlocks, blockId).length > 0;
};
