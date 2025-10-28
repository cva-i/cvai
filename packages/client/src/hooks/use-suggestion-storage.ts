import { useCallback, useEffect } from 'react';
import type { SuggestionBlock } from '../contexts/use-suggestions/types';
import {
  loadSuggestionsFromStorage,
  saveSuggestionsToStorage,
} from '../contexts/use-suggestions/utils';

interface UseSuggestionStorageProps {
  suggestionBlocks: SuggestionBlock[];
  setSuggestionBlocks: React.Dispatch<React.SetStateAction<SuggestionBlock[]>>;
}

export const useSuggestionStorage = ({
  suggestionBlocks,
  setSuggestionBlocks,
}: UseSuggestionStorageProps) => {
  // Load suggestions from session storage on mount
  useEffect(() => {
    const storedSuggestions = loadSuggestionsFromStorage();
    if (storedSuggestions.length > 0) {
      setSuggestionBlocks(storedSuggestions);
    }
  }, [setSuggestionBlocks]);

  // Save to session storage whenever suggestions change
  useEffect(() => {
    if (suggestionBlocks.length > 0) {
      saveSuggestionsToStorage(suggestionBlocks);
    }
  }, [suggestionBlocks]);

  const loadDemoSuggestions = useCallback(
    (demoSuggestions: SuggestionBlock[]) => {
      setSuggestionBlocks(demoSuggestions);
      saveSuggestionsToStorage(demoSuggestions);
    },
    [setSuggestionBlocks]
  );

  const clearAllSuggestions = useCallback(() => {
    setSuggestionBlocks([]);
    try {
      sessionStorage.removeItem('cv-suggestions');
    } catch (error) {
      console.error('Failed to clear suggestions from storage:', error);
    }
  }, [setSuggestionBlocks]);

  return { loadDemoSuggestions, clearAllSuggestions };
};
