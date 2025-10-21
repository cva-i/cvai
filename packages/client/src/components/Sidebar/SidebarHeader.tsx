import { Box, Typography, Avatar, styled } from '@mui/material';
import { getUserDisplayName } from '../../utils/getUserDisplayName';

type SidebarHeaderProps = {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

export const SidebarHeader = ({ user }: SidebarHeaderProps) => {
  const displayName = getUserDisplayName(user) ?? user.email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <HeaderContainer>
      <UserInfo>
        <StyledAvatar>{initial}</StyledAvatar>
        <UserDetails>
          <Typography variant="subtitle1" noWrap>
            {displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        </UserDetails>
      </UserInfo>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
  width: '100%',
}));

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  overflow: 'hidden',
  flex: 1,
});

const UserDetails = styled(Box)({
  overflow: 'hidden',
  flex: 1,
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: theme.palette.primary.main,
  flexShrink: 0,
}));
