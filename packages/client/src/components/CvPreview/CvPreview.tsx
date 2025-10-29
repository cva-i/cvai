import React, { useEffect } from 'react';
import { Box, styled, Typography } from '@mui/material';
import { useCurrentCv, usePreviewMode } from '../../contexts';
import { CvVisualizer } from './CvVisualizer';
import { ActionButtonsContainer, CenteredBox, RowLayout } from '../atoms';
import { useCheckCvLazyQuery } from '../../generated/graphql';
import { PreviewModeButton } from '../PreviewButtonSection';
import { VersionControlButtons } from '../PreviewButtonSection/VersionControlButtons';
import { ClosePreviewButton } from '../PreviewButtonSection/ClosePreviewButton';
import { usePreviewEffects } from '../../hooks';
import { SuggestionsPanel } from './SuggestionsPanel';

const RightSideContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 32px)',
  gap: 8,
  justifyContent: 'space-between',
});

export const CurrentCvPreview = () => {
  const { currentCvId } = useCurrentCv();
  const { isPreviewing } = usePreviewMode();

  usePreviewEffects();

  const [fetchCvFunction, { loading, error, data }] = useCheckCvLazyQuery();

  useEffect(() => {
    if (!currentCvId) {
      return;
    }
    fetchCvFunction({
      variables: {
        cvId: currentCvId,
      },
    }).catch(() => {
      /* ignore */
    });
  }, [fetchCvFunction, currentCvId]);

  useEffect(() => {
    if (data?.getCv?.title) {
      document.title = data.getCv.title;
    }

    return () => {
      document.title = 'CV Builder';
    };
  }, [data?.getCv?.title]);

  if (loading) {
    return <CenteredBox>Loading...</CenteredBox>;
  }
  if (error) {
    return (
      <CenteredBox>
        <Typography variant="h6" color="error">
          {error.message}
        </Typography>
      </CenteredBox>
    );
  }
  if (!data) {
    return <CenteredBox>No CV selected</CenteredBox>;
  }
  const cvId = data.getCv._id;
  return (
    <Box
      sx={{
        padding: 2,
      }}
    >
      <RowLayout sx={{ alignItems: 'flex-start', overflow: 'visible' }}>
        <CvVisualizer cvId={cvId} />
        {!isPreviewing && (
          <RightSideContainer>
            <SuggestionsPanel cvId={cvId} />
            <ActionButtonsContainer>
              <VersionControlButtons />
              <PreviewModeButton />
            </ActionButtonsContainer>
          </RightSideContainer>
        )}
      </RowLayout>

      <ClosePreviewButton />
    </Box>
  );
};
