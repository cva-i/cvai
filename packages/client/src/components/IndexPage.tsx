import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import { FloatingSidebar } from './Sidebar';
import { CurrentCvPreview } from './CvPreview';
import { usePreviewMode } from '../contexts';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  EXPANDED_SIDEBAR_WIDTH,
} from './Sidebar/FloatingSidebar';

export const IndexPage = () => {
  const { isPreviewing } = usePreviewMode();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <AppContainer>
      <FloatingSidebar
        isExpanded={isSidebarExpanded}
        onToggle={setIsSidebarExpanded}
      />
      <MainContent
        isSidebarExpanded={isSidebarExpanded}
        sx={isPreviewing ? { margin: '0 auto', padding: 0 } : {}}
      >
        <CurrentCvPreview />
      </MainContent>
    </AppContainer>
  );
};

const AppContainer = styled(Box)({
  display: 'flex',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
});

const MainContent = styled(Box)<{ isSidebarExpanded: boolean }>(
  ({ isSidebarExpanded }) => ({
    flex: 1,
    marginLeft: isSidebarExpanded
      ? EXPANDED_SIDEBAR_WIDTH + 48
      : COLLAPSED_SIDEBAR_WIDTH + 48,
    transition: 'margin 0.3s ease',
    overflow: 'auto',
  })
);
