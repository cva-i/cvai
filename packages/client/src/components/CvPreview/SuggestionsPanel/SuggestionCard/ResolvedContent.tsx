import React, { memo } from 'react';
import { match, P } from 'ts-pattern';
import type { Suggestion } from '../../../../contexts';
import { PreviewLabel, PreviewText } from './styled';

interface ResolvedContentProps {
  suggestion: Suggestion;
}

export const ResolvedContent = memo<ResolvedContentProps>(({ suggestion }) => {
  return match(suggestion)
    .with({ status: 'resolved', suggestedText: P.nullish }, () => (
      <>
        <PreviewLabel>Preview (Resolved)</PreviewLabel>
        <PreviewText>
          This suggestion has been marked as resolved. The text change is being
          previewed.
        </PreviewText>
      </>
    ))
    .otherwise(() => null);
});

ResolvedContent.displayName = 'ResolvedContent';
