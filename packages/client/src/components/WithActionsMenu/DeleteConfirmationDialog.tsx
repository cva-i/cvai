import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';

type DeleteConfirmationDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> =
  React.memo(({ open, onConfirm, onCancel }) => {
    const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
        onCancel();
      }
    };

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });
