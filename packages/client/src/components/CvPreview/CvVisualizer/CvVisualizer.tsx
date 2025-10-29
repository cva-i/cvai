import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Divider, Skeleton } from '@mui/material';
import {
  AboutMe,
  ContactInfo,
  Education,
  Projects,
  Skills,
  WorkExperience,
} from './CvFields';
import { EditableTypography } from '../../atoms';
import {
  GetNameComponent,
  refetchGetCvVersionHistoryQuery,
  refetchGetNameQuery,
  useGetCvQuery,
  useUpdateCvNameMutation,
} from '../../../generated/graphql';
import { customPalette, shadowStyles } from '../../../theme';
import { usePreviewMode, useSuggestions } from '../../../contexts';
import { CvMetadataProvider } from '../../../contexts/CvMetadataContext';

type CvVisualizerProps = {
  cvId: string;
};

export const CvVisualizer = ({ cvId }: CvVisualizerProps) => {
  const { isPreviewing } = usePreviewMode();
  const { fetchSuggestions } = useSuggestions();
  const { data: cvData } = useGetCvQuery({ variables: { cvId } });

  const [updateNameMutation] = useUpdateCvNameMutation({
    refetchQueries: [
      refetchGetCvVersionHistoryQuery({ cvId }),
      refetchGetNameQuery({ cvId }),
    ],
  });

  // Fetch suggestions when CV loads
  useEffect(() => {
    function loadSuggestions() {
      if (cvId && !isPreviewing) {
        fetchSuggestions(cvId);
      }
    }
    loadSuggestions();
  }, [cvId, isPreviewing, fetchSuggestions]);

  const handleUpdateName = useCallback(
    async (name: string) => {
      await updateNameMutation({ variables: { cvId, name } });
    },
    [cvId, updateNameMutation]
  );

  const contentBoxStyles = useMemo(() => {
    const baseStyles = {
      gap: '12px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-start' as const,
      fontSize: '1.15em',
      margin: '0 auto',
      padding: '20px 15px',
    };

    return isPreviewing
      ? {
          ...baseStyles,
          height: 'fit-content',
          width: '100%',
          maxWidth: '1200px',
        }
      : {
          ...baseStyles,
          height: '100vh',
          overflowY: 'auto',
          width: '300mm',
          minHeight: '297mm',
          backgroundColor: customPalette.background.surface,
          boxShadow: shadowStyles.section.boxShadow,
        };
  }, [isPreviewing]);

  return (
    <CvMetadataProvider metadata={cvData?.getCv?.metadata ?? null}>
      <Box sx={contentBoxStyles}>
        <GetNameComponent variables={{ cvId }}>
          {({ data }) => {
            const name = data?.getCv.name;
            if (!name) {
              return <Skeleton variant="text" width={'100%'} height={40} />;
            }
            return (
              <EditableTypography
                id={'cv-name'}
                value={name}
                onSave={handleUpdateName}
                variant="h3"
                sx={{
                  textAlign: 'center',
                }}
              />
            );
          }}
        </GetNameComponent>

        <ContactInfo cvId={cvId} />

        <AboutMe cvId={cvId} />

        <Divider />

        <WorkExperience cvId={cvId} />

        <Divider />

        <Projects cvId={cvId} />

        <Divider />

        <Education cvId={cvId} />

        <Divider />

        <Skills cvId={cvId} />
      </Box>
    </CvMetadataProvider>
  );
};
