import { usePreviewMode } from '../../../../contexts';
import React, { useMemo } from 'react';
import { EditableTypography } from '../../../atoms';
import type { TextSectionProps } from './types';

export const DescriptionTextSection = ({
  id,
  value,
  onSave,
  isEditing,
}: TextSectionProps) => {
  const { isPreviewing } = usePreviewMode();

  const shouldShowValue = useMemo(
    () => !isPreviewing || value,
    [isPreviewing, value]
  );

  if (!shouldShowValue) {
    return null;
  }
  return (
    <EditableTypography
      id={id}
      value={value}
      valueRender={(v) => v ?? 'Description (empty)'}
      onSave={onSave}
      multiline
      className="w-full"
      textFieldProps={{
        className: 'w-full',
      }}
      isEditing={isEditing}
    />
  );
};
