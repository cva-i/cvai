import { useMemo } from 'react';
import type { TypographyVariant } from './types';

interface UseMeasureTextWidthProps {
  text: string;
  variant: TypographyVariant;
}

/**
 * Typography variant to CSS font properties mapping.
 * These values match the Tailwind classes defined in Typography.tsx.
 */
interface TypographyStyles {
  fontSize: number;
  fontWeight: string | number;
  fontFamily: string;
  letterSpacing: string;
}

const typographyVariantStyles: Record<TypographyVariant, TypographyStyles> = {
  h1: {
    fontSize: 30, // text-3xl = 1.875rem = 30px
    fontWeight: 600, // font-semibold
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  h2: {
    fontSize: 24, // text-2xl = 1.5rem = 24px
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  h3: {
    fontSize: 20, // text-xl = 1.25rem = 20px
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  h4: {
    fontSize: 16, // text-base = 1rem = 16px
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  h5: {
    fontSize: 14, // text-sm = 0.875rem = 14px
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  h6: {
    fontSize: 12, // text-xs = 0.75rem = 12px
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  body1: {
    fontSize: 14, // text-sm
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  body2: {
    fontSize: 12, // text-xs
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  subtitle1: {
    fontSize: 14, // text-sm
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  subtitle2: {
    fontSize: 12, // text-xs
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  caption: {
    fontSize: 12, // text-xs
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: 'normal',
  },
  overline: {
    fontSize: 12, // text-xs
    fontWeight: 400,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: '0.1em', // tracking-wider
  },
};

export function useMeasureTextWidth({
  text,
  variant,
}: UseMeasureTextWidthProps): number {
  const { fontSize, fontWeight, fontFamily, letterSpacing } = useMemo(() => {
    const variantStyles = typographyVariantStyles[variant] || {
      fontSize: 14,
      fontWeight: 400,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      letterSpacing: 'normal',
    };

    return variantStyles;
  }, [variant]);

  // Use a single shared canvas for performance if desired, or create a new one each time.
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return 0;
    }

    // Set the font on the canvas context to match the typography variant exactly.
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    if (letterSpacing !== 'normal') {
      // measureText doesn't directly support letterSpacing, so we sum up the widths of
      // each character and add letterSpacing between them.
      let totalWidth = 0;
      const spacing = parseFloat(letterSpacing) * fontSize; // Convert em to px
      for (let i = 0; i < text.length; i++) {
        const charWidth = ctx.measureText(text[i]).width;
        totalWidth += charWidth + (i < text.length - 1 ? spacing : 0);
      }
      return totalWidth;
    } else {
      // Direct measurement if no letterSpacing is required
      return ctx.measureText(text).width;
    }
  }, [fontFamily, fontSize, fontWeight, letterSpacing, text]);
}
