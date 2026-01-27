import { memo } from 'react';
import { match, P } from 'ts-pattern';
import type { Suggestion } from '../../../../contexts';
import { previewLabelClasses, previewTextClasses } from './styled';

interface ResolvedContentProps {
  suggestion: Suggestion;
}

export const ResolvedContent = memo<ResolvedContentProps>(({ suggestion }) => {
  return match(suggestion)
    .with({ status: 'resolved', suggestedText: P.nullish }, () => (
      <>
        <span className={previewLabelClasses}>Preview (Resolved)</span>
        <p className={previewTextClasses}>
          This suggestion has been marked as resolved. The text change is being
          previewed.
        </p>
      </>
    ))
    .otherwise(() => null);
});

ResolvedContent.displayName = 'ResolvedContent';
