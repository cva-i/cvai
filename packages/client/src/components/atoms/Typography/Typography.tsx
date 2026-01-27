import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@ui/lib/utils';
import type { TypographyVariant } from './types';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl font-semibold',
      h2: 'text-2xl font-semibold',
      h3: 'text-xl font-semibold',
      h4: 'text-base font-semibold',
      h5: 'text-sm font-semibold',
      h6: 'text-xs font-semibold',
      body1: 'text-sm',
      body2: 'text-xs',
      subtitle1: 'text-sm',
      subtitle2: 'text-xs',
      caption: 'text-xs',
      overline: 'text-xs uppercase tracking-wider',
    },
    textColor: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      error: 'text-destructive',
      inherit: '',
    },
  },
  defaultVariants: {
    variant: 'body1',
    textColor: 'primary',
  },
});

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'error' | 'inherit';
  component?: React.ElementType;
}

const variantToElement: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  subtitle1: 'span',
  subtitle2: 'span',
  caption: 'span',
  overline: 'span',
};

type TextColor = 'primary' | 'secondary' | 'error' | 'inherit';

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = 'body1',
      color = 'primary',
      component,
      children,
      ...props
    },
    ref
  ) => {
    const Component = component || variantToElement[variant];
    const textColor = color as TextColor;

    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant, textColor }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';
