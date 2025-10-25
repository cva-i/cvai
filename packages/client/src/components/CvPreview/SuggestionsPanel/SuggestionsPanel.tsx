import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Fade,
  Collapse,
  Button,
} from '@mui/material';
import {
  Lightbulb as SuggestionIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  ClearAll as ClearIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSuggestions } from '../../../contexts/use-suggestions/SuggestionsProvider';
import { SuggestionCard } from './SuggestionCard';
import { useSuggestionScroll } from '../../../hooks/use-suggestion-scroll';

export const SuggestionsPanel: React.FC = () => {
  const {
    suggestionBlocks,
    activeSuggestionId,
    acceptSuggestion,
    rejectSuggestion,
    clearAllSuggestions,
    loadDemoSuggestions,
  } = useSuggestions();

  const [isExpanded, setIsExpanded] = useState(true);

  const { scrollContainerRef, registerSuggestionRef } = useSuggestionScroll({
    activeSuggestionId,
    isExpanded,
  });

  // Calculate total suggestions count
  const totalSuggestions = suggestionBlocks.reduce(
    (total: number, block: any) => total + block.suggestions.length,
    0
  );

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClearAll = () => {
    clearAllSuggestions();
  };

  const handleLoadDemo = () => {
    loadDemoSuggestions();
  };

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        data-suggestion-panel
        sx={{
          position: 'sticky',
          top: 100,
          width: 400,
          maxHeight: 'calc(100vh - 40px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'grey.200',
            backgroundColor: 'white',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ fontSize: '1rem', color: 'text.primary' }}
            >
              Comments
            </Typography>

            <Box display="flex" gap={0.5}>
              <Tooltip title="Load demo suggestions">
                <IconButton
                  size="small"
                  onClick={handleLoadDemo}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                      color: 'text.primary',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Clear all suggestions">
                <IconButton
                  size="small"
                  onClick={handleClearAll}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                      color: 'text.primary',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
                <IconButton
                  size="small"
                  onClick={handleToggleExpanded}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                      color: 'text.primary',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Filter buttons */}
          <Box display="flex" gap={0.5}>
            <Button
              size="small"
              sx={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.375rem',
                backgroundColor: 'primary.main',
                color: 'white',
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              Open
            </Button>
            <Button
              size="small"
              sx={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.375rem',
                backgroundColor: 'unset',
                color: 'text.secondary',
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'grey.200' },
              }}
            >
              Resolved
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Collapse in={isExpanded} timeout={300}>
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              p: 2,
              backgroundColor: 'white',
              maxHeight: 'calc(100vh - 200px)',
              minHeight: 0,
            }}
          >
            {suggestionBlocks.length === 0 ? (
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
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ maxWidth: 200 }}
                >
                  Click the refresh button to load demo suggestions
                </Typography>
              </Box>
            ) : (
              <Box
                ref={scrollContainerRef}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  margin: '0 -1rem',
                  overflow: 'auto',
                  padding: '0 1rem',
                  maxHeight: 'calc(100vh - 250px)',
                  minHeight: 0,
                  overscrollBehavior: 'contain',
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                {suggestionBlocks.map((block: any) => (
                  <Box
                    key={block.id}
                    className="thread"
                    sx={{
                      // borderRadius: '0.5rem',
                      // boxShadow: '0px 0px 0px 1px #e5e7eb inset',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1)',
                      // '&:hover': { boxShadow: '0px 0px 0px 1px #9ca3af inset' },
                      '&.is-open': {
                        boxShadow: '0px 0px 0px 1px #8b5cf6 inset',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      {block.suggestions.map(
                        (suggestion: any, index: number) => (
                          <SuggestionCard
                            key={suggestion.id}
                            suggestion={suggestion}
                            blockId={block.blockId}
                            isActive={activeSuggestionId === suggestion.id}
                            onAccept={() =>
                              acceptSuggestion(block.blockId, suggestion.id)
                            }
                            onReject={() =>
                              rejectSuggestion(block.blockId, suggestion.id)
                            }
                            registerRef={registerSuggestionRef}
                          />
                        )
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Fade>
  );
};
