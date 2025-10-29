import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthorSection = styled(Box)({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginBottom: '4px',
});

const AuthorName = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  color: '#111827',
});

const Timestamp = styled(Typography)({
  fontSize: '13px',
  color: '#9ca3af',
  fontWeight: 400,
});

interface CardMetadataProps {
  authorName?: string | null;
  createdAt?: Date;
}

/**
 * Formats timestamp as relative time
 */
function formatTimestamp(date?: Date): string {
  if (!date) return 'Just now';

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const minutesAgo = Math.floor((date.getTime() - Date.now()) / (1000 * 60));

  return formatter.format(minutesAgo, 'minute');
}

export const CardMetadata: React.FC<CardMetadataProps> = ({
  authorName,
  createdAt,
}) => {
  return (
    <AuthorSection>
      <AuthorName>{authorName ?? 'AI Assistant'}</AuthorName>
      <Timestamp>· {formatTimestamp(createdAt)}</Timestamp>
    </AuthorSection>
  );
};
