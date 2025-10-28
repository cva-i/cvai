import { useCallback, useState } from 'react';
import { Box, Button, styled } from '@mui/material';
import { environment } from '../environment';
import { FloatingSidebar } from './Sidebar';
import { CurrentCvPreview } from './CvPreview';
import { CenteredBox } from './atoms';
import {
  CurrentCvProvider,
  CurrentUserProvider,
  CvCreationFlowProvider,
  DialogProvider,
  PreviewModeProvider,
  useAuth,
} from '../contexts';
import { SuggestionsProvider } from '../contexts/use-suggestions';
import { CvCreationDialog } from './CreateCvFlow';
import { ClickOutsideHandler } from './ClickOutsideHandler';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  EXPANDED_SIDEBAR_WIDTH,
} from './Sidebar/FloatingSidebar';

export const LoginButton = () => {
  const handleLogin = useCallback(() => {
    const backendGoogleOAuthUrl = `${environment.apiUrl}/auth/google`;
    window.location.href = backendGoogleOAuthUrl;
  }, []);

  return (
    <Button variant={'outlined'} onClick={handleLogin}>
      Login with Google
    </Button>
  );
};

export const IndexPage = () => {
  const { user, logout } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  if (!user) {
    return (
      <CenteredBox sx={{ height: '100vh' }}>
        <LoginButton />
      </CenteredBox>
    );
  }

  return (
    <CurrentUserProvider user={user} logout={logout}>
      <CurrentCvProvider>
        <DialogProvider>
          <CvCreationFlowProvider>
            <PreviewModeProvider>
              <SuggestionsProvider>
                <ClickOutsideHandler>
                  <AppContainer>
                    <FloatingSidebar
                      isExpanded={isSidebarExpanded}
                      onToggle={setIsSidebarExpanded}
                    />
                    <MainContent isSidebarExpanded={isSidebarExpanded}>
                      <CurrentCvPreview />
                    </MainContent>
                  </AppContainer>
                </ClickOutsideHandler>
              </SuggestionsProvider>
            </PreviewModeProvider>

            <CvCreationDialog />
          </CvCreationFlowProvider>
        </DialogProvider>
      </CurrentCvProvider>
    </CurrentUserProvider>
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
