import { useEffect, useRef } from 'react';
import { useEditableTypographyBase } from '../../../hooks';
import { EditableTypographyBase } from './EditableTypographyBase';
import { EditableTypographyWithSuggestions } from './EditableTypographyWithSuggestions';
import type { EditableTypographyProps } from './types';
import { useEntryEdit } from '../../../contexts';
import { useSuggestions } from '../../../contexts';
import { cn } from '@ui/lib/utils';

export const EditableTypography = ({
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
  ...typographyProps
}: EditableTypographyProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const { isEntryActive } = useEntryEdit();
  const {
    suggestionBlocks,
    activeSuggestionId,
    hoveredBlockId,
    setActiveSuggestionId,
  } = useSuggestions();

  // React 19: Now includes optimistic updates
  const {
    isEditing,
    startEditing,
    tempValue,
    setTempValue,
    handleSave,
    handleCancel,
    displayValue,
    isPending,
  } = useEditableTypographyBase({ value, onSave });

  useEffect(() => {
    if (defaultIsEditing) startEditing();
  }, [defaultIsEditing, startEditing]);

  const shouldBeEditing = isEditing || isEntryActive;

  // Check if this block has suggestions
  const blockSuggestions = suggestionBlocks.find(
    (block) => block.blockId === id
  );
  const hasSuggestions =
    blockSuggestions && blockSuggestions.suggestions.length > 0;

  // If we have suggestions, use the suggestions-aware component
  if (hasSuggestions) {
    return (
      <EditableTypographyWithSuggestions
        id={id}
        value={displayValue}
        onSave={async (newValue: string) => {
          handleSave(newValue);
        }}
        onAiEdit={onAiEdit}
        multiline={multiline}
        isEditing={shouldBeEditing}
        component={component}
        textFieldProps={{ ...textFieldProps, disabled: isPending }}
        valueRender={valueRender}
        className={className}
        suggestionBlocks={suggestionBlocks}
        activeSuggestionId={activeSuggestionId}
        hoveredBlockId={hoveredBlockId}
        setActiveSuggestionId={setActiveSuggestionId}
        variant={typographyProps.variant}
        color={typographyProps.color}
      />
    );
  }

  // Default behavior for blocks without suggestions
  return (
    <EditableTypographyBase
      ref={textRef}
      className={cn('content-center', className)}
      typographyProps={{
        variant: typographyProps.variant,
        color: typographyProps.color,
        className: 'w-fit',
      }}
      id={id}
      isEditing={shouldBeEditing}
      tempValue={tempValue}
      value={displayValue}
      setTempValue={setTempValue}
      handleSave={handleSave}
      handleCancel={handleCancel}
      startEditing={startEditing}
      multiline={multiline}
      variant={typographyProps.variant}
      textFieldProps={{ ...textFieldProps, disabled: isPending }}
      valueRender={valueRender}
      useContentEditable={true}
    />
  );
};
