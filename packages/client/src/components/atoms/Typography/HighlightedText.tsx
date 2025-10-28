import React, { forwardRef, useMemo, memo } from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import type { Suggestion } from '../../../contexts/use-suggestions';

interface HighlightedTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  suggestions: Suggestion[];
  activeSuggestionId?: string | null;
  onSuggestionClick?: (suggestionId: string) => void;
  isHovered?: boolean;
}

interface TextSegment {
  text: string;
  isHighlighted: boolean;
  suggestionId?: string;
  startOffset: number;
  endOffset: number;
}

// Memoized segment component for better performance
const HighlightedSegment = memo<{
  segment: TextSegment;
  activeSuggestionId?: string | null;
  isHovered?: boolean;
  onSuggestionClick?: (suggestionId: string) => void;
}>(({ segment, activeSuggestionId, isHovered, onSuggestionClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (segment.suggestionId && onSuggestionClick) {
      onSuggestionClick(segment.suggestionId);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (segment.isHighlighted) {
      e.currentTarget.style.boxShadow = 'inset 0 0 0 1000px #fef3c7';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (segment.isHighlighted) {
      e.currentTarget.style.boxShadow =
        activeSuggestionId === segment.suggestionId
          ? 'inset 0 0 0 1000px #fef3c7'
          : 'none';
    }
  };

  const isActive = activeSuggestionId === segment.suggestionId;
  const shouldHighlight = segment.isHighlighted && (isActive || isHovered);

  return (
    <span
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: segment.isHighlighted
          ? isActive
            ? '#fef3c7' // yellow-100 for active
            : 'transparent'
          : 'transparent',
        textDecoration: segment.isHighlighted ? 'underline' : 'none',
        textDecorationColor: segment.isHighlighted ? '#fbbf24' : 'transparent', // yellow-400
        textDecorationThickness: segment.isHighlighted ? '2px' : '0px',
        textUnderlineOffset: segment.isHighlighted ? '2px' : '0px',
        cursor: segment.isHighlighted ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        borderRadius: '0px',
        padding: '0px',
        margin: '0px',
        display: 'inline',
        boxShadow: shouldHighlight ? 'inset 0 0 0 1000px #fef3c7' : 'none',
      }}
    >
      {segment.text}
    </span>
  );
});

HighlightedSegment.displayName = 'HighlightedSegment';

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
    // Memoize text segments creation for better performance
    const segments = useMemo((): TextSegment[] => {
      if (!suggestions.length) {
        return [
          {
            text,
            isHighlighted: false,
            startOffset: 0,
            endOffset: text.length,
          },
        ];
      }

      // Sort suggestions by start offset
      const sortedSuggestions = [...suggestions].sort(
        (a, b) => (a.startOffset || 0) - (b.startOffset || 0)
      );

      const segments: TextSegment[] = [];
      let currentOffset = 0;

      for (const suggestion of sortedSuggestions) {
        const startOffset = suggestion.startOffset || 0;
        const endOffset = suggestion.endOffset || text.length;

        // Add non-highlighted segment before this suggestion
        if (currentOffset < startOffset) {
          segments.push({
            text: text.slice(currentOffset, startOffset),
            isHighlighted: false,
            startOffset: currentOffset,
            endOffset: startOffset,
          });
        }

        // Add highlighted segment for this suggestion
        segments.push({
          text: text.slice(startOffset, endOffset),
          isHighlighted: true,
          suggestionId: suggestion.id,
          startOffset,
          endOffset,
        });

        currentOffset = Math.max(currentOffset, endOffset);
      }

      // Add remaining non-highlighted text
      if (currentOffset < text.length) {
        segments.push({
          text: text.slice(currentOffset),
          isHighlighted: false,
          startOffset: currentOffset,
          endOffset: text.length,
        });
      }

      return segments;
    }, [text, suggestions]);

    // Extract textAlign from sx props
    const textAlignFromSx = useMemo(() => {
      return typographyProps.sx &&
        typeof typographyProps.sx === 'object' &&
        'textAlign' in typographyProps.sx
        ? (typographyProps.sx as any).textAlign
        : 'inherit';
    }, [typographyProps.sx]);

    return (
      <Typography
        ref={ref}
        {...typographyProps}
        data-highlighted-text
        sx={{ ...typographyProps.sx, width: '100%' }}
        style={{ textAlign: textAlignFromSx }}
      >
        {segments.map((segment, index) => (
          <HighlightedSegment
            key={index}
            segment={segment}
            activeSuggestionId={activeSuggestionId}
            isHovered={isHovered}
            onSuggestionClick={onSuggestionClick}
          />
        ))}
      </Typography>
    );
  }
);
