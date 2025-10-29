import React from 'react';
import type { CvEntryComponentProps, UpdateFieldProps } from '../types';
import {
  GetAboutMeComponent,
  refetchGetAboutMeQuery,
  refetchGetCvVersionHistoryQuery,
  useUpdateCvMutation,
} from '../../../../generated/graphql';
import { Typography } from '@mui/material';
import { EditableTypography } from '../../../atoms';
import { WithEditableSection } from '../../components';
import { useFieldId } from '../../../../contexts/CvMetadataContext';

export const AboutMe = ({ cvId }: CvEntryComponentProps) => {
  const titleFieldId = useFieldId('aboutMe.title');
  const descriptionFieldId = useFieldId('aboutMe.description');
  const [updateAboutMe] = useUpdateCvMutation({
    refetchQueries: [
      refetchGetAboutMeQuery({
        cvId,
      }),
      refetchGetCvVersionHistoryQuery({
        cvId,
      }),
    ],
  });

  return (
    <GetAboutMeComponent variables={{ cvId }}>
      {({ data: { getCv: { aboutMe } = {} } = {}, loading }) => {
        if (loading && !aboutMe) {
          return <Typography>Loading...</Typography>;
        }

        if (!aboutMe) {
          return <Typography>About me is empty</Typography>;
        }

        const updateField = async ({
          fieldName,
          value,
        }: UpdateFieldProps<'aboutMe'>) => {
          await updateAboutMe({
            variables: {
              cvId,
              data: {
                aboutMe: {
                  [fieldName]: value,
                },
              },
            },
          });
        };

        return (
          <WithEditableSection flexDirection="column">
            {/* <EditableTypography*/}
            {/*  id={titleFieldId ?? `about-me-fieldName`}*/}
            {/*  value={aboutMe.fieldName}*/}
            {/*  onSave={(value) =>*/}
            {/*    updateField({*/}
            {/*      fieldName: 'fieldName',*/}
            {/*      value,*/}
            {/*    })*/}
            {/*  }*/}
            {/*  variant="h5"*/}
            {/*  gutterBottom*/}
            {/* />*/}

            <EditableTypography
              id={descriptionFieldId ?? `about-me-description`}
              value={aboutMe.description}
              onSave={(value) =>
                updateField({
                  fieldName: 'description',
                  value,
                })
              }
              multiline
              variant="body1"
            />
          </WithEditableSection>
        );
      }}
    </GetAboutMeComponent>
  );
};
