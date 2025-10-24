import React from 'react';
import { Box, Typography } from '@mui/material';
import { EditableTypography, Row } from '../../../../atoms';
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
      <Row>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
          }}
        >
          <EditableTypography
            id={`skill-category-${skill._id}`}
            value={skill.category}
            onSave={(value) =>
              updateField({ _id: skill._id, fieldName: 'category', value })
            }
            variant="body1"
            sx={{
              fontWeight: 'bold',
              display: 'inline',
            }}
            isEditing={isEditing}
          />
          <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
            :
          </Typography>
        </Box>

        <CommaSeparatedList
          id={`skill-items-${skill._id}`}
          isEditing={isEditing}
          items={skill.skills || []}
          onSave={handleUpdateSkills}
          variant="body1"
          showWhenEmpty={!isPreviewing}
          emptyText="(empty)"
          sx={{ width: '100%' }}
        />
      </Row>
    </Box>
  );
};
