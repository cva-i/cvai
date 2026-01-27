import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@ui/lib/utils';
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

export const SuggestionsPanel: FC<SuggestionsPanelProps> = ({ cvId }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => !prev);
  }, []);

  const openSuggestions = suggestionBlocks.reduce(
    (acc, block) =>
      acc + block.suggestions.filter((s) => s.status === 'open').length,
    0
  );

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={togglePanel}
        className={cn(
          'fixed right-4 top-4 z-[1200]',
          'flex items-center justify-center',
          'w-12 h-12 rounded-full',
          'bg-primary text-primary-foreground',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-200',
          'hover:scale-105 active:scale-95',
          isPanelOpen && 'opacity-0 pointer-events-none'
        )}
        aria-label="Open suggestions panel"
      >
        <MessageSquare className="w-5 h-5" />
        {openSuggestions > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
            {openSuggestions}
          </span>
        )}
      </button>

      {/* Floating Panel */}
      <div
        className={cn(
          'fixed right-4 top-4 z-[1200]',
          'w-[400px] max-h-[80vh]',
          'flex flex-col bg-white',
          'border border-gray-200 rounded-2xl',
          'shadow-lg',
          'transition-all duration-300 ease-in-out',
          isPanelOpen
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-4 pointer-events-none'
        )}
        data-suggestion-panel
      >
        {/* Close Button */}
        <button
          onClick={togglePanel}
          className="absolute right-3 top-3 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close suggestions panel"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header - Always Visible */}
        <div className="flex-none pr-8">
          <PanelHeader
            isExpanded={isExpanded}
            isGenerating={isGenerating}
            activeFilter={activeFilter}
            onToggleExpanded={handleToggleExpanded}
            onGenerate={handleGenerate}
            onClearAll={handleClearAll}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Content - Only When Expanded */}
        {isExpanded && (
          <div
            className={cn(
              'flex-1 min-h-0 overflow-hidden',
              'flex flex-col p-4 bg-white',
              'rounded-b-2xl'
            )}
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
          </div>
        )}
      </div>
    </>
  );
};
