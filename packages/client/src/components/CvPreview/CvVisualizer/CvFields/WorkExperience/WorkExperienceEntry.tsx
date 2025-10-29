import React from 'react';
import { Box, Typography } from '@mui/material';
import { EditableTypography, RowLayout } from '../../../../atoms';
import type { CvEntryItemProps } from '../../types';
import {
  DescriptionTextSection,
  JobTypeTextSection,
  SkillsForItemizedEntryEditor,
} from '../../../components';
import { LocationAndDate } from './LocationAndDate';
import { useFieldId } from '../../../../../contexts/CvMetadataContext';

export const WorkExperienceEntry = ({
  entry: we,
  updateField,
  isEditing,
}: CvEntryItemProps<'workExperienceEntries'>) => {
  const positionFieldId = useFieldId(`workExperienceEntries.${we._id}.position`);
  const nameFieldId = useFieldId(`workExperienceEntries.${we._id}.name`);
  const typeFieldId = useFieldId(`workExperienceEntries.${we._id}.type`);
  const locationFieldId = useFieldId(`workExperienceEntries.${we._id}.location`);
  const durationFieldId = useFieldId(`workExperienceEntries.${we._id}.duration`);
  const descriptionFieldId = useFieldId(`workExperienceEntries.${we._id}.description`);
  const skillsFieldId = useFieldId(`workExperienceEntries.${we._id}.skills`);

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
              id={positionFieldId || `we-position-${we._id}`}
              value={we.position}
              onSave={(value) =>
                updateField({
                  _id: we._id,
                  fieldName: 'position',
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
              id={nameFieldId || `we-name-${we._id}`}
              value={we.name}
              onSave={(value) =>
                updateField({
                  _id: we._id,
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
          {/* </WithRemoveEntryButton>*/}

          <JobTypeTextSection
            id={typeFieldId || `we-type-${we._id}`}
            value={we.type}
            isEditing={isEditing}
            onSave={(value) =>
              updateField({
                _id: we._id,
                fieldName: 'type',
                value,
              })
            }
          />
        </Box>

        <LocationAndDate
          id={we._id}
          locationFieldId={locationFieldId}
          durationFieldId={durationFieldId}
          location={we.location}
          duration={we.duration}
          updateField={updateField}
          isEditing={isEditing}
        />
      </Box>

      <DescriptionTextSection
        id={descriptionFieldId || `we-description-${we._id}`}
        isEditing={isEditing}
        value={we.description}
        onSave={(value) =>
          updateField({
            _id: we._id,
            fieldName: 'description',
            value,
          })
        }
      />

      <SkillsForItemizedEntryEditor
        id={skillsFieldId || `we-skills-${we._id}`}
        isEditing={isEditing}
        entries={we.skills ?? []}
        onSave={async (value) =>
          updateField({
            _id: we._id,
            fieldName: 'skills',
            value: value.split(',').map((s) => s.trim()),
          })
        }
      />
    </Box>
  );
};
