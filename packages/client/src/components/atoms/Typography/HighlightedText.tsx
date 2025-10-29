import React, { forwardRef, useEffect, useRef, useMemo } from 'react';
import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import type { Suggestion } from '../../../contexts';
import { usePreviewMode } from '../../../contexts';

interface HighlightedTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  suggestions: Suggestion[];
  activeSuggestionId?: string | null;
  onSuggestionClick?: (suggestionId: string) => void;
  isHovered?: boolean;
}

export const HighlightedText = forwardRef<HTMLDivElement, HighlightedTextProps>(
  (
    {
      text,
      suggestions,
      activeSuggestionId,
      onSuggestionClick,
      isHovered = false,
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
    const activeSuggestion = suggestions.find(s => s._id === activeSuggestionId);
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
        e.currentTarget.style.boxShadow =
          isActive ? 'inset 0 0 0 1000px #fef3c7' : 'none';
      }
    };

    // Extract textAlign from sx props
    const textAlignFromSx = useMemo(() => {
      return typographyProps.sx &&
        typeof typographyProps.sx === 'object' &&
        'textAlign' in typographyProps.sx
        ? (typographyProps.sx as any).textAlign
        : 'inherit';
    }, [typographyProps.sx]);

    const highlightedTextStyles = {
      textDecoration: 'underline',
      textDecorationColor: '#fbbf24', // yellow-400
      textDecorationThickness: '2px',
      textUnderlineOffset: '2px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: isActive
        ? '#fef3c7' // yellow-100 for active
        : 'transparent',
      boxShadow: shouldHighlight ? 'inset 0 0 0 1000px #fef3c7' : 'none',
    };

    return (
      <Typography
        ref={ref}
        {...typographyProps}
        data-highlighted-text
        sx={{ ...typographyProps.sx, width: '100%' }}
        style={{ textAlign: textAlignFromSx }}
      >
        {hasSuggestions ? (
          <span
            ref={isActive ? textRef : undefined}
            onClick={!isPreviewing ? handleClick : undefined}
            onMouseEnter={!isPreviewing ? handleMouseEnter : undefined}
            onMouseLeave={!isPreviewing ? handleMouseLeave : undefined}
            data-suggestion-id={suggestions[0]?._id}
            style={{
              borderRadius: '0px',
              padding: '0px',
              margin: '0px',
              display: 'inline',
              ...(!isPreviewing ? highlightedTextStyles : {}),
            }}
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
