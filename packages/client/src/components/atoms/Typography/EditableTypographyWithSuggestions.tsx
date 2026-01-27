import { useCallback, useRef } from 'react';
import { EditableTypographyBase } from './EditableTypographyBase';
import { HighlightedText } from './HighlightedText';
import { useSuggestionHighlight } from '../../../hooks/use-suggestion-highlight';
import { useEditableTypographyBase } from '../../../hooks';
import type { EditableTypographyProps } from './types';
import type { SuggestionBlock } from '../../../contexts';
import { cn } from '@ui/lib/utils';

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
  className,
  suggestionBlocks,
  activeSuggestionId,
  hoveredBlockId,
  setActiveSuggestionId,
  variant,
  color,
}: EditableTypographyWithSuggestionsProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  const {
    tempValue,
    setTempValue,
    handleSave: baseHandleSave,
    handleCancel,
    displayValue,
  } = useEditableTypographyBase({ value, onSave });

  const { blockSuggestions, hasBlockSuggestions, isHighlighted, isActive } =
    useSuggestionHighlight({
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

  // Extract textAlign from className
  const textAlignMatch = className?.match(/text-(left|center|right|justify)/);
  const textAlign = textAlignMatch ? textAlignMatch[0] : undefined;

  // If we have suggestions and we're not editing, use HighlightedText
  if (hasBlockSuggestions && !defaultIsEditing) {
    const openSuggestions = blockSuggestions.filter((s) => s.status === 'open');
    return (
      <HighlightedText
        id={id}
        text={value ?? ''}
        suggestions={openSuggestions}
        activeSuggestionId={activeSuggestionId}
        onSuggestionClick={handleSuggestionClick}
        isHovered={isHighlighted}
        variant={variant}
        color={color}
        className={cn('w-full', textAlign, className)}
      />
    );
  }

  return (
    <EditableTypographyBase
      ref={textRef}
      className={cn('content-center', className)}
      typographyProps={{
        variant,
        color,
        className: cn('w-full', textAlign),
      }}
      id={id}
      isEditing={!!defaultIsEditing}
      tempValue={tempValue}
      value={displayValue}
      setTempValue={setTempValue}
      handleSave={baseHandleSave}
      handleCancel={handleCancel}
      multiline={multiline}
      variant={variant}
      textFieldProps={{ ...textFieldProps }}
      valueRender={valueRender}
      useContentEditable={false}
      onMouseDown={hasBlockSuggestions ? handleClick : undefined}
    />
  );
};
