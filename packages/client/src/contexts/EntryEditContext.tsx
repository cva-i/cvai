import { createContext, useContext } from 'react';

interface EntryEditContextType {
  isEntryActive: boolean;
  deactivate?: () => void;
}

export const EntryEditContext = createContext<EntryEditContextType>({
  isEntryActive: false,
});

export function useEntryEdit() {
  return useContext(EntryEditContext);
}
