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

type SuggestedChangeProps = {
  currentText: string | null;
  suggestedText: string;
}

export const SuggestedChange = ({
  currentText,
  suggestedText,
}: SuggestedChangeProps) => {
  return (
    <>
      <PreviewLabel>Suggested Change</PreviewLabel>
      <DiffView
        oldText={currentText ?? 'Current text (not found)'}
        newText={suggestedText}
      />
    </>
  );
};
