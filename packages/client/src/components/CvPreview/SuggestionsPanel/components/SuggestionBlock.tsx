import React from 'react';
import { Box } from '@mui/material';
import type { GetCvQuery } from '../../../../generated/graphql';
import { SuggestionCard } from '../SuggestionCard';

interface SuggestionBlockProps {
  blockId: string;
  suggestions: any[];
  cvData: GetCvQuery | undefined;
  activeSuggestionId: string | null;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  registerRef?: (suggestionId: string, element: HTMLDivElement | null) => void;
}

export const SuggestionBlock: React.FC<SuggestionBlockProps> = ({
  blockId,
  suggestions,
  cvData,
  activeSuggestionId,
  onAccept,
  onReject,
  registerRef,
}) => {
  return (
    <Box
      className="thread"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1)',
        '&.is-open': {
          boxShadow: '0px 0px 0px 1px #8b5cf6 inset',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
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
      </Box>
    </Box>
  );
};
