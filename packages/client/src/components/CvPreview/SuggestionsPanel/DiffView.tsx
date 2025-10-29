import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const DiffContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  borderRadius: '6px',
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
});

const DiffRow = styled(Box)<{ variant: 'old' | 'new' }>(({ variant }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: variant === 'old' ? '#fee' : '#efe',
  fontSize: '14px',
  lineHeight: '1.6',
}));

const DiffMarker = styled(Box)<{ variant: 'old' | 'new' }>(
  ({ variant }) => ({
    fontSize: '14px',
    fontWeight: 600,
    color: variant === 'old' ? '#c00' : '#0a0',
    minWidth: '16px',
    fontFamily: 'monospace',
  })
);

const DiffText = styled(Box)<{ variant: 'old' | 'new' }>(
  ({ variant }) => ({
    fontSize: '14px',
    lineHeight: '1.6',
    color: variant === 'old' ? '#600' : '#060',
    flex: 1,
    wordBreak: 'break-word',
  })
);

interface DiffViewProps {
  oldText: string;
  newText: string;
}

export function DiffView({ oldText, newText }: DiffViewProps) {
  return (
    <DiffContainer>
      <DiffRow variant="old">
        <DiffMarker variant="old">-</DiffMarker>
        <DiffText variant="old">{oldText}</DiffText>
      </DiffRow>
      <DiffRow variant="new">
        <DiffMarker variant="new">+</DiffMarker>
        <DiffText variant="new">{newText}</DiffText>
      </DiffRow>
    </DiffContainer>
  );
}
