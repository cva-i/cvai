import { useState, useCallback, useMemo } from 'react';
import { match } from 'ts-pattern';
import type { SuggestionBlock } from '../../../../contexts';

export type FilterType = 'open' | 'resolved';

/**
 * Filters suggestion blocks based on active filter
 */
function filterSuggestionBlocks(
  blocks: SuggestionBlock[],
  filter: FilterType
): SuggestionBlock[] {
  return blocks
    .map((block) => ({
      ...block,
      suggestions: block.suggestions.filter((s) =>
        match(filter)
          .with('open', () => s.status === 'open')
          .with('resolved', () => s.status === 'resolved')
          .exhaustive()
      ),
    }))
    .filter((block) => block.suggestions.length > 0);
}

export function usePanelState(suggestionBlocks: SuggestionBlock[]) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('open');

  const filteredSuggestionBlocks = useMemo(
    () => filterSuggestionBlocks(suggestionBlocks, activeFilter),
    [suggestionBlocks, activeFilter]
  );

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    isExpanded,
    activeFilter,
    filteredSuggestionBlocks,
    setActiveFilter,
    handleToggleExpanded,
  };
}
