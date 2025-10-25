import { useEffect, useRef } from 'react';
import { useEditableTypographyBase } from '../../../hooks';
import { EditableTypographyBase } from './EditableTypographyBase';
import type { EditableTypographyProps } from './types';
import { useEntryEdit } from '../../../contexts';

// TODO: this is a large piece of shit.
//  the implementation needs to be changed. There's too much ad-hoc things.
//  color doesn't work and it's buggy and forgive me god I've ever written this component...
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
  const textRef = useRef<HTMLDivElement>(null);
  const { isEntryActive } = useEntryEdit();

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

  return (
    <EditableTypographyBase
      ref={textRef}
      sx={{ alignContent: 'center', ...sx }}
      typographyProps={{
        ...typographyProps,
        sx: {
          width: 'fit-content',
        },
      }}
      id={id}
      isEditing={shouldBeEditing}
      tempValue={tempValue}
      value={displayValue}
      setTempValue={setTempValue}
      handleSave={handleSave}
      handleCancel={handleCancel}
      multiline={multiline}
      variant={typographyProps.variant}
      textFieldProps={{
        ...textFieldProps,
        disabled: isPending,
      }}
      valueRender={valueRender}
      useContentEditable={true}
    />
  );
};
