import { Box, TypographyWithMarkdown } from '../../../atoms';
import { cn } from '@ui/lib/utils';

export const CvGenerationResult = ({
  status,
  message,
}: {
  status: 'error' | 'success';
  message: string;
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      className="origin-top animate-in fade-in zoom-in-95 duration-300"
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" flexDirection="column" className="content-start">
          <TypographyWithMarkdown
            className={cn(
              'max-w-[500px] px-2 animate-in fade-in zoom-in-95 duration-300',
              status === 'error' ? 'text-destructive' : 'text-foreground'
            )}
          >
            {message}
          </TypographyWithMarkdown>
        </Box>
      </Box>
    </Box>
  );
};
