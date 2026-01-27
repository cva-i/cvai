import { Dialog, DialogContent } from '@ui/components/ui/dialog';
import { CvGenerationStep, DescriptionStep, TemplateStep } from './steps';
import { CvStepper } from './CvStepper';
import { useCvCreationFlow, useDialog } from '../../contexts';
import { useCallback, useMemo } from 'react';

export const CvCreationDialog = () => {
  const { isOpen, close } = useDialog();
  const { templateId, clearForm, createCv } = useCvCreationFlow();
  const initialStep = templateId ? 1 : 0;

  const steps = useMemo(
    () => [
      {
        component: TemplateStep,
        nextLabel: 'Use Template',
      },
      {
        component: DescriptionStep,
        nextLabel: 'Generate CV',
        onSubmit: () => {
          createCv();
        },
      },
      {
        component: CvGenerationStep,
        nextLabel: 'View CV',
      },
    ],
    [createCv]
  );

  const handleClose = useCallback(() => {
    close();
    clearForm();
  }, [clearForm, close]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <CvStepper
          steps={steps}
          onCancel={close}
          onComplete={close}
          initialStep={initialStep}
        />
      </DialogContent>
    </Dialog>
  );
};
