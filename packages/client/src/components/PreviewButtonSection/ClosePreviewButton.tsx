import { useCallback, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePreviewMode } from '../../contexts';

export function ClosePreviewButton() {
  const { isPreviewing, togglePreviewMode } = usePreviewMode();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(function handleBeforePrint() {
    const beforePrintHandler = () => {
      setIsHidden(true);
      setTimeout(() => {
        setIsHidden(false);
      }, 2000);
    };

    window.addEventListener('beforeprint', beforePrintHandler);

    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
    };
  }, []);

  const handleKeyDown = useCallback(
    function handleMetaPPress(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        setIsHidden(true);
        setTimeout(() => {
          setIsHidden(false);
        }, 2000);
      }
    },
    [setIsHidden]
  );

  useEffect(
    function addKeyboardListener() {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [handleKeyDown]
  );

  if (!isPreviewing || isHidden) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 10000,
      }}
    >
      <IconButton
        onClick={togglePreviewMode}
        title="Exit preview mode (ESC)"
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'background.paper',
            boxShadow: 6,
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
