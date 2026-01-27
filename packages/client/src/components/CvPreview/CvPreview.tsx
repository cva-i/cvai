import { useEffect } from 'react';
import { useCurrentCv, usePreviewMode } from '../../contexts';
import { CvVisualizer } from './CvVisualizer';
import { ActionButtonsContainer, CenteredBox } from '../atoms';
import { Typography } from '../atoms/Typography/Typography';
import { useCheckCvLazyQuery } from '../../generated/graphql';
import { PreviewModeButton } from '../PreviewButtonSection';
import { VersionControlButtons } from '../PreviewButtonSection/VersionControlButtons';
import { ClosePreviewButton } from '../PreviewButtonSection/ClosePreviewButton';
import { usePreviewEffects } from '../../hooks';
import { SuggestionsPanel } from './SuggestionsPanel';

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
    <div className="min-h-screen">
      <div className="flex justify-center py-8 px-4">
        <CvVisualizer cvId={cvId} />
      </div>

      {/* Floating Suggestions Panel */}
      {!isPreviewing && <SuggestionsPanel cvId={cvId} />}

      {/* Floating Action Buttons */}
      {!isPreviewing && (
        <div className="fixed right-4 bottom-4 z-[1100] bg-white rounded-xl p-2 shadow-lg">
          <ActionButtonsContainer>
            <VersionControlButtons />
            <PreviewModeButton />
          </ActionButtonsContainer>
        </div>
      )}

      <ClosePreviewButton />
    </div>
  );
};
