import React, { memo } from 'react';
import { match, P } from 'ts-pattern';
import type { Suggestion } from '../../../../contexts';
import { SuggestedChange } from '../components/SuggestionCard/SuggestedChange';
import { ApplyButton } from '../components/SuggestionCard/ApplyButton';

interface SuggestedChangeContentProps {
  suggestion: Suggestion;
  currentText: string | null;
  applyLoading: boolean;
  onApply: (e: React.MouseEvent) => void;
}

export const SuggestedChangeContent = memo<SuggestedChangeContentProps>(
  ({ suggestion, currentText, applyLoading, onApply }) => {
    return match(suggestion)
      .with({ suggestedText: P.string }, ({ suggestedText }) => (
        <>
          <SuggestedChange
            currentText={currentText}
            suggestedText={suggestedText}
          />
          <ApplyButton loading={applyLoading} onClick={onApply} />
        </>
      ))
      .otherwise(() => null);
  }
);

SuggestedChangeContent.displayName = 'SuggestedChangeContent';
