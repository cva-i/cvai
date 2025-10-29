import { useCallback } from 'react';

interface UsePanelActionsParams {
  cvId: string;
  isGenerating: boolean;
  clearAllSuggestions: (cvId: string) => Promise<void>;
  generateSuggestions: (cvId: string) => Promise<void>;
  updateSuggestionStatus: (id: string, status: 'open' | 'resolved' | 'rejected') => Promise<void>;
  deleteSuggestion: (id: string) => Promise<void>;
}

export function usePanelActions({
  cvId,
  isGenerating,
  clearAllSuggestions,
  generateSuggestions,
  updateSuggestionStatus,
  deleteSuggestion,
}: UsePanelActionsParams) {
  const handleClearAll = useCallback(async () => {
    if (!cvId) return;
    await clearAllSuggestions(cvId);
  }, [cvId, clearAllSuggestions]);

  const handleGenerate = useCallback(async () => {
    if (!cvId || isGenerating) return;
    await generateSuggestions(cvId);
  }, [cvId, isGenerating, generateSuggestions]);

  const handleAcceptSuggestion = useCallback(
    async (suggestionId: string) => {
      await updateSuggestionStatus(suggestionId, 'resolved');
    },
    [updateSuggestionStatus]
  );

  const handleRejectSuggestion = useCallback(
    async (suggestionId: string) => {
      await deleteSuggestion(suggestionId);
    },
    [deleteSuggestion]
  );

  return {
    handleClearAll,
    handleGenerate,
    handleAcceptSuggestion,
    handleRejectSuggestion,
  };
}
