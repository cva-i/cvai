import React from 'react';
import { Box } from '@mui/material';
import type { GetCvQuery } from '../../../../generated/graphql';
import { SuggestionBlock } from './SuggestionBlock';

interface SuggestionsListProps {
  suggestionBlocks: Array<{
    blockId: string;
    suggestions: any[];
  }>;
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

const scrollbarStyles = {
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestionBlocks,
  cvData,
  activeSuggestionId,
  scrollContainerRef,
  registerSuggestionRef,
  onAccept,
  onReject,
}) => {
  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        margin: '0 -1rem',
        overflow: 'auto',
        padding: '0 1rem',
        flex: '1 1 auto',
        minHeight: 0,
        overscrollBehavior: 'contain',
        ...scrollbarStyles,
      }}
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
    </Box>
  );
};
