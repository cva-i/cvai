import { useCallback, useState } from 'react';
import { Plus, MessageSquare, Upload, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { IconButton } from '../atoms/IconButton';
import { Tooltip } from '../atoms/Tooltip';
import { ImportPdfDialog } from '../ImportCvDialog';
import { useDialog, useUser } from '../../contexts';
import { getUserDisplayName } from '../../utils/getUserDisplayName';

type QuickActionsPanelProps = {
  onExpand: () => void;
};

export const QuickActionsPanel = ({ onExpand }: QuickActionsPanelProps) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { open: openDialog } = useDialog();
  const { user } = useUser();

  const displayName = getUserDisplayName(user) ?? user.email;
  const initial = displayName.charAt(0).toUpperCase();

  const handleCreateNewCV = useCallback(() => {
    openDialog();
  }, [openDialog]);

  const handleImport = useCallback(() => {
    setImportDialogOpen(true);
  }, []);

  const handleOpenChat = useCallback(() => {
    onExpand();
  }, [onExpand]);

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-between">
        {/* Top Actions */}
        <div className="flex flex-col items-center gap-2">
          <IconButton
            onClick={onExpand}
            size="lg"
            title="Expand sidebar"
            className="h-12 w-12 rounded-xl"
          >
            <Menu />
          </IconButton>

          <IconButton
            onClick={handleCreateNewCV}
            size="lg"
            title="Create new CV"
            className="h-12 w-12 rounded-xl"
          >
            <Plus />
          </IconButton>

          <IconButton
            onClick={handleOpenChat}
            size="lg"
            title="Open chat"
            className="h-12 w-12 rounded-xl"
          >
            <MessageSquare />
          </IconButton>

          <IconButton
            onClick={handleImport}
            size="lg"
            title="Import resume"
            className="h-12 w-12 rounded-xl"
          >
            <Upload />
          </IconButton>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip title={displayName} placement="right">
            <Avatar className="h-12 w-12 cursor-pointer bg-primary transition-opacity hover:opacity-90">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Tooltip>
        </div>
      </div>

      <ImportPdfDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </>
  );
};
