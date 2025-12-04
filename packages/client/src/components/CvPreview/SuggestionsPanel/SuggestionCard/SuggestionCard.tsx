import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Suggestion } from '../../../../contexts';
import { useSuggestions } from '../../../../contexts';
import type { GetCvQuery } from '../../../../generated/graphql';
import { extractCurrentText } from '../utils';
import { useApplySuggestion } from '../hooks/use-apply-suggestion';
import { CardHeader } from '../components/SuggestionCard/CardHeader';
import { CardMetadata } from '../components/SuggestionCard/CardMetadata';
import { ResolvedContent } from './ResolvedContent';
import { SuggestedChangeContent } from './SuggestedChangeContent';
import { CardContainer, CommentText } from './styled';

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
    <CardContainer
      ref={cardRef}
      isActive={isActive}
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
      <CommentText>{suggestion.text}</CommentText>

      {/* Suggested Change */}
      <SuggestedChangeContent
        suggestion={suggestion}
        currentText={currentText}
        applyLoading={applyLoading}
        onApply={handleApply}
      />

      {/* Resolved Content */}
      <ResolvedContent suggestion={suggestion} />
    </CardContainer>
  );
};

export const SuggestionCard = memo(SuggestionCardComponent);
