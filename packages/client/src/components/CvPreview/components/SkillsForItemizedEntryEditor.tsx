import type { ReactNode } from 'react';
import React from 'react';
import { grey } from '@mui/material/colors';
import { Typography } from '@mui/material';
import type { EditableTypographyProps } from '../../atoms/Typography/types';
import { CommaSeparatedList } from '../../CommaSeparatedList';
import { usePreviewMode } from '../../../contexts';

type SkillsForItemizedEntryEditorProps = Pick<
  EditableTypographyProps,
  'onSave' | 'id' | 'isEditing'
> & {
  labelPrefix?: ReactNode;
  entries: string[];
};

export const SkillsForItemizedEntryEditor = ({
  id,
  isEditing,
  entries: _entries,
  onSave,
  labelPrefix,
}: SkillsForItemizedEntryEditorProps) => {
  const { isPreviewing } = usePreviewMode();
  const entries = _entries.filter((entry) => !!entry.trim());

  const handleSave = async (newItems: string[]) => {
    await onSave(newItems.join(', '));
  };

  const defaultLabelPrefix = (
    <Typography
      variant="body2"
      component="span"
      sx={{
        color: grey[600],
        fontWeight: 'bold',
      }}
    >
      Skills:
    </Typography>
  );

  const finalLabelPrefix =
    labelPrefix === undefined ? defaultLabelPrefix : labelPrefix;

  if (isPreviewing && entries.length === 0) {
    return null;
  }

  return (
    <CommaSeparatedList
      id={id}
      isEditing={isEditing}
      items={entries}
      onSave={handleSave}
      labelPrefix={finalLabelPrefix}
      sx={{ color: grey[600] }}
      textSx={{ color: grey[600] }}
      variant="body2"
      emptyText="(empty)"
    />
  );
};
