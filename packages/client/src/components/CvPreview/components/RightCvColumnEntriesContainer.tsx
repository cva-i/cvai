import React from 'react';
import { cn } from '@ui/lib/utils';

interface RightCvColumnEntriesContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const RightCvColumnEntriesContainer = ({
  children,
  className,
  ...props
}: RightCvColumnEntriesContainerProps) => {
  return (
    <div
      className={cn('flex flex-col text-right items-end', className)}
      {...props}
    >
      {children}
    </div>
  );
};
