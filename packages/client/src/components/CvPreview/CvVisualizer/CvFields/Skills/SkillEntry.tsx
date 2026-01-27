import React from 'react';
import { Box, EditableTypography } from '../../../../atoms';
import type { CvEntryItemProps } from '../../types';
import { CommaSeparatedList } from '../../../../CommaSeparatedList';
import { usePreviewMode } from '../../../../../contexts';
import { useFieldId } from '../../../../../contexts/CvMetadataContext';

export const SkillEntry = ({
  entry: skill,
  updateField,
  isEditing,
}: CvEntryItemProps<'skillEntries'>) => {
  const { isPreviewing } = usePreviewMode();
  const categoryFieldId = useFieldId(`skillEntries.${skill._id}.category`);
  const skillsFieldId = useFieldId(`skillEntries.${skill._id}.skills`);

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
    <Box className="w-full">
      <EditableTypography
        id={categoryFieldId || `skill-category-${skill._id}`}
        value={skill.category}
        onSave={(value) =>
          updateField({ _id: skill._id, fieldName: 'category', value })
        }
        variant="h5"
        isEditing={isEditing}
      />

      <CommaSeparatedList
        id={skillsFieldId || `skill-items-${skill._id}`}
        isEditing={isEditing}
        items={skill.skills || []}
        onSave={handleUpdateSkills}
        variant="body1"
        emptyText="(empty)"
        className="w-full"
      />
    </Box>
  );
};
