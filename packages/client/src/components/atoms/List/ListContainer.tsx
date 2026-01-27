import type { ReactNode } from 'react';
import React from 'react';
import { cn } from '@ui/lib/utils';

interface ListContainerProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  headerComponent?: ReactNode;
  className?: string;
}

export const ListContainer: React.FC<ListContainerProps> = ({
  children,
  width = '100%',
  height = '100%',
  headerComponent,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden bg-transparent',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {headerComponent}
      {children}
    </div>
  );
};
