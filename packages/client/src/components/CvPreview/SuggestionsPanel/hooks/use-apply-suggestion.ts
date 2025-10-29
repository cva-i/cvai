import { useCallback } from 'react';
import type { GetCvQuery } from '../../../../generated/graphql';
import {
  useUpdateCvMutation,
  useUpdateSuggestionStatusMutation,
} from '../../../../generated/graphql';
import { buildUpdateInputForSuggestion } from '../utils';

interface ApplySuggestionParams {
  cvData: GetCvQuery | undefined;
  suggestion: {
    _id: string;
    blockId?: string | null;
    suggestedText?: string | null;
  };
}

export function useApplySuggestion() {
  const [updateCvMutation, { loading: updateLoading }] = useUpdateCvMutation();
  const [updateSuggestionStatus] = useUpdateSuggestionStatusMutation();

  const applySuggestion = useCallback(
    async ({ cvData, suggestion }: ApplySuggestionParams) => {
      if (!cvData?.getCv) {
        console.error('No CV data available');
        return false;
      }

      const updateInput = buildUpdateInputForSuggestion(cvData, {
        blockId: suggestion.blockId || '',
        suggestedText: suggestion.suggestedText || '',
      });

      if (!updateInput) {
        console.error('Failed to build update input', {
          blockId: suggestion.blockId,
          cvData: cvData.getCv,
          suggestion,
        });
        return false;
      }

      console.log('Update input:', updateInput);

      try {
        await updateCvMutation({
          variables: {
            cvId: cvData.getCv._id,
            data: updateInput,
          },
        });

        await updateSuggestionStatus({
          variables: {
            input: {
              suggestionId: suggestion._id,
              status: 'resolved',
            },
          },
        });

        return true;
      } catch (error) {
        console.error('Failed to apply suggestion:', error);
        return false;
      }
    },
    [updateCvMutation, updateSuggestionStatus]
  );

  return {
    applySuggestion,
    loading: updateLoading,
  };
}
