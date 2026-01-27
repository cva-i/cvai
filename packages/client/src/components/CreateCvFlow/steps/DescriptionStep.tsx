import { Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';
import { Textarea } from '@ui/components/ui/textarea';
import { Label } from '@ui/components/ui/label';
import { Typography } from '../../atoms/Typography/Typography';
import { useCvCreationFlow } from '../../../contexts';

export const DescriptionStep = () => {
  const { templateCvSummarization, prompt, setPrompt } = useCvCreationFlow();

  return (
    <div className="flex flex-col gap-6 h-full">
      <Accordion type="single" collapsible>
        <AccordionItem value="summary">
          <AccordionTrigger>
            <Typography variant="body1">Selected Template Summary</Typography>
          </AccordionTrigger>
          <AccordionContent>
            <Typography variant="body2" className="whitespace-pre-wrap">
              {templateCvSummarization}
            </Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="relative">
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-description">Job Description & Requirements</Label>
          <Textarea
            id="job-description"
            className="min-h-[150px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the job description or requirements..."
          />
        </div>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="absolute top-0 right-0 p-1 text-primary-dark hover:text-primary transition-colors"
                aria-label="Information about job description field"
              >
                <Info className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="start"
              className="max-w-xs bg-background-paper border border-border p-3"
            >
              <Typography variant="body2">
                You can copy and paste the job position you want to fine-tune
                your CV for. Alternatively, you can specify desired changes or
                improvements you'd like to make to your CV format. Include any
                specific requirements or preferences for the final document.
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
