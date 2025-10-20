import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useActionState, useCallback } from 'react';

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
      prevState: RenameState,
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form action={submitAction}>
        <DialogTitle>Rename CV</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="CV Name"
            type="text"
            fullWidth
            defaultValue={initialName}
            error={!!state.error}
            helperText={state.error}
            disabled={isPending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={isPending}>
            {isPending ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
