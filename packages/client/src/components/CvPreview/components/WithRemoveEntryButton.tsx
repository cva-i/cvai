import React, { useState, useMemo } from 'react';
import type { BoxProps } from '@mui/material';
import { Box, Backdrop, IconButton } from '@mui/material';
import { usePreviewMode, EntryEditContext } from '../../../contexts';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
  const { isPreviewing } = usePreviewMode();
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const contextValue = useMemo(
    () => ({ isEntryActive: showMenu }),
    [showMenu]
  );

  if (isPreviewing) {
    return <Box>{children}</Box>;
  }

  return (
    <EntryEditContext.Provider value={contextValue}>
      <Backdrop
        open={showMenu}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: (theme) => theme.zIndex.modal,
        }}
        onClick={() => setShowMenu(false)}
      />
      <Box
        display={'flex'}
        justifyContent={'start'}
        flexDirection={flexDirection}
        height={height}
        alignItems={'flex-start'}
        position="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
            return;
          }
          if (isHovered && !showMenu) {
            setShowMenu(true);
          }
        }}
        sx={{
          border: isHovered ? '2px solid' : '2px solid transparent',
          borderColor: isHovered ? 'primary.main' : 'transparent',
          borderRadius: (theme) => theme.shape.borderRadius,
          transition: 'border-color 0.2s',
          zIndex: showMenu ? (theme) => theme.zIndex.modal + 1 : 'auto',
          backgroundColor: showMenu ? 'background.paper' : 'transparent',
          padding: 1,
          cursor: isHovered && !showMenu ? 'pointer' : 'default',
        }}
        {...props}
      >
        {showMenu && (
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
                  onAddEntry?.({ positionIndex: currentEntry.positionIndex + 1 });
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
        )}
        {children}
      </Box>
    </EntryEditContext.Provider>
  );
};
