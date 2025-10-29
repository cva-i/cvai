import React, { useCallback, useMemo, useEffect } from 'react';
import { Box, Divider, Skeleton } from '@mui/material';
import {
  AboutMe,
  ContactInfo,
  Education,
  Projects,
  Skills,
  WorkExperience,
} from './CvFields';
import { EditableTypography, RowLayout } from '../../atoms';
import {
  GetNameComponent,
  refetchGetCvVersionHistoryQuery,
  refetchGetNameQuery,
  useUpdateCvNameMutation,
  useGetCvQuery,
} from '../../../generated/graphql';
import { customPalette, shadowStyles } from '../../../theme';
import { usePreviewMode, useSuggestions } from '../../../contexts';
import { CvMetadataProvider } from '../../../contexts/CvMetadataContext';
import { SuggestionsPanel } from '../SuggestionsPanel';

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
    };

    if (isPreviewing) {
      return {
        ...baseStyles,
        width: '100%',
        maxWidth: '1200px',
        padding: '40px 60px',
        fontSize: '1.15em',
      };
    }

    return {
      ...baseStyles,
      margin: '0 auto',
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm 15mm',
      backgroundColor: customPalette.background.surface,
      boxShadow: shadowStyles.section.boxShadow,
    };
  }, [isPreviewing]);

  const wrapperStyles = useMemo(
    () =>
      isPreviewing
        ? {
            display: 'flex',
            justifyContent: 'center' as const,
            alignItems: 'flex-start' as const,
            width: '100vw',
            minHeight: '100vh',
            position: 'fixed' as const,
            left: 0,
            top: 0,
            paddingLeft: '65px',
          }
        : {},
    [isPreviewing]
  );

  const content = (
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

  return isPreviewing ? (
    <Box sx={wrapperStyles}>{content}</Box>
  ) : (
    <RowLayout>
      {content}
      <SuggestionsPanel cvId={cvId} />
    </RowLayout>
  );
};
