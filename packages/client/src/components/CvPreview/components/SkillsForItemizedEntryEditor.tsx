import type { ReactNode } from 'react';
import React from 'react';
import { Typography } from '../../atoms/Typography/Typography';
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
      className="text-muted-foreground font-bold"
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
      className="text-muted-foreground"
      textClassName="text-muted-foreground"
      variant="body2"
      emptyText="(empty)"
    />
  );
};
