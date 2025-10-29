import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DiffView } from '../../DiffView';

const PreviewLabel = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7280',
  marginTop: '12px',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

interface SuggestedChangeProps {
  currentText: string | null;
  suggestedText: string;
}

export const SuggestedChange: React.FC<SuggestedChangeProps> = ({
  currentText,
  suggestedText,
}) => {
  return (
    <>
      <PreviewLabel>Suggested Change</PreviewLabel>
      <DiffView
        oldText={currentText || 'Current text (not found)'}
        newText={suggestedText}
      />
    </>
  );
};
