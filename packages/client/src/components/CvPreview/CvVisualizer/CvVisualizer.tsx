import { useCallback, useEffect } from 'react';
import { Separator } from '@ui/components/ui/separator';
import {
  AboutMe,
  ContactInfo,
  Education,
  Projects,
  Skills,
  WorkExperience,
} from './CvFields';
import { EditableTypography } from '../../atoms';
import {
  GetNameComponent,
  refetchGetCvVersionHistoryQuery,
  refetchGetNameQuery,
  useGetCvQuery,
  useUpdateCvNameMutation,
} from '../../../generated/graphql';
import { usePreviewMode, useSuggestions } from '../../../contexts';
import { CvMetadataProvider } from '../../../contexts/CvMetadataContext';
import { cn } from '@ui/lib/utils';

type CvVisualizerProps = {
  cvId: string;
};

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'animate-pulse bg-gray-200 rounded',
      className
    )}
  />
);

export const CvVisualizer = ({ cvId }: CvVisualizerProps) => {
  const { isPreviewing } = usePreviewMode();
  const { fetchSuggestions } = useSuggestions();
  const { data: cvData } = useGetCvQuery({ variables: { cvId } });

  const [updateNameMutation] = useUpdateCvNameMutation({
    refetchQueries: [
      refetchGetCvVersionHistoryQuery({ cvId }),
      refetchGetNameQuery({ cvId }),
    ],
  });

  // Fetch suggestions when CV loads
  useEffect(() => {
    function loadSuggestions() {
      if (cvId && !isPreviewing) {
        fetchSuggestions(cvId);
      }
    }
    loadSuggestions();
  }, [cvId, isPreviewing, fetchSuggestions]);

  const handleUpdateName = useCallback(
    async (name: string) => {
      await updateNameMutation({ variables: { cvId, name } });
    },
    [cvId, updateNameMutation]
  );

  return (
    <CvMetadataProvider metadata={cvData?.getCv?.metadata ?? null}>
      <div
        className={cn(
          'flex flex-col gap-3 mx-auto text-[1.15em]',
          isPreviewing
            ? 'h-fit w-full max-w-[1200px] py-5 px-4'
            : 'cv-paper w-[210mm] min-h-[297mm] h-fit py-8 px-6'
        )}
      >
        <GetNameComponent variables={{ cvId }}>
          {({ data }) => {
            const name = data?.getCv.name;
            if (!name) {
              return <Skeleton className="w-full h-10" />;
            }
            return (
              <EditableTypography
                id={'cv-name'}
                value={name}
                onSave={handleUpdateName}
                variant="h3"
                className="text-center"
              />
            );
          }}
        </GetNameComponent>

        <ContactInfo cvId={cvId} />

        <AboutMe cvId={cvId} />

        <Separator />

        <WorkExperience cvId={cvId} />

        <Separator />

        <Projects cvId={cvId} />

        <Separator />

        <Education cvId={cvId} />

        <Separator />

        <Skills cvId={cvId} />
      </div>
    </CvMetadataProvider>
  );
};
