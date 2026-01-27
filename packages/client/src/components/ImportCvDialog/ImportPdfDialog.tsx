import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { FileUploader } from '../FileUploader';
import { toast } from 'react-toastify';
import {
  refetchGetCvsQuery,
  useConvertPdfToCvMutation,
} from '../../generated/graphql';

interface ImportPdfDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ImportPdfDialog = ({ open, onClose }: ImportPdfDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [convertPdfToCv, { loading }] = useConvertPdfToCvMutation({
    refetchQueries: [refetchGetCvsQuery()],
    context: {
      hasUpload: true,
    },
  });

  const handleFileUploaded = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleConvert = async () => {
    if (!file) return;

    await convertPdfToCv({
      variables: { file },
    })
      .then(({ data }) => {
        const comment = data?.convertPdfToCv.comment;
        // TODO: add the logic (e.g notifications or modal text) for displaying the comment
        if (comment) {
          toast.success(comment);
        }
      })
      .catch()
      .finally(() => {});

    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import PDF CV</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FileUploader
            onFileUploaded={handleFileUploaded}
            acceptedFileTypes="application/pdf"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={!file || loading}>
            {loading ? 'Converting...' : 'Convert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
