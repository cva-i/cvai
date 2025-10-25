import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

type EmptyLabelProps = {
  variant?: TypographyProps['variant'];
  sx?: TypographyProps['sx'];
  onClick?: () => void;
};

export const EmptyLabel = ({
  variant = 'body2',
  sx,
  onClick,
}: EmptyLabelProps) => {
  return (
    <Typography
      variant={variant}
      color="text.secondary"
      sx={{
        fontStyle: 'italic',
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      onClick={onClick}
    >
      (empty)
    </Typography>
  );
};
