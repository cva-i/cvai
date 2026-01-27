import React from 'react';
import { ColumnLayout, EditableTypography } from '../../../../atoms';
import type { CvEntryItemProps } from '../../types';
import { useFieldId } from '../../../../../contexts/CvMetadataContext';

export const ContactInfoEntry = ({
  entry: contactInfo,
  updateField,
  isEditing,
}: CvEntryItemProps<'contactInfoEntries'>) => {
  const linkNameFieldId = useFieldId(
    `contactInfoEntries.${contactInfo._id}.linkName`
  );
  const linkFieldId = useFieldId(`contactInfoEntries.${contactInfo._id}.link`);

  return (
    <ColumnLayout>
      <EditableTypography
        id={linkNameFieldId || `contactInfo-linkName-${contactInfo._id}`}
        value={contactInfo.linkName}
        onSave={(value) =>
          updateField({
            _id: contactInfo._id,
            fieldName: 'linkName',
            value,
          })
        }
        variant="body1"
        isEditing={isEditing}
        className="text-center"
      />

      {/* TODO: make it actually a link */}
      <EditableTypography
        id={linkFieldId || `contactInfo-link-${contactInfo._id}`}
        value={contactInfo.link}
        onSave={(value) =>
          updateField({
            _id: contactInfo._id,
            fieldName: 'link',
            value,
          })
        }
        variant="body2"
        isEditing={isEditing}
        className="text-primary whitespace-nowrap"
      />
    </ColumnLayout>
  );
};
