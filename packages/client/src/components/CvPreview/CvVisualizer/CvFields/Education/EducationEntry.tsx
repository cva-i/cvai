import React from 'react';
import { Box, Typography } from '@mui/material';
import { EditableTypography, RowLayout } from '../../../../atoms';
import type { CvEntryItemProps } from '../../types';
import {
  DescriptionTextSection,
  SkillsForItemizedEntryEditor,
} from '../../../components';
import { LocationAndDate } from '../WorkExperience/LocationAndDate';
import { useFieldId } from '../../../../../contexts/CvMetadataContext';

export const EducationEntry = ({
  entry: ed,
  updateField,
  isEditing,
}: CvEntryItemProps<'educationEntries'>) => {
  const degreeFieldId = useFieldId(`educationEntries.${ed._id}.degree`);
  const nameFieldId = useFieldId(`educationEntries.${ed._id}.name`);
  const descriptionFieldId = useFieldId(`educationEntries.${ed._id}.description`);
  const locationFieldId = useFieldId(`educationEntries.${ed._id}.location`);
  const durationFieldId = useFieldId(`educationEntries.${ed._id}.duration`);
  const skillsFieldId = useFieldId(`educationEntries.${ed._id}.skills`);

  return (
    <Box display="flex" flexDirection="column" gap={1} width={'100%'}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'start'}
      >
        <Box display={'flex'} flexDirection={'column'}>
          <RowLayout gap={1}>
            <EditableTypography
              id={degreeFieldId || `education-degree-${ed._id}`}
              value={ed.degree || ''}
              onSave={(value) =>
                updateField({
                  _id: ed._id,
                  fieldName: 'degree',
                  value,
                })
              }
              variant="h6"
              isEditing={isEditing}
              sx={{
                textWrap: 'nowrap',
                alignItems: 'center',
              }}
            />
            <Typography variant={'h6'}>@</Typography>
            <EditableTypography
              id={nameFieldId || `education-name-${ed._id}`}
              value={ed.name}
              onSave={(value) =>
                updateField({
                  _id: ed._id,
                  fieldName: 'name',
                  value,
                })
              }
              variant="h6"
              isEditing={isEditing}
              sx={{
                textWrap: 'nowrap',
              }}
            />
          </RowLayout>

          <DescriptionTextSection
            id={descriptionFieldId || `education-description-${ed._id}`}
            isEditing={isEditing}
            value={ed.description}
            onSave={(value) =>
              updateField({
                _id: ed._id,
                fieldName: 'description',
                value,
              })
            }
          />
        </Box>

        <LocationAndDate
          id={ed._id}
          locationFieldId={locationFieldId}
          durationFieldId={durationFieldId}
          location={ed.location}
          duration={ed.duration}
          updateField={updateField}
          isEditing={isEditing}
        />
      </Box>

      <SkillsForItemizedEntryEditor
        id={skillsFieldId || `education-skills-${ed._id}`}
        isEditing={isEditing}
        entries={ed.skills ?? []}
        onSave={async (value) =>
          updateField({
            _id: ed._id,
            fieldName: 'skills',
            value: value.split(',').map((s) => s.trim()),
          })
        }
      />
    </Box>
  );
};
