import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@ui/components/ui/button';
import { cn } from '@ui/lib/utils';

interface AddButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
  ({ className, variant = 'outline', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          'border-2 border-primary bg-primary/20',
          'bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.2),rgba(115,115,196,0.4)_2px,transparent_2px,transparent_12px)]',
          'bg-blend-overlay',
          className
        )}
        {...props}
      >
        <Plus className="h-full text-primary" />
      </Button>
    );
  }
);

AddButton.displayName = 'AddButton';
