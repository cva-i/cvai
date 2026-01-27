import type { FC } from 'react';
import { cn } from '@ui/lib/utils';
import type { GetCvQuery } from '../../../../generated/graphql';
import type { Suggestion } from '../../../../contexts/use-suggestions/types';
import { SuggestionCard } from '../SuggestionCard';

interface SuggestionBlockProps {
  blockId: string;
  suggestions: Suggestion[];
  cvData: GetCvQuery | undefined;
  activeSuggestionId: string | null;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  registerRef?: (suggestionId: string, element: HTMLDivElement | null) => void;
}

export const SuggestionBlock: FC<SuggestionBlockProps> = ({
  blockId,
  suggestions,
  cvData,
  activeSuggestionId,
  onAccept,
  onReject,
  registerRef,
}) => {
  return (
    <div
      className={cn(
        'thread flex flex-col',
        'transition-all duration-200 ease-[cubic-bezier(0.65,0.05,0.36,1)]',
        '[&.is-open]:shadow-[inset_0_0_0_1px_#8b5cf6]'
      )}
    >
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion._id}
            suggestion={suggestion}
            blockId={blockId}
            cvData={cvData}
            isActive={activeSuggestionId === suggestion._id}
            onAccept={() => onAccept(suggestion._id)}
            onReject={() => onReject(suggestion._id)}
            registerRef={registerRef}
          />
        ))}
      </div>
    </div>
  );
};
