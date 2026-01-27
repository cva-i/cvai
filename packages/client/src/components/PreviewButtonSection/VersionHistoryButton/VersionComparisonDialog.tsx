import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { useGetCvQuery } from '../../../generated/graphql';
import { ColumnLayout } from '../../atoms';
import { VersionComparisonContent } from '../../VersionComparisonContent';
import { Typography } from '../../atoms/Typography/Typography';

interface VersionComparisonDialogProps {
  open: boolean;
  onClose: () => void;
  versionId: string;
  cvId: string;
}

export const VersionComparisonDialog = ({
  open,
  onClose,
  versionId,
  cvId,
}: VersionComparisonDialogProps) => {
  const {
    data: { getCv: leftCvData } = {},
    loading: leftCvLoading,
    error: leftCvError,
  } = useGetCvQuery({
    variables: {
      cvId,
      versionId,
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: { getCv: rightCvData } = {},
    loading: rightCvLoading,
    error: rightCvError,
  } = useGetCvQuery({
    variables: {
      cvId,
    },
    fetchPolicy: 'no-cache',
  });

  const isError = useMemo(
    () => !!leftCvError || !!rightCvError,
    [leftCvError, rightCvError]
  );
  const isLoading = useMemo(
    () => leftCvLoading || rightCvLoading,
    [leftCvLoading, rightCvLoading]
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-3xl"
        aria-labelledby="version-comparison-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="version-comparison-dialog-title">
            Version Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isError && (
            <ColumnLayout>
              <Typography className="text-destructive">
                {leftCvError?.message}
              </Typography>
              <Typography className="text-destructive">
                {rightCvError?.message}
              </Typography>
            </ColumnLayout>
          )}

          {isLoading && !isError && <Typography>Loading...</Typography>}

          {!!leftCvData && !!rightCvData && (
            <VersionComparisonContent left={leftCvData} right={rightCvData} />
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
