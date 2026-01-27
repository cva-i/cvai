import React from 'react';
import { cn } from '@ui/lib/utils';

interface ActionButtonsContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ActionButtonsContainer = React.forwardRef<
  HTMLDivElement,
  ActionButtonsContainerProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-row flex-shrink-0 gap-2', className)}
    {...props}
  />
));

ActionButtonsContainer.displayName = 'ActionButtonsContainer';
