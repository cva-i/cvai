import { useCvCreationFlow } from '../../../../contexts';
import { match } from 'ts-pattern';
import { Box } from '../../../atoms';
import { CvGenerationLoading } from './CvGenerationLoading';
import { CvGenerationResult } from './CvGenerationResult';

export const CvGenerationStep = () => {
  const { cvGenerationResult } = useCvCreationFlow();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      className="py-16 min-h-[200px]"
    >
      {match(cvGenerationResult)
        .with({ status: 'loading' }, () => <CvGenerationLoading />)
        .with({ status: 'success' }, (data) => <CvGenerationResult {...data} />)
        .with({ status: 'error' }, (data) => <CvGenerationResult {...data} />)
        .otherwise(() => (
          <div>Generation hasn't been started yet</div>
        ))}
    </Box>
  );
};
