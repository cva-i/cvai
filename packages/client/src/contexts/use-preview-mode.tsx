import type { PropsWithChildren } from 'react';
import { createContext, use, useState, useCallback } from 'react';

interface PreviewModeContextValue {
  isPreviewing: boolean;
  togglePreviewMode: () => void;
}

const PreviewModeContext = createContext<PreviewModeContextValue | undefined>(
  undefined
);

export const PreviewModeProvider = ({ children }: PropsWithChildren) => {
  const [isPreviewing, setIsPreviewing] = useState(false);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewing((prev) => !prev);
  }, []);

  return (
    <PreviewModeContext.Provider value={{ isPreviewing, togglePreviewMode }}>
      {children}
    </PreviewModeContext.Provider>
  );
};

export const usePreviewMode = (): PreviewModeContextValue => {
  const context = use(PreviewModeContext);
  if (!context) {
    throw new Error('usePreviewMode must be used within a PreviewModeProvider');
  }
  return context;
};
