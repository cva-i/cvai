import { useCallback, useState } from 'react';
import { Avatar, Box, IconButton, styled, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MenuIcon from '@mui/icons-material/Menu';
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
      <QuickActionsContainer>
        <TopActions>
          <ActionButton onClick={onExpand} size="large">
            <MenuIcon />
          </ActionButton>

          <ActionButton onClick={handleCreateNewCV} size="large">
            <AddIcon />
          </ActionButton>

          <ActionButton onClick={handleOpenChat} size="large">
            <ChatIcon />
          </ActionButton>

          <ActionButton onClick={handleImport} size="large">
            <UploadFileIcon />
          </ActionButton>
        </TopActions>

        <BottomActions>
          <Tooltip title={displayName} placement="right">
            <StyledAvatar>{initial}</StyledAvatar>
          </Tooltip>
        </BottomActions>
      </QuickActionsContainer>

      <ImportPdfDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </>
  );
};

const QuickActionsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
});

const TopActions = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

const BottomActions = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.primary.main,
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9,
  },
}));
