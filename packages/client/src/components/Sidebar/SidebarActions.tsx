import { useState } from 'react';
import { Plus, Upload, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { Typography } from '../atoms/Typography/Typography';
import { ImportPdfDialog } from '../ImportCvDialog';
import { useDialog, useCurrentCv, useSuggestions } from '../../contexts';

export const SidebarActions = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { open: openDialog } = useDialog();
  const { currentCvId } = useCurrentCv();
  const { generateSuggestions, isGenerating } = useSuggestions();

  const handleGenerateSuggestions = async () => {
    if (!currentCvId || isGenerating) {
      return;
    }
    await generateSuggestions(currentCvId);
  };

  return (
    <>
      <div className="flex w-full shrink-0 flex-col">
        {/* Create New CV */}
        <div
          className="flex cursor-pointer items-center rounded-xl px-2 py-3 transition-colors duration-150 hover:bg-accent"
          onClick={() => openDialog()}
        >
          <div className="flex flex-1 items-center gap-2">
            <Plus className="h-4 w-4 text-primary-dark" />
            <Typography variant="body2" className="flex-1">
              Create New CV from this one
            </Typography>
          </div>
        </div>

        {/* Generate AI Suggestions */}
        <div
          className={cn(
            'flex items-center rounded-xl px-2 py-3 transition-colors duration-150',
            isGenerating || !currentCvId
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer hover:bg-accent'
          )}
          onClick={handleGenerateSuggestions}
        >
          <div className="flex flex-1 items-center gap-2">
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary-dark" />
            ) : (
              <Sparkles className="h-4 w-4 text-primary-dark" />
            )}
            <Typography variant="body2" className="flex-1">
              {isGenerating
                ? 'Generating suggestions...'
                : 'Generate AI Suggestions'}
            </Typography>
          </div>
        </div>

        {/* Import Resume */}
        <div
          className="flex cursor-pointer items-center rounded-xl px-2 py-3 transition-colors duration-150 hover:bg-accent"
          onClick={() => setImportDialogOpen(true)}
        >
          <div className="flex flex-1 items-center gap-2">
            <Upload className="h-4 w-4 text-primary-dark" />
            <Typography variant="body2" className="flex-1">
              Import resume
            </Typography>
          </div>
        </div>
      </div>

      <ImportPdfDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </>
  );
};
