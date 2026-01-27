import { useActionState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';

type RenameDialogProps = {
  open: boolean;
  onClose: () => void;
  initialName: string;
  onRename: (newName: string) => void;
};

type RenameState = {
  name: string;
  error?: string;
};

// React 19: Using form actions with useActionState
export const RenameDialog = ({
  open,
  onClose,
  initialName,
  onRename,
}: RenameDialogProps) => {
  // React 19: useCallback needed to prevent stale closures in useActionState
  const handleRenameAction = useCallback(
    async (
      _prevState: RenameState,
      formData: FormData
    ): Promise<RenameState> => {
      const newName = formData.get('name') as string;

      if (!newName.trim()) {
        return { name: newName, error: 'Name cannot be empty' };
      }

      if (newName === initialName) {
        return { name: newName, error: 'Name must be different' };
      }

      onRename(newName);
      onClose();
      return { name: newName };
    },
    [initialName, onRename, onClose]
  );

  const [state, submitAction, isPending] = useActionState(handleRenameAction, {
    name: initialName,
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form action={submitAction}>
          <DialogHeader>
            <DialogTitle>Rename CV</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">CV Name</Label>
              <Input
                autoFocus
                id="name"
                name="name"
                type="text"
                defaultValue={initialName}
                disabled={isPending}
                className={state.error ? 'border-destructive' : ''}
              />
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
