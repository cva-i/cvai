import React from 'react';
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';

export interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Tooltip = ({
  title,
  children,
  placement = 'top',
  open,
  onOpenChange,
}: TooltipProps) => {
  // Map placement to side
  const sideMap: Record<string, 'top' | 'right' | 'bottom' | 'left'> = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
  };

  return (
    <TooltipProvider delayDuration={300}>
      <TooltipPrimitive open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={sideMap[placement]}>
          <span className="text-sm text-foreground">{title}</span>
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
};
