import React from 'react';
import { cn } from '@ui/lib/utils';
import { match } from 'ts-pattern';
import type { GetCvQuery } from '../../../../generated/graphql';
import type { SuggestionBlock } from '../../../../contexts';
import { EmptyState } from './EmptyState';
import { SuggestionsList } from './SuggestionsList';

interface PanelContentProps {
  isExpanded: boolean;
  suggestionBlocks: SuggestionBlock[];
  cvData: GetCvQuery | undefined;
  activeSuggestionId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  registerSuggestionRef: (
    suggestionId: string,
    element: HTMLDivElement | null
  ) => void;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
}

export const PanelContent: React.FC<PanelContentProps> = ({
  isExpanded,
  suggestionBlocks,
  cvData,
  activeSuggestionId,
  scrollContainerRef,
  registerSuggestionRef,
  onAccept,
  onReject,
}) => {
  if (!isExpanded) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex-1 overflow-hidden p-4 bg-white min-h-0 flex flex-col',
        'animate-in fade-in-0 slide-in-from-top-2 duration-300'
      )}
    >
      {match(suggestionBlocks.length)
        .with(0, () => <EmptyState />)
        .otherwise(() => (
          <SuggestionsList
            suggestionBlocks={suggestionBlocks}
            cvData={cvData}
            activeSuggestionId={activeSuggestionId}
            scrollContainerRef={scrollContainerRef}
            registerSuggestionRef={registerSuggestionRef}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
    </div>
  );
};
