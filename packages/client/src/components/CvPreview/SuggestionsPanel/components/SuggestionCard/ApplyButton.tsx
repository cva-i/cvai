import React from 'react';
import { Box } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  color: 'white',
  backgroundColor: '#8b5cf6',
  transition: 'background-color 0.2s ease-in-out',
  padding: '8px 16px',
  borderRadius: 8,
  marginTop: '8px',
  '&:hover': { backgroundColor: '#7c3aed' },
  '&:disabled': {
    backgroundColor: '#d1d5db',
    cursor: 'not-allowed',
  },
}));

interface ApplyButtonProps {
  loading: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({ loading, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <CheckIcon />
      <span>{loading ? 'Applying...' : 'Apply Change'}</span>
    </StyledButton>
  );
};
