import { useEditableTypographyBase } from '../../../hooks';
import { useEffect } from 'react';
import { EditableTypographyBase } from './EditableTypographyBase';
import type { EditableTypographyProps } from './types';

export const EditableTypographyLight = ({
  id,
  value,
  onSave,
  onAiEdit,
  multiline,
  isEditing: defaultIsEditing,
  className,
  ...typographyProps
}: EditableTypographyProps) => {
  const {
    isEditing,
    startEditing,
    tempValue,
    setTempValue,
    handleSave,
    handleCancel,
  } = useEditableTypographyBase({
    value,
    onSave,
  });

  useEffect(() => {
    if (defaultIsEditing) {
      startEditing();
    }
  }, [startEditing, defaultIsEditing]);

  return (
    <EditableTypographyBase
      typographyProps={{
        variant: typographyProps.variant,
        color: typographyProps.color,
        className: 'rounded-[10px] w-fit',
      }}
      id={id}
      isEditing={isEditing}
      tempValue={tempValue}
      setTempValue={setTempValue}
      handleSave={handleSave}
      handleCancel={handleCancel}
      multiline={multiline}
      value={value}
      variant={typographyProps.variant}
      className={className}
    />
  );
};
