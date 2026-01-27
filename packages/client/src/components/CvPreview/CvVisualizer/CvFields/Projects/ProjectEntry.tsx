import { Box, EditableTypography } from '../../../../atoms';
import type { CvEntryItemProps } from '../../types';
import {
  DescriptionTextSection,
  SkillsForItemizedEntryEditor,
} from '../../../components';
import { useFieldId } from '../../../../../contexts/CvMetadataContext';

export const ProjectEntry = ({
  entry: project,
  updateField,
  isEditing,
}: CvEntryItemProps<'projectEntries'>) => {
  const nameFieldId = useFieldId(`projectEntries.${project._id}.name`);
  const descriptionFieldId = useFieldId(
    `projectEntries.${project._id}.description`
  );
  const skillsFieldId = useFieldId(`projectEntries.${project._id}.skills`);

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <EditableTypography
        id={nameFieldId || `project-name-${project._id}`}
        value={project.name}
        onSave={(value) =>
          updateField({
            _id: project._id,
            fieldName: 'name',
            value,
          })
        }
        variant="h6"
        isEditing={isEditing}
      />

      <DescriptionTextSection
        id={descriptionFieldId || `project-description-${project._id}`}
        isEditing={isEditing}
        value={project.description}
        onSave={(value) =>
          updateField({
            _id: project._id,
            fieldName: 'description',
            value,
          })
        }
      />

      <SkillsForItemizedEntryEditor
        id={skillsFieldId || `project-skills-${project._id}`}
        isEditing={isEditing}
        entries={project.skills ?? []}
        onSave={async (value) =>
          updateField({
            _id: project._id,
            fieldName: 'skills',
            value: value.split(',').map((s) => s.trim()),
          })
        }
      />
    </Box>
  );
};
