import { EditableTypography } from '../../../atoms';
import React, { useMemo } from 'react';
import type { TextSectionProps } from './types';
import { usePreviewMode } from '../../../../contexts';

export const JobTypeTextSection = ({
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
      valueRender={(v) => v ?? 'Type (empty)'}
      value={value}
      onSave={onSave}
      variant="body2"
      className="text-muted-foreground"
      isEditing={isEditing}
    />
  );
};
