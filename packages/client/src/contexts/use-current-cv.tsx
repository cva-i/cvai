import {
  createContext,
  use,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { tryCatchSync } from '../utils';

type CurrentCvContextType = {
  currentCvId: string | null;
  setCurrentCvId: (action: React.SetStateAction<null | string>) => void;
};

export const CURRENT_CV_KEY = 'currentCvId';

const CurrentCvContext = createContext<CurrentCvContextType | undefined>(
  undefined
);

export const CurrentCvProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentCvId, setCurrentCvIdState] = useState<string | null>(() => {
    if (!!window) {
      const [data, error] = tryCatchSync(() => localStorage.getItem(CURRENT_CV_KEY));
      if (error) {
        console.error('Failed to load currentCvId from localStorage:', error);
        return null;
      }
      return data;
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const [, error] = tryCatchSync(() => {
        if (currentCvId !== null) {
          localStorage.setItem(CURRENT_CV_KEY, currentCvId);
        } else {
          localStorage.removeItem(CURRENT_CV_KEY);
        }
      });

      if (error) {
        console.error('Failed to save currentCvId to localStorage:', error);
      }
    }
  }, [currentCvId]);

  const setCurrentCvId = useCallback(
    (setStateAction: React.SetStateAction<string | null>) => {
      setCurrentCvIdState(setStateAction);
    },
    []
  );

  const value = useMemo(
    () => ({
      currentCvId,
      setCurrentCvId,
    }),
    [currentCvId, setCurrentCvId]
  );

  return (
    <CurrentCvContext.Provider value={value}>
      {children}
    </CurrentCvContext.Provider>
  );
};

export const useCurrentCv = (): CurrentCvContextType => {
  const context = use(CurrentCvContext);
  if (!context) {
    throw new Error('useCurrentCv must be used within a CurrentCvProvider');
  }
  return context;
};
