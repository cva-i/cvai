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
import { useSuggestions } from '../../../contexts';
import { SuggestionCard } from './SuggestionCard';
import { useSuggestionScroll } from '../../../hooks/use-suggestion-scroll';
import { useGetCvQuery } from '../../../generated/graphql';

interface SuggestionsPanelProps {
  cvId: string;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ cvId }) => {
  const {
    suggestionBlocks,
    activeSuggestionId,
    isGenerating,
    updateSuggestionStatus,
    deleteSuggestion,
    clearAllSuggestions,
    generateSuggestions,
  } = useSuggestions();

  const { data: cvData } = useGetCvQuery({ variables: { cvId } });

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'open' | 'resolved'>('open');

  const { scrollContainerRef, registerSuggestionRef } = useSuggestionScroll({
    activeSuggestionId,
    isExpanded,
  });

  const filteredSuggestionBlocks = suggestionBlocks
    .map((block) => ({
      ...block,
      suggestions: block.suggestions.filter((s) =>
        activeFilter === 'open'
          ? s.status === 'open'
          : s.status === 'resolved'
      ),
    }))
    .filter((block) => block.suggestions.length > 0);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClearAll = async () => {
    if (!cvId) return;
    await clearAllSuggestions(cvId);
  };

  const handleGenerate = async () => {
    if (!cvId || isGenerating) return;
    await generateSuggestions(cvId);
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
          minHeight: '297mm',
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
              <Tooltip title={isGenerating ? "Generating..." : "Generate AI suggestions"}>
                <IconButton
                  size="small"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'grey.200',
                      color: 'text.primary',
                    },
                    transition: 'all 0.2s ease-in-out',
                    '&:disabled': {
                      color: 'text.disabled',
                    },
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
              onClick={() => setActiveFilter('open')}
              sx={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.375rem',
                backgroundColor: activeFilter === 'open' ? 'primary.main' : 'unset',
                color: activeFilter === 'open' ? 'white' : 'text.secondary',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: activeFilter === 'open' ? 'primary.dark' : 'grey.200',
                },
              }}
            >
              Open
            </Button>
            <Button
              size="small"
              onClick={() => setActiveFilter('resolved')}
              sx={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.375rem',
                borderRadius: '0.375rem',
                backgroundColor: activeFilter === 'resolved' ? 'primary.main' : 'unset',
                color: activeFilter === 'resolved' ? 'white' : 'text.secondary',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: activeFilter === 'resolved' ? 'primary.dark' : 'grey.200',
                },
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
              minHeight: 0,
            }}
          >
            {filteredSuggestionBlocks.length === 0 ? (
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
                {filteredSuggestionBlocks.map((block) => (
                  <Box
                    key={block.blockId}
                    className="thread"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1)',
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
                        (suggestion)  => (
                          <SuggestionCard
                            key={suggestion._id}
                            suggestion={suggestion}
                            blockId={block.blockId}
                            cvData={cvData}
                            isActive={activeSuggestionId === suggestion._id}
                            onAccept={async () => {
                              await updateSuggestionStatus(suggestion._id, 'resolved');
                            }}
                            onReject={async () => {
                              await deleteSuggestion(suggestion._id);
                            }}
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
