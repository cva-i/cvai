import { useEffect } from 'react';
import { useEditableTypographyBase } from '../../../hooks';
import { EditableTypographyBase } from './EditableTypographyBase';
import { EditableTypographyWithSuggestions } from './EditableTypographyWithSuggestions';
import type { EditableTypographyProps } from './types';
import { useEntryEdit } from '../../../contexts';
import { useSuggestions } from '../../../contexts/use-suggestions/SuggestionsProvider';

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
  sx,
  ...typographyProps
}: EditableTypographyProps) => {
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
    (block: any) => block.blockId === id
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
          await handleSave(newValue);
        }}
        onAiEdit={onAiEdit}
        multiline={multiline}
        isEditing={shouldBeEditing}
        component={component}
        textFieldProps={{ ...textFieldProps, disabled: isPending }}
        valueRender={valueRender}
        sx={sx}
        suggestionBlocks={suggestionBlocks}
        activeSuggestionId={activeSuggestionId}
        hoveredBlockId={hoveredBlockId}
        setActiveSuggestionId={setActiveSuggestionId}
        {...typographyProps}
      />
    );
  }

  // Default behavior for blocks without suggestions
  return (
    <EditableTypographyBase
      sx={sx}
      typographyProps={typographyProps}
      id={id}
      isEditing={shouldBeEditing}
      tempValue={tempValue}
      value={displayValue}
      setTempValue={setTempValue}
      handleSave={handleSave}
      handleCancel={handleCancel}
      multiline={multiline}
      variant={typographyProps.variant}
      textFieldProps={{ ...textFieldProps, disabled: isPending }}
      valueRender={valueRender}
      useContentEditable={true}
    />
  );
};
