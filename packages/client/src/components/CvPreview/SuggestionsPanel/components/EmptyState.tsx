import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lightbulb as SuggestionIcon } from '@mui/icons-material';

export const EmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        textAlign: 'center',
      }}
    >
      <SuggestionIcon
        sx={{
          fontSize: 64,
          color: 'text.disabled',
          mb: 3,
          opacity: 0.6,
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 1, fontWeight: 500 }}
      >
        No suggestions available
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 200 }}>
        Click the refresh button to load demo suggestions
      </Typography>
    </Box>
  );
};
