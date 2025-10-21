import { useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ChatIcon from '@mui/icons-material/Chat';
import { ImportPdfDialog } from '../ImportCvDialog';
import { useDialog } from '../../contexts';

type SidebarActionsProps = {
  onChatOpen: () => void;
};

export const SidebarActions = ({ onChatOpen }: SidebarActionsProps) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { open: openDialog } = useDialog();

  return (
    <>
      <ActionsContainer>
        <ActionItem onClick={() => openDialog()}>
          <ItemContent>
            <AddIcon fontSize="small" sx={{ color: 'primary.dark' }} />
            <ItemText variant="body2">Create New CV from this one</ItemText>
          </ItemContent>
        </ActionItem>

        <ActionItem onClick={onChatOpen}>
          <ItemContent>
            <ChatIcon fontSize="small" sx={{ color: 'primary.dark' }} />
            <ItemText variant="body2">Open review chat</ItemText>
          </ItemContent>
        </ActionItem>

        <ActionItem onClick={() => setImportDialogOpen(true)}>
          <ItemContent>
            <UploadFileIcon fontSize="small" sx={{ color: 'primary.dark' }} />
            <ItemText variant="body2">Import resume</ItemText>
          </ItemContent>
        </ActionItem>
      </ActionsContainer>

      <ImportPdfDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />
    </>
  );
};

const ActionsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: '100%',
});

const ActionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 1),
  cursor: 'pointer',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
}));

const ItemContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
});

const ItemText = styled(Typography)({
  flex: 1,
});
