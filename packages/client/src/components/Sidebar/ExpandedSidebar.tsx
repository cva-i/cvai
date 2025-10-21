import { useState } from 'react';
import { Box, IconButton, styled, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SidebarHeader } from './SidebarHeader';
import { ResumeList } from './ResumeList';
import { ResumeAssistantSection } from '../LLMAssistantSection';
import { SidebarActions } from './SidebarActions';
import { useUser } from '../../contexts';

type ExpandedSidebarProps = {
  onCollapse: () => void;
};

export const ExpandedSidebar = ({ onCollapse }: ExpandedSidebarProps) => {
  const { user } = useUser();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  return (
    <SidebarContent>
      {isChatOpen ? (
        <>
          <ChatHeader
            onMouseEnter={() => setIsHeaderHovered(true)}
            onMouseLeave={() => setIsHeaderHovered(false)}
          >
            <HeaderLeft>
              <MenuIcon sx={{ color: 'primary.dark' }} />
              <Typography variant="h6">AI CV Review</Typography>
            </HeaderLeft>
            <MinimiseButton
              // variant="text"
              // size="small"
              onClick={() => setIsChatOpen(false)}
              sx={{ visibility: isHeaderHovered ? 'visible' : 'hidden' }}
            >
              Minimise chat
            </MinimiseButton>
          </ChatHeader>
          <ChatSection>
            <ResumeAssistantSection />
          </ChatSection>
        </>
      ) : (
        <>
          <TopSection>
            <TitleContainer
              onMouseEnter={() => setIsHeaderHovered(true)}
              onMouseLeave={() => setIsHeaderHovered(false)}
            >
              <HeaderLeft>
                <IconButton
                  onClick={onCollapse}
                  size="small"
                  sx={{ visibility: isHeaderHovered ? 'visible' : 'hidden' }}
                >
                  <MenuIcon sx={{ color: 'primary.dark' }} />
                </IconButton>
                <Typography variant="h5" fontWeight={500}>
                  CVAI
                </Typography>
              </HeaderLeft>
            </TitleContainer>

            <SidebarActions onChatOpen={() => setIsChatOpen(true)} />

            <ResumeListSection>
              <ResumeList />
            </ResumeListSection>
          </TopSection>
        </>
      )}

      <SidebarHeader user={user} />
    </SidebarContent>
  );
};

const SidebarContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  justifyContent: 'space-between',
});

const TopSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
});

const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const HeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ResumeListSection = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MinimiseButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.palette.primary.dark,
  fontSize: '0.875rem',
  cursor: 'pointer',
  padding: theme.spacing(0.5, 1),
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ChatSection = styled(Box)({
  flex: 1,
  overflow: 'auto',
});
