import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
} from 'react';
import type { SuggestionsContextType, SuggestionBlock } from './types';
import {
  useGetSuggestionsForCvLazyQuery,
  useGenerateSuggestionsForCvMutation,
  useUpdateSuggestionStatusMutation,
  useDeleteSuggestionMutation,
  useClearAllSuggestionsForCvMutation,
} from '../../generated/graphql';
import { getSuggestionsForBlock } from './utils';
import { toast } from 'react-toastify';

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
  const [error, setError] = useState<Error | null>(null);

  // GraphQL hooks
  const [getSuggestionsQuery, { loading: isLoadingQuery }] =
    useGetSuggestionsForCvLazyQuery();
  const [generateMutation, { loading: isGenerating }] =
    useGenerateSuggestionsForCvMutation();
  const [updateStatusMutation] = useUpdateSuggestionStatusMutation();
  const [deleteMutation] = useDeleteSuggestionMutation();
  const [clearAllMutation] = useClearAllSuggestionsForCvMutation();

  // Fetch suggestions from backend
  const fetchSuggestions = useCallback(
    async (cvId: string) => {
      try {
        setError(null);
        const { data } = await getSuggestionsQuery({ variables: { cvId } });

        if (data?.getSuggestionsForCv) {
          const blocks: SuggestionBlock[] = data.getSuggestionsForCv.map(
            (block) => ({
              blockId: block.blockId,
              suggestions: block.comments.map((s) => ({
                _id: s._id,
                cvId: s.cvId,
                cvVersionId: s.cvVersionId,
                blockId: s.blockId,
                text: s.text,
                suggestedText: s.suggestedText ?? undefined,
                status: s.status as 'open' | 'resolved' | 'rejected',
                authorName: s.authorName,
                createdAt: s.createdAt ? new Date(s.createdAt) : undefined,
                updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
              })),
            })
          );
          setSuggestionBlocks(blocks);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to fetch suggestions');
        setError(error);
        toast.error(error.message);
        console.error('Failed to fetch suggestions:', err);
      }
    },
    [getSuggestionsQuery]
  );

  // Generate suggestions via AI
  const generateSuggestions = useCallback(
    async (cvId: string) => {
      try {
        setError(null);
        const { data } = await generateMutation({ variables: { cvId } });

        if (data?.generateSuggestionsForCv) {
          const blocks: SuggestionBlock[] = data.generateSuggestionsForCv.map(
            (block) => ({
              blockId: block.blockId,
              suggestions: block.comments.map((s) => ({
                _id: s._id,
                cvId: s.cvId,
                cvVersionId: s.cvVersionId,
                blockId: s.blockId,
                text: s.text,
                suggestedText: s.suggestedText ?? undefined,
                status: s.status as 'open' | 'resolved' | 'rejected',
                authorName: s.authorName,
                createdAt: s.createdAt ? new Date(s.createdAt) : undefined,
                updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
              })),
            })
          );

          setSuggestionBlocks(blocks);
        }
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to generate suggestions');
        setError(error);
        toast.error(error.message);
        console.error('Failed to generate suggestions:', err);
      }
    },
    [generateMutation]
  );

  // Update suggestion status (accept/reject)
  const updateSuggestionStatus = useCallback(
    async (suggestionId: string, status: 'open' | 'resolved' | 'rejected') => {
      try {
        setError(null);
        await updateStatusMutation({
          variables: {
            input: { suggestionId, status },
          },
        });

        // Update local state
        setSuggestionBlocks((prev) =>
          prev.map((block) => ({
            ...block,
            suggestions: block.suggestions.map((s) =>
              s._id === suggestionId ? { ...s, status } : s
            ),
          }))
        );
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to update suggestion');
        setError(error);
        toast.error(error.message);
        console.error('Failed to update suggestion status:', err);
      }
    },
    [updateStatusMutation]
  );

  // Delete a single suggestion
  const deleteSuggestion = useCallback(
    async (suggestionId: string) => {
      try {
        setError(null);
        await deleteMutation({ variables: { suggestionId } });

        // Update local state
        setSuggestionBlocks((prev) =>
          prev
            .map((block) => ({
              ...block,
              suggestions: block.suggestions.filter(
                (s) => s._id !== suggestionId
              ),
            }))
            .filter((block) => block.suggestions.length > 0)
        );
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to delete suggestion');
        setError(error);
        toast.error(error.message);
        console.error('Failed to delete suggestion:', err);
      }
    },
    [deleteMutation]
  );

  // Clear all suggestions for a CV
  const clearAllSuggestions = useCallback(
    async (cvId: string) => {
      try {
        setError(null);
        await clearAllMutation({ variables: { cvId } });
        setSuggestionBlocks([]);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to clear suggestions');
        setError(error);
        toast.error(error.message);
        console.error('Failed to clear suggestions:', err);
      }
    },
    [clearAllMutation]
  );

  const clearActiveSuggestion = useCallback(() => {
    setActiveSuggestionId(null);
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
      isLoading: isLoadingQuery,
      isGenerating,
      error,

      // Actions
      fetchSuggestions,
      generateSuggestions,
      updateSuggestionStatus,
      deleteSuggestion,
      clearAllSuggestions,

      // UI State
      setActiveSuggestionId,
      setHoveredBlockId,
      clearActiveSuggestion,

      // Helpers
      getSuggestionsForBlock: getSuggestionsForBlockMemo,
    }),
    [
      suggestionBlocks,
      activeSuggestionId,
      hoveredBlockId,
      isLoadingQuery,
      isGenerating,
      error,
      fetchSuggestions,
      generateSuggestions,
      updateSuggestionStatus,
      deleteSuggestion,
      clearAllSuggestions,
      clearActiveSuggestion,
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
