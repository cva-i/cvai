import React from 'react';
import { Box } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeaderActions = styled(Box)({
  display: 'flex',
  gap: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb',
});

const ActionButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  color: '#6b7280',
  transition: 'color 0.2s ease-in-out',
  padding: 6,
  borderRadius: 8,
  '&:hover': { color: '#111827', backgroundColor: '#f3f4f6' },
  '& svg': { fontSize: '18px' },
}));

interface CardHeaderProps {
  onResolve: () => void;
  onReject: () => void;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  onResolve,
  onReject,
}) => {
  return (
    <HeaderActions>
      <ActionButton
        onClick={(e) => {
          e.stopPropagation();
          onResolve();
        }}
      >
        <CheckIcon />
        <span>Resolve</span>
      </ActionButton>
      <ActionButton
        onClick={(e) => {
          e.stopPropagation();
          onReject();
        }}
      >
        <CloseIcon />
        <span>Reject</span>
      </ActionButton>
    </HeaderActions>
  );
};
