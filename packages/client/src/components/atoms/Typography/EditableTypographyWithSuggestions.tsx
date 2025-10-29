import { useCallback, useRef } from 'react';
import { EditableTypographyBase } from './EditableTypographyBase';
import { HighlightedText } from './HighlightedText';
import { useSuggestionHighlight } from '../../../hooks/use-suggestion-highlight';
import { useEditableTypographyBase } from '../../../hooks';
import type { EditableTypographyProps } from './types';
import type { SuggestionBlock } from "../../../contexts";

interface EditableTypographyWithSuggestionsProps
  extends EditableTypographyProps {
  suggestionBlocks: SuggestionBlock[];
  activeSuggestionId: string | null;
  hoveredBlockId: string | null;
  setActiveSuggestionId: (id: string | null) => void;
}

export const EditableTypographyWithSuggestions = ({
  id,
  value,
  onSave,
  onAiEdit,
  multiline,
  isEditing: defaultIsEditing,
  component,
  textFieldProps,
  valueRender,
  sx,
  suggestionBlocks,
  activeSuggestionId,
  hoveredBlockId,
  setActiveSuggestionId,
  ...typographyProps
}: EditableTypographyWithSuggestionsProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  const {
    tempValue,
    setTempValue,
    handleSave: baseHandleSave,
    handleCancel,
    displayValue,
  } = useEditableTypographyBase({ value, onSave });

  const {
    blockSuggestions,
    hasBlockSuggestions,
    hasBlockOffsetSuggestions,
    isHighlighted,
    isActive,
  } = useSuggestionHighlight({
    suggestionBlocks,
    blockId: id,
    activeSuggestionId,
    hoveredBlockId,
  });

  // Handle click to activate suggestion
  const handleClick = useCallback(() => {
    if (hasBlockSuggestions && !isActive) {
      // Activate the first suggestion for this block
      const firstSuggestion = blockSuggestions[0];
      if (firstSuggestion) {
        setActiveSuggestionId(firstSuggestion._id);
      }
    }
  }, [hasBlockSuggestions, isActive, blockSuggestions, setActiveSuggestionId]);

  // Handle suggestion click for highlighted text
  const handleSuggestionClick = useCallback(
    (suggestionId: string) => {
      setActiveSuggestionId(suggestionId);
    },
    [setActiveSuggestionId]
  );

  // Extract textAlign from sx if it exists
  const textAlignFromSx =
    sx && typeof sx === 'object' && 'textAlign' in sx
      ? sx.textAlign
      : undefined;

  const combinedSx = Object.assign(
    {},
    sx,
    // Only apply block-level highlighting if we don't have offset-based suggestions
    isHighlighted && !hasBlockOffsetSuggestions
      ? {
          backgroundColor: '#fef3c7', // yellow-100 - same as selected state
          borderRadius: '4px',
          transition: 'background-color 0.2s ease-in-out',
        }
      : {},
    // Only apply full text highlighting if we don't have offset-based suggestions
    hasBlockSuggestions && !hasBlockOffsetSuggestions
      ? {
          textDecoration: 'underline',
          textDecorationColor: '#fbbf24', // yellow-400
          textDecorationThickness: '2px',
          textUnderlineOffset: '2px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        }
      : {},
    // Only apply full background if we don't have offset-based suggestions
    isActive && !hasBlockOffsetSuggestions
      ? {
          // Use box-shadow instead of background-color to avoid layout changes
          boxShadow: 'inset 0 0 0 1000px #fef3c7', // yellow-100
          transition: 'box-shadow 0.2s ease-in-out',
        }
      : {}
  );

  const combinedTypographyProps = {
    ...typographyProps,
    sx: {
      width: '100%', // Changed from 'fit-content' to '100%' to ensure textAlign works
      // Preserve text alignment from parent sx
      ...(textAlignFromSx ? { textAlign: textAlignFromSx } : {}),
      ...((typographyProps as any).sx ?? {}), // Merge existing sx props. TODO: no sx here. investigate
    },
  };

  // If we have offset-based suggestions and we're not editing, use HighlightedText
  if (hasBlockOffsetSuggestions && !defaultIsEditing && blockSuggestions) {
    // Only show highlights for open suggestions
    const openSuggestions = blockSuggestions.filter(s => s.status === 'open');

    return (
      <HighlightedText
        id={id}
        text={value ?? ''}
        suggestions={openSuggestions}
        activeSuggestionId={activeSuggestionId}
        onSuggestionClick={handleSuggestionClick}
        isHovered={isHighlighted}
        {...combinedTypographyProps}
        sx={{ ...combinedTypographyProps.sx, ...combinedSx }}
      />
    );
  }

  return (
    <EditableTypographyBase
      ref={textRef}
      sx={{ alignContent: 'center', ...combinedSx }}
      typographyProps={{
        ...combinedTypographyProps,
        sx: {
          width: 'fit-content',
          ...(combinedTypographyProps.sx ?? {}),
        },
      }}
      id={id}
      isEditing={!!defaultIsEditing}
      tempValue={tempValue}
      value={displayValue}
      setTempValue={setTempValue}
      handleSave={baseHandleSave}
      handleCancel={handleCancel}
      multiline={multiline}
      variant={typographyProps.variant}
      textFieldProps={{ ...textFieldProps }}
      valueRender={valueRender}
      useContentEditable={true}
      onMouseDown={hasBlockSuggestions ? handleClick : undefined}
    />
  );
};
