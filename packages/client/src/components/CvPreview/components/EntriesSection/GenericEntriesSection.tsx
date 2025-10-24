import React from 'react';
import type { BoxProps, TypographyProps } from '@mui/material';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddEntryButton } from '../../CvVisualizer/CvFields/WorkExperience/AddEntryButton';
import type { CvEntryItem } from '../../CvVisualizer/types';
import { usePreviewMode } from '../../../../contexts';

type GenericEntriesSectionProps<TEntry extends CvEntryItem> = {
  title?: string;
  loading: boolean;
  entries: TEntry[];
  noEntriesText: string;
  renderEntry: (entry: TEntry, index: number) => React.ReactNode;
  onAdd?: () => void;
  titleStyles?: TypographyProps['sx'];
  flexDirection?: 'row' | 'column';
  sx?: BoxProps['sx'];
};

export function GenericEntriesSection<TEntry extends CvEntryItem>({
  title,
  loading,
  entries,
  noEntriesText,
  renderEntry,
  onAdd,
  titleStyles,
  flexDirection = 'column',
  sx,
}: GenericEntriesSectionProps<TEntry>) {
  const { isPreviewing } = usePreviewMode();

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={sx}>
      {title && (
        <Typography variant="h4" gutterBottom sx={titleStyles}>
          {title}
        </Typography>
      )}

      <Box display="flex" flexDirection={flexDirection} flexWrap="wrap">
        {entries.map((entry, index) => renderEntry(entry, index))}
        {!entries.length && (
          <Box display="flex" alignItems="center" gap={1} width="100%">
            <Typography color="text.secondary">{noEntriesText}</Typography>
            {!isPreviewing && onAdd && (
              <IconButton
                onClick={onAdd}
                size="small"
                sx={(theme) => ({
                  color: theme.palette.primary.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                })}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
        {!title && onAdd && entries.length > 0 && (
          <AddEntryButton
            onAddEntry={async () => onAdd()}
            sx={{ alignSelf: 'center' }}
          />
        )}
      </Box>
    </Box>
  );
}
