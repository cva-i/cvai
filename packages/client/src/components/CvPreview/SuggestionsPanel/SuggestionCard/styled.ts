import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardContainer = styled(Box)<{ isActive?: boolean }>(({ isActive }) => ({
  border: isActive ? '2px solid #8b5cf6' : '2px solid #f3f4f6',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'all 0.2s ease-out',
  '&:hover': isActive ? {} : { borderColor: '#8b5cf630', transition: 'none' },
}));

export const CommentText = styled(Typography)({
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#374151',
  marginBottom: '8px',
});

export const PreviewLabel = styled(Typography)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7280',
  marginTop: '12px',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const PreviewText = styled(Typography)({
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#111827',
  backgroundColor: '#f9fafb',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
  fontStyle: 'italic',
});
