import { useMemo } from 'react';
import type { SuggestionBlock } from '../contexts';
import { getSuggestionsForBlock, hasSuggestions } from '../contexts';

interface UseSuggestionHighlightProps {
  suggestionBlocks: SuggestionBlock[];
  blockId: string;
  activeSuggestionId: string | null;
  hoveredBlockId: string | null;
}

export const useSuggestionHighlight = ({
  suggestionBlocks,
  blockId,
  activeSuggestionId,
  hoveredBlockId,
}: UseSuggestionHighlightProps) => {
  const blockSuggestions = useMemo(
    () => getSuggestionsForBlock(suggestionBlocks, blockId),
    [suggestionBlocks, blockId]
  );

  const hasBlockSuggestions = useMemo(
    () => hasSuggestions(suggestionBlocks, blockId),
    [suggestionBlocks, blockId]
  );

  const isHighlighted = hoveredBlockId === blockId;

  const isActive = useMemo(() => {
    return (
      activeSuggestionId &&
      blockSuggestions.some((s) => s._id === activeSuggestionId)
    );
  }, [activeSuggestionId, blockSuggestions]);

  return {
    blockSuggestions,
    hasBlockSuggestions,
    isHighlighted,
    isActive,
  };
};
