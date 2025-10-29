import { ThemeProvider } from '@emotion/react';
import { IndexPage } from './components/IndexPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './theme';
import { apolloClient } from './clients';
import {
  AuthProvider,
  CurrentCvProvider,
  CurrentUserProvider,
  CvCreationFlowProvider,
  DialogProvider,
  PreviewModeProvider,
  SuggestionsProvider,
  useAuth,
} from './contexts';
import { useCallback } from 'react';
import { environment } from './environment';
import { Button, CssBaseline } from '@mui/material';
import { CenteredBox } from './components';
import { ClickOutsideHandler } from './components';
import { CvCreationDialog } from './components';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

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

const AppInternal = () => {
  const { user, logout } = useAuth();
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
                  <IndexPage />
                  <ToastContainer
                    position={'bottom-left'}
                    toastStyle={{
                      height: '24px',
                    }}
                  />
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppInternal />
          </BrowserRouter>
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;
