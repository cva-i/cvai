import React from 'react';
import { Box, Collapse } from '@mui/material';
import { match } from 'ts-pattern';
import type { GetCvQuery } from '../../../../generated/graphql';
import { EmptyState } from './EmptyState';
import { SuggestionsList } from './SuggestionsList';

interface PanelContentProps {
  isExpanded: boolean;
  suggestionBlocks: Array<{
    blockId: string;
    suggestions: any[];
  }>;
  cvData: GetCvQuery | undefined;
  activeSuggestionId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  registerSuggestionRef: (suggestionId: string, element: HTMLDivElement | null) => void;
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
  return (
    <Collapse in={isExpanded} timeout={300}>
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          p: 2,
          backgroundColor: 'white',
          minHeight: 0,
        }}
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
      </Box>
    </Collapse>
  );
};
