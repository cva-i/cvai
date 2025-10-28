import { useMemo } from 'react';
import type { SuggestionBlock } from '../contexts/use-suggestions/types';
import {
  getSuggestionsForBlock,
  hasSuggestions,
  hasOffsetSuggestions,
} from '../contexts/use-suggestions/utils';

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

  const hasBlockOffsetSuggestions = useMemo(
    () => hasOffsetSuggestions(suggestionBlocks, blockId),
    [suggestionBlocks, blockId]
  );

  const isHighlighted = hoveredBlockId === blockId;

  const isActive = useMemo(() => {
    return (
      activeSuggestionId &&
      blockSuggestions.some((s) => s.id === activeSuggestionId)
    );
  }, [activeSuggestionId, blockSuggestions]);

  return {
    blockSuggestions,
    hasBlockSuggestions,
    hasBlockOffsetSuggestions,
    isHighlighted,
    isActive,
  };
};
