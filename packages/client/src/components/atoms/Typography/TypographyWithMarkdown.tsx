import React, { forwardRef } from 'react';
import type { TypographyProps } from '@mui/material';
import { Typography, Link } from '@mui/material';
import ReactMarkdown from 'react-markdown';

type TypographyWithMarkdownProps = TypographyProps & {
  children: Parameters<typeof ReactMarkdown>[0]['children'];
};

export const TypographyWithMarkdown = forwardRef<
  HTMLDivElement,
  TypographyWithMarkdownProps
>(({ children, variant = 'body1', sx, onClick, ...otherProps }, ref) => {
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ref: _, ...props }) => (
          <Typography
            variant={variant}
            sx={sx}
            onClick={onClick}
            ref={ref}
            {...otherProps}
            {...props}
          />
        ),
        strong: ({ node, ref: _, ...props }) => <strong {...props} />,
        em: ({ node, ref: _, ...props }) => <em {...props} />,
        a: ({ node, ref: _, ...props }) => <Link {...props} sx={sx} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
});
