import React from 'react';
import { cn } from '@ui/lib/utils';
import { Tooltip } from './Tooltip';
import { cva, type VariantProps } from 'class-variance-authority';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'text-destructive hover:bg-destructive/10',
      },
      size: {
        default: 'h-9 w-9',
        sm: 'h-8 w-8',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  title: string;
  edge?: 'start' | 'end';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { children, title, className, variant, size, edge, disabled, ...props },
    ref
  ) => {
    const edgeClasses = {
      start: '-ml-2',
      end: '-mr-2',
    };

    const button = (
      <button
        ref={ref}
        className={cn(
          iconButtonVariants({ variant, size }),
          edge && edgeClasses[edge],
          '[&_svg]:text-primary-dark [&_svg]:h-5 [&_svg]:w-5',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );

    if (disabled) {
      return button;
    }

    return <Tooltip title={title}>{button}</Tooltip>;
  }
);

IconButton.displayName = 'IconButton';
