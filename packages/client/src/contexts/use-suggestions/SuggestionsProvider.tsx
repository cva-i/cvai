import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { SuggestionsContextType, SuggestionBlock, Suggestion } from './types';
import { DEMO_SUGGESTIONS } from './demo-data';
import {
  generateSuggestionId,
  generateBlockId,
  loadSuggestionsFromStorage,
  saveSuggestionsToStorage,
  getSuggestionsForBlock,
} from './utils';

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(
  undefined
);

export const SuggestionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [suggestionBlocks, setSuggestionBlocks] = useState<SuggestionBlock[]>(
    []
  );
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(
    null
  );
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // Load suggestions from session storage on mount
  useEffect(() => {
    const storedSuggestions = loadSuggestionsFromStorage();
    if (storedSuggestions.length > 0) {
      setSuggestionBlocks(storedSuggestions);
    } else {
      // Initialize with demo data if no stored data
      setSuggestionBlocks(DEMO_SUGGESTIONS);
      saveSuggestionsToStorage(DEMO_SUGGESTIONS);
    }
  }, []);

  // Save to session storage whenever suggestions change
  useEffect(() => {
    if (suggestionBlocks.length > 0) {
      saveSuggestionsToStorage(suggestionBlocks);
    }
  }, [suggestionBlocks]);

  const addSuggestion = useCallback(
    (blockId: string, suggestion: Omit<Suggestion, 'id'>) => {
      const newSuggestion: Suggestion = {
        ...suggestion,
        id: generateSuggestionId(),
        createdAt: suggestion.createdAt || new Date(),
        status: suggestion.status || 'open',
      };

      setSuggestionBlocks((prev) => {
        const existingBlock = prev.find((block) => block.blockId === blockId);
        if (existingBlock) {
          return prev.map((block) =>
            block.blockId === blockId
              ? { ...block, suggestions: [...block.suggestions, newSuggestion] }
              : block
          );
        } else {
          return [
            ...prev,
            { id: generateBlockId(), blockId, suggestions: [newSuggestion] },
          ];
        }
      });
    },
    []
  );

  const removeSuggestion = useCallback(
    (blockId: string, suggestionId: string) => {
      setSuggestionBlocks((prev) =>
        prev
          .map((block) =>
            block.blockId === blockId
              ? {
                  ...block,
                  suggestions: block.suggestions.filter(
                    (s) => s.id !== suggestionId
                  ),
                }
              : block
          )
          .filter((block) => block.suggestions.length > 0)
      );
    },
    []
  );

  const acceptSuggestion = useCallback(
    (blockId: string, suggestionId: string) => {
      // In a real implementation, this would trigger the actual text update
      // For now, we'll just remove the suggestion
      removeSuggestion(blockId, suggestionId);
    },
    [removeSuggestion]
  );

  const rejectSuggestion = useCallback(
    (blockId: string, suggestionId: string) => {
      removeSuggestion(blockId, suggestionId);
    },
    [removeSuggestion]
  );

  const clearActiveSuggestion = useCallback(() => {
    setActiveSuggestionId(null);
  }, []);

  const clearAllSuggestions = useCallback(() => {
    setSuggestionBlocks([]);
    try {
      sessionStorage.removeItem('cv-suggestions');
    } catch (error) {
      console.error('Failed to clear suggestions from storage:', error);
    }
  }, []);

  const loadDemoSuggestions = useCallback(() => {
    setSuggestionBlocks(DEMO_SUGGESTIONS);
    saveSuggestionsToStorage(DEMO_SUGGESTIONS);
  }, []);

  // Memoized function to get suggestions for a specific block
  const getSuggestionsForBlockMemo = useCallback(
    (blockId: string) => getSuggestionsForBlock(suggestionBlocks, blockId),
    [suggestionBlocks]
  );

  const value: SuggestionsContextType = useMemo(
    () => ({
      suggestionBlocks,
      activeSuggestionId,
      hoveredBlockId,
      addSuggestion,
      removeSuggestion,
      acceptSuggestion,
      rejectSuggestion,
      setActiveSuggestionId,
      setHoveredBlockId,
      clearActiveSuggestion,
      clearAllSuggestions,
      loadDemoSuggestions,
      getSuggestionsForBlock: getSuggestionsForBlockMemo,
    }),
    [
      suggestionBlocks,
      activeSuggestionId,
      hoveredBlockId,
      addSuggestion,
      removeSuggestion,
      acceptSuggestion,
      rejectSuggestion,
      clearActiveSuggestion,
      clearAllSuggestions,
      loadDemoSuggestions,
      getSuggestionsForBlockMemo,
    ]
  );

  return (
    <SuggestionsContext.Provider value={value}>
      {children}
    </SuggestionsContext.Provider>
  );
};

export const useSuggestions = () => {
  const context = useContext(SuggestionsContext);
  if (context === undefined) {
    throw new Error('useSuggestions must be used within a SuggestionsProvider');
  }
  return context;
};
