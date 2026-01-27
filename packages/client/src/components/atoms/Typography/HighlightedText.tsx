import React, { forwardRef, useEffect, useRef } from 'react';
import type { Suggestion } from '../../../contexts';
import { usePreviewMode } from '../../../contexts';
import { cn } from '@ui/lib/utils';
import { Typography, type TypographyProps } from './Typography';

interface HighlightedTextProps extends Omit<TypographyProps, 'children'> {
  id?: string;
  text: string;
  suggestions: Suggestion[];
  activeSuggestionId?: string | null;
  onSuggestionClick?: (suggestionId: string) => void;
  isHovered?: boolean;
}

export const HighlightedText = forwardRef<HTMLDivElement, HighlightedTextProps>(
  (
    {
      id,
      text,
      suggestions,
      activeSuggestionId,
      onSuggestionClick,
      isHovered = false,
      className,
      ...typographyProps
    },
    ref
  ) => {
    const textRef = useRef<HTMLDivElement>(null);
    const { isPreviewing } = usePreviewMode();

    // Scroll to active suggestion when it changes
    useEffect(() => {
      if (activeSuggestionId && textRef.current) {
        textRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, [activeSuggestionId]);

    // Check if this text has any suggestions
    const hasSuggestions = suggestions.length > 0;
    const activeSuggestion = suggestions.find(
      (s) => s._id === activeSuggestionId
    );
    const isActive = !!activeSuggestion;
    const shouldHighlight = hasSuggestions && (isActive || isHovered);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasSuggestions && suggestions[0] && onSuggestionClick) {
        onSuggestionClick(suggestions[0]._id);
      }
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (hasSuggestions) {
        e.currentTarget.style.boxShadow = 'inset 0 0 0 1000px #fef3c7';
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (hasSuggestions) {
        e.currentTarget.style.boxShadow = isActive
          ? 'inset 0 0 0 1000px #fef3c7'
          : 'none';
      }
    };

    // Extract textAlign from className
    const textAlignMatch = className?.match(/text-(left|center|right|justify)/);
    const textAlign = textAlignMatch ? textAlignMatch[0] : 'text-inherit';

    return (
      <Typography
        ref={ref}
        {...typographyProps}
        data-highlighted-text
        className={cn('w-full', textAlign, className)}
      >
        {hasSuggestions ? (
          <span
            ref={isActive ? textRef : undefined}
            onClick={!isPreviewing ? handleClick : undefined}
            onMouseEnter={!isPreviewing ? handleMouseEnter : undefined}
            onMouseLeave={!isPreviewing ? handleMouseLeave : undefined}
            data-suggestion-id={suggestions[0]?._id}
            className={cn(
              'rounded-none p-0 m-0 inline',
              !isPreviewing && hasSuggestions && [
                'underline decoration-yellow-400 decoration-2 underline-offset-2',
                'cursor-pointer transition-all duration-200',
                isActive && 'bg-yellow-100',
                shouldHighlight && 'shadow-[inset_0_0_0_1000px_#fef3c7]',
              ]
            )}
          >
            {text}
          </span>
        ) : (
          text
        )}
      </Typography>
    );
  }
);

HighlightedText.displayName = 'HighlightedText';
