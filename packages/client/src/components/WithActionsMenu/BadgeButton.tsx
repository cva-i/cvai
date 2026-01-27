import React from 'react';
import { cn } from '@ui/lib/utils';

interface BadgeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
}

export const BadgeButton = React.forwardRef<HTMLButtonElement, BadgeButtonProps>(
  ({ isOpen, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'fixed top-1/2 left-0 z-[1201] rounded-[20px] bg-primary text-white',
          'hover:bg-primary-dark',
          'transition-all duration-200',
          'inline-flex items-center justify-center h-10 w-10',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          isOpen
            ? '-translate-x-1/2 -translate-y-1/2 rotate-180'
            : '-translate-x-1/2 -translate-y-1/2 rotate-0',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BadgeButton.displayName = 'BadgeButton';
