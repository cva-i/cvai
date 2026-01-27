import { Box } from '../../../atoms';
import { Typography } from '../../../atoms/Typography/Typography';

export const CvGenerationLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      className="animate-pulse"
    >
      <Typography variant="body1" color="secondary">
        Transforming your CV
      </Typography>
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-primary opacity-60" />
      </div>
    </Box>
  );
};
