import React from 'react';
import { Paper, Fade, Box } from '@mui/material';
import { match } from 'ts-pattern';
import { useSuggestions } from '../../../contexts';
import { useSuggestionScroll } from '../../../hooks/use-suggestion-scroll';
import { useGetCvQuery } from '../../../generated/graphql';
import { usePanelState } from './hooks/use-panel-state';
import { usePanelActions } from './hooks/use-panel-actions';
import { PanelHeader } from './components/PanelHeader/PanelHeader';
import { EmptyState } from './components/EmptyState';
import { SuggestionsList } from './components/SuggestionsList';

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

  const {
    isExpanded,
    activeFilter,
    filteredSuggestionBlocks,
    setActiveFilter,
    handleToggleExpanded,
  } = usePanelState(suggestionBlocks);

  const {
    handleClearAll,
    handleGenerate,
    handleAcceptSuggestion,
    handleRejectSuggestion,
  } = usePanelActions({
    cvId,
    isGenerating,
    clearAllSuggestions,
    generateSuggestions,
    updateSuggestionStatus,
    deleteSuggestion,
  });

  const { scrollContainerRef, registerSuggestionRef } = useSuggestionScroll({
    activeSuggestionId,
    isExpanded,
  });

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        data-suggestion-panel
        sx={{
          width: 400,
          flex: isExpanded ? '1 1 auto' : '0 0 auto',
          minHeight: 0,
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
        {/* Header - Always Visible */}
        <Box sx={{ flex: '0 0 auto' }}>
          <PanelHeader
            isExpanded={isExpanded}
            isGenerating={isGenerating}
            activeFilter={activeFilter}
            onToggleExpanded={handleToggleExpanded}
            onGenerate={handleGenerate}
            onClearAll={handleClearAll}
            onFilterChange={setActiveFilter}
          />
        </Box>

        {/* Content - Only When Expanded */}
        {isExpanded && (
          <Box
            sx={{
              flex: '1 1 auto',
              minHeight: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              backgroundColor: 'white',
            }}
          >
            {match(filteredSuggestionBlocks.length)
              .with(0, () => <EmptyState />)
              .otherwise(() => (
                <SuggestionsList
                  suggestionBlocks={filteredSuggestionBlocks}
                  cvData={cvData}
                  activeSuggestionId={activeSuggestionId}
                  scrollContainerRef={scrollContainerRef}
                  registerSuggestionRef={registerSuggestionRef}
                  onAccept={handleAcceptSuggestion}
                  onReject={handleRejectSuggestion}
                />
              ))}
          </Box>
        )}
      </Paper>
    </Fade>
  );
};
