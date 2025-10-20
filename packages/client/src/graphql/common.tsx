import { Box, CircularProgress } from '@mui/material';
import type { ReactElement } from 'react';

export interface BaseGqlComponentProps {
  redirectOnErrorUrl?: string;
  loader?: ReactElement;
  disableLoader?: boolean;
}

export const LoaderElement = () => (
  <Box p={1}>
    <CircularProgress />
  </Box>
);
