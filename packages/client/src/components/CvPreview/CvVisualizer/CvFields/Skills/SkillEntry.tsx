import React from 'react';
import { Box } from '@mui/material';
import { EditableTypography } from '../../../../atoms';
import type { CvEntryItemProps } from '../../types';
import { CommaSeparatedList } from '../../../../CommaSeparatedList';
import { usePreviewMode } from '../../../../../contexts';

export const SkillEntry = ({
  entry: skill,
  updateField,
  isEditing,
}: CvEntryItemProps<'skillEntries'>) => {
  const { isPreviewing } = usePreviewMode();

  const handleUpdateSkills = async (newSkills: string[]) => {
    await updateField({
      _id: skill._id,
      fieldName: 'skills',
      value: newSkills,
    });
  };

  const hasNoSkills = !skill.skills || skill.skills.length === 0;

  if (isPreviewing && hasNoSkills) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <EditableTypography
        id={`skill-category-${skill._id}`}
        value={skill.category}
        onSave={(value) =>
          updateField({ _id: skill._id, fieldName: 'category', value })
        }
        variant="h5"
        isEditing={isEditing}
      />

      <CommaSeparatedList
        id={`skill-items-${skill._id}`}
        isEditing={isEditing}
        items={skill.skills || []}
        onSave={handleUpdateSkills}
        variant="body1"
        emptyText="(empty)"
        sx={{ width: '100%' }}
      />
    </Box>
  );
};
