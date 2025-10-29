import { useState } from 'react';
import { Box, IconButton, styled, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SidebarHeader } from './SidebarHeader';
import { ResumeList } from './ResumeList';
import { SidebarActions } from './SidebarActions';
import { useUser } from '../../contexts';

type ExpandedSidebarProps = {
  onCollapse: () => void;
};

export const ExpandedSidebar = ({ onCollapse }: ExpandedSidebarProps) => {
  const { user } = useUser();
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  return (
    <SidebarContent>
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

        <SidebarActions />

        <ResumeListSection>
          <ResumeList />
        </ResumeListSection>
      </TopSection>

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
