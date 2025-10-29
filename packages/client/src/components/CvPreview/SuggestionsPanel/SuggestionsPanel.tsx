import React from 'react';
import { Paper, Fade } from '@mui/material';
import { useSuggestions } from '../../../contexts';
import { useSuggestionScroll } from '../../../hooks/use-suggestion-scroll';
import { useGetCvQuery } from '../../../generated/graphql';
import { usePanelState } from './hooks/use-panel-state';
import { usePanelActions } from './hooks/use-panel-actions';
import { PanelHeader } from './components/PanelHeader/PanelHeader';
import { PanelContent } from './components/PanelContent';

interface SuggestionsPanelProps {
  cvId: string;
}

const panelStyles = {
  position: 'sticky' as const,
  top: 100,
  width: 400,
  minHeight: '297mm',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,
  backgroundColor: 'white',
  border: '1px solid',
  borderColor: 'grey.200',
  borderRadius: 1,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

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

  const { handleClearAll, handleGenerate, handleAcceptSuggestion, handleRejectSuggestion } =
    usePanelActions({
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
      <Paper elevation={0} data-suggestion-panel sx={panelStyles}>
        <PanelHeader
          isExpanded={isExpanded}
          isGenerating={isGenerating}
          activeFilter={activeFilter}
          onToggleExpanded={handleToggleExpanded}
          onGenerate={handleGenerate}
          onClearAll={handleClearAll}
          onFilterChange={setActiveFilter}
        />

        <PanelContent
          isExpanded={isExpanded}
          suggestionBlocks={filteredSuggestionBlocks}
          cvData={cvData}
          activeSuggestionId={activeSuggestionId}
          scrollContainerRef={scrollContainerRef}
          registerSuggestionRef={registerSuggestionRef}
          onAccept={handleAcceptSuggestion}
          onReject={handleRejectSuggestion}
        />
      </Paper>
    </Fade>
  );
};
