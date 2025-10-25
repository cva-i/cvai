import React from 'react';
import type { BoxProps } from '@mui/material';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { WithEditableSection } from './WithEditableSection';

type WithRemoveEntryButtonProps = React.PropsWithChildren<{
  removeEntry: () => {};
  onAddEntry?: (entryData?: any) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  currentEntry?: { positionIndex: number; [key: string]: any };
}> &
  BoxProps;

export const WithRemoveEntryButton = ({
  children,
  removeEntry,
  onAddEntry,
  onMoveUp,
  onMoveDown,
  currentEntry,
  flexDirection = 'row',
  height,
  ...props
}: WithRemoveEntryButtonProps) => {
  return (
    <WithEditableSection
      flexDirection={flexDirection}
      height={height}
      renderActions={(isActive) =>
        isActive ? (
          <Box
            position="absolute"
            top={-40}
            left="50%"
            sx={{
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: 2,
              padding: 0.5,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                removeEntry();
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
              disabled={!onMoveUp}
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
              disabled={!onMoveDown}
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (currentEntry) {
                  onAddEntry?.({
                    positionIndex: currentEntry.positionIndex + 1,
                  });
                } else {
                  onAddEntry?.();
                }
              }}
              disabled={!onAddEntry}
              color="primary"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : null
      }
      {...props}
    >
      {children}
    </WithEditableSection>
  );
};
