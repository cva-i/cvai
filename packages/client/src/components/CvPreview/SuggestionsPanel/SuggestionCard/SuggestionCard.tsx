import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { cn } from '@ui/lib/utils';
import type { Suggestion } from '../../../../contexts';
import { useSuggestions } from '../../../../contexts';
import type { GetCvQuery } from '../../../../generated/graphql';
import { extractCurrentText } from '../utils';
import { useApplySuggestion } from '../hooks/use-apply-suggestion';
import { CardHeader } from '../components/SuggestionCard/CardHeader';
import { CardMetadata } from '../components/SuggestionCard/CardMetadata';
import { ResolvedContent } from './ResolvedContent';
import { SuggestedChangeContent } from './SuggestedChangeContent';
import { cardContainerVariants, commentTextClasses } from './styled';

export type SuggestionCardProps = {
  suggestion: Suggestion;
  blockId: string;
  cvData: GetCvQuery | undefined;
  isActive: boolean;
  onAccept: () => void;
  onReject: () => void;
  registerRef?: (suggestionId: string, element: HTMLDivElement | null) => void;
};

const SuggestionCardComponent = ({
  suggestion,
  blockId,
  cvData,
  isActive,
  onAccept,
  onReject,
  registerRef,
}: SuggestionCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { setHoveredBlockId, setActiveSuggestionId } = useSuggestions();
  const { applySuggestion, loading: applyLoading } = useApplySuggestion();
  console.log('Suggestion: ', suggestion);

  // Extract current text for diff view
  const currentText = useMemo(
    () => extractCurrentText(cvData, blockId),
    [cvData, blockId]
  );

  // Mouse event handlers
  const handleMouseEnter = useCallback(() => {
    setHoveredBlockId(blockId);
  }, [blockId, setHoveredBlockId]);

  const handleMouseLeave = useCallback(() => {
    setHoveredBlockId(null);
  }, [setHoveredBlockId]);

  const handleCardClick = useCallback(() => {
    setActiveSuggestionId(suggestion._id);
  }, [suggestion._id, setActiveSuggestionId]);

  // Apply suggestion handler
  const handleApply = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await applySuggestion({ cvData, suggestion });
    },
    [applySuggestion, cvData, suggestion]
  );

  // Register ref for scrolling
  useEffect(() => {
    if (registerRef && cardRef.current) {
      registerRef(suggestion._id, cardRef.current);
    }
    return () => {
      if (registerRef) {
        registerRef(suggestion._id, null);
      }
    };
  }, [registerRef, suggestion._id]);

  return (
    <div
      ref={cardRef}
      className={cn(cardContainerVariants({ isActive }))}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      data-suggestion-card
    >
      {/* Header Actions */}
      <CardHeader onResolve={onAccept} onReject={onReject} />

      {/* Author and Timestamp */}
      <CardMetadata
        authorName={suggestion.authorName}
        createdAt={suggestion.createdAt}
      />

      {/* Comment Text */}
      <p className={commentTextClasses}>{suggestion.text}</p>

      {/* Suggested Change */}
      <SuggestedChangeContent
        suggestion={suggestion}
        currentText={currentText}
        applyLoading={applyLoading}
        onApply={handleApply}
      />

      {/* Resolved Content */}
      <ResolvedContent suggestion={suggestion} />
    </div>
  );
};

export const SuggestionCard = memo(SuggestionCardComponent);
