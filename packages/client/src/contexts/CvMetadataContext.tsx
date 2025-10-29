import { createContext, useContext } from 'react';

interface CvMetadataContextType {
  metadata: any | null;
}

const CvMetadataContext = createContext<CvMetadataContextType | undefined>(undefined);

export function CvMetadataProvider({
  children,
  metadata
}: {
  children: React.ReactNode;
  metadata: any | null;
}) {
  return (
    <CvMetadataContext.Provider value={{ metadata }}>
      {children}
    </CvMetadataContext.Provider>
  );
}

export function useCvMetadata() {
  const context = useContext(CvMetadataContext);
  if (context === undefined) {
    throw new Error('useCvMetadata must be used within a CvMetadataProvider');
  }
  return context;
}

export function useFieldId(path: string): string | undefined {
  const { metadata } = useCvMetadata();
  if (!metadata) {
    return undefined;
  }

  const parts = path.split('.');
  let current = metadata;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!current) {
      return undefined;
    }

    current = current[part];
  }

  return current?.fieldId;
}
