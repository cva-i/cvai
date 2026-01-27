import { Check } from 'lucide-react';
import { useStepper } from '../../hooks/use-stepper';
import type { StepperProps } from './types';
import { Box } from '../atoms';
import { Button } from '@ui/components/ui/button';
import { useCallback } from 'react';
import { cn } from '@ui/lib/utils';

interface StepIndicatorProps {
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
}

const StepIndicator = ({
  stepNumber,
  isActive,
  isCompleted,
}: StepIndicatorProps) => {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
        isCompleted && 'bg-primary text-primary-foreground',
        isActive && !isCompleted && 'bg-primary text-primary-foreground',
        !isActive && !isCompleted && 'bg-muted text-muted-foreground'
      )}
    >
      {isCompleted ? (
        <Check className="w-4 h-4" />
      ) : (
        <span>{stepNumber}</span>
      )}
    </div>
  );
};

interface StepConnectorProps {
  isCompleted: boolean;
}

const StepConnector = ({ isCompleted }: StepConnectorProps) => {
  return (
    <div
      className={cn(
        'flex-1 h-0.5 mx-2 transition-colors',
        isCompleted ? 'bg-primary' : 'bg-muted'
      )}
    />
  );
};

export const CvStepper = ({
  steps,
  onComplete,
  onCancel,
  initialStep,
}: StepperProps) => {
  const {
    currentStep,
    isValid,
    totalSteps,
    nextStep,
    prevStep,
    stepConfig: { component: CurrentStepComponent, onSubmit, ...stepConfig },
  } = useStepper(steps, initialStep);

  const handleNextStep = useCallback(() => {
    onSubmit?.();
    if (currentStep === totalSteps - 1) {
      onComplete();
    }
    nextStep();
  }, [currentStep, nextStep, onComplete, onSubmit, totalSteps]);

  return (
    <Box display="flex" flexDirection="column" height="500px">
      <div className="flex items-center p-6">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <StepIndicator
              stepNumber={index + 1}
              isActive={index === currentStep}
              isCompleted={index < currentStep}
            />
            {index < steps.length - 1 && (
              <StepConnector isCompleted={index < currentStep} />
            )}
          </div>
        ))}
      </div>

      <Box flex={1} p={3}>
        <CurrentStepComponent />
      </Box>

      <Box display="flex" justifyContent="between" p={3}>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>

        <Box display="flex" gap={2}>
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}

          <Button disabled={!isValid} onClick={handleNextStep}>
            {stepConfig.nextLabel ??
              (currentStep === totalSteps - 1 ? 'Complete' : 'Next')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
