import type { FC, RefObject } from 'react';
import { cn } from '@ui/lib/utils';
import type { GetCvQuery } from '../../../../generated/graphql';
import type { SuggestionBlock as SuggestionBlockType } from '../../../../contexts/use-suggestions/types';
import { SuggestionBlock } from './SuggestionBlock';

interface SuggestionsListProps {
  suggestionBlocks: SuggestionBlockType[];
  cvData: GetCvQuery | undefined;
  activeSuggestionId: string | null;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  registerSuggestionRef: (
    suggestionId: string,
    element: HTMLDivElement | null
  ) => void;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
}

export const SuggestionsList: FC<SuggestionsListProps> = ({
  suggestionBlocks,
  cvData,
  activeSuggestionId,
  scrollContainerRef,
  registerSuggestionRef,
  onAccept,
  onReject,
}) => {
  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        'flex flex-col gap-0.5',
        '-mx-4 overflow-auto px-4',
        'flex-1 min-h-0',
        'overscroll-contain',
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/20 hover:scrollbar-thumb-black/30'
      )}
    >
      {suggestionBlocks.map((block) => (
        <SuggestionBlock
          key={block.blockId}
          blockId={block.blockId}
          suggestions={block.suggestions}
          cvData={cvData}
          activeSuggestionId={activeSuggestionId}
          onAccept={onAccept}
          onReject={onReject}
          registerRef={registerSuggestionRef}
        />
      ))}
    </div>
  );
};
