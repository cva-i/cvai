import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@ui/lib/utils';
import { Typography, type TypographyProps } from './Typography';

type TypographyWithMarkdownProps = TypographyProps & {
  children: Parameters<typeof ReactMarkdown>[0]['children'];
};

export const TypographyWithMarkdown = forwardRef<
  HTMLDivElement,
  TypographyWithMarkdownProps
>(
  (
    { children, variant = 'body1', className, onClick, color, ...otherProps },
    ref
  ) => {
    // Extract textAlign from className or style if it exists
    const textAlignMatch = className?.match(/text-(left|center|right|justify)/);
    const textAlign = textAlignMatch ? textAlignMatch[0] : undefined;

    return (
      <ReactMarkdown
        components={{
          p: ({ node, ref: _ref, color: _color, ...props }) => {
            // Filter out any HTML color attributes from props to avoid conflicts
            const { style, ...restProps } = props;
            return (
              <Typography
                variant={variant}
                color={color}
                className={cn(textAlign, className)}
                onClick={onClick}
                ref={ref}
                {...otherProps}
                {...restProps}
              />
            );
          },
          strong: ({ node, ref: _, ...props }) => <strong {...props} />,
          em: ({ node, ref: _, ...props }) => <em {...props} />,
          a: ({ node, ref: _, ...props }) => (
            <a className={cn('text-primary underline', className)} {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    );
  }
);

TypographyWithMarkdown.displayName = 'TypographyWithMarkdown';
