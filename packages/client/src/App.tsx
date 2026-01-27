import { IndexPage } from './components/IndexPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { ChatProvider } from './contexts/use-chat';
import { useCallback } from 'react';
import { environment } from './environment';
import { Button } from '@ui/components/ui/button';
import {
  CenteredBox,
  ClickOutsideHandler,
  CvCreationDialog,
} from './components';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

export const LoginButton = () => {
  const handleGoogleLogin = useCallback(() => {
    const backendGoogleOAuthUrl = `${environment.apiUrl}/auth/google`;
    window.location.href = backendGoogleOAuthUrl;
  }, []);

  return (
    <Button variant="outline" onClick={handleGoogleLogin}>
      Login with Google
    </Button>
  );
};

const AppInternal = () => {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <CenteredBox className="h-screen flex-col gap-8">
        {/*<LoginForm />*/}
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
                <ChatProvider>
                  <ClickOutsideHandler>
                    <IndexPage />
                    <ToastContainer
                      position={'bottom-left'}
                      toastStyle={{
                        height: '24px',
                      }}
                    />
                  </ClickOutsideHandler>
                </ChatProvider>
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
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppInternal />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
