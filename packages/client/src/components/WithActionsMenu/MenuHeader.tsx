import React from 'react';
import { LogOut } from 'lucide-react';
import type { User } from '../../generated/graphql';
import { TypographyWithOverflow, IconButton } from '../atoms';
import { useUser } from '../../contexts';
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { Separator } from '@ui/components/ui/separator';

type MenuHeaderProps = {
  user: Pick<User, 'firstName' | 'lastName' | 'email'>;
  onClose: () => void;
};

export const MenuHeader: React.FC<MenuHeaderProps> = React.memo(({ user }) => {
  const { logout } = useUser();

  return (
    <>
      <div className="flex items-center p-4">
        <Avatar>
          <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 flex-grow">
          <TypographyWithOverflow variant="h6">
            {user.firstName} {user.lastName}
          </TypographyWithOverflow>
          <TypographyWithOverflow variant="body2">
            {user.email}
          </TypographyWithOverflow>
        </div>
        <IconButton title="Logout" onClick={logout}>
          <LogOut />
        </IconButton>
      </div>
      <Separator />
    </>
  );
});
