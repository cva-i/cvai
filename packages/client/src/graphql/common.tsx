import { Loader2 } from 'lucide-react';
import type { ReactElement } from 'react';

export interface BaseGqlComponentProps {
  redirectOnErrorUrl?: string;
  loader?: ReactElement;
  disableLoader?: boolean;
}

export const LoaderElement = () => (
  <div className="p-1">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);
