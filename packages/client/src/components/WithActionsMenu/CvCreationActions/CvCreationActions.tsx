import { useState } from 'react';
import { Button } from '@ui/components/ui/button';
import { ImportPdfDialog } from '../../ImportCvDialog';
import { useDialog } from '../../../contexts';

export const CvCreationActions = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { open: openDialog } = useDialog();

  return (
    <>
      <div className="flex flex-row justify-evenly gap-4 p-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={() => setImportDialogOpen(true)}
        >
          Import PDF
        </Button>

        <Button variant="default" className="flex-1" onClick={() => openDialog()}>
          Create with LLM
        </Button>
      </div>

      <ImportPdfDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </>
  );
};
