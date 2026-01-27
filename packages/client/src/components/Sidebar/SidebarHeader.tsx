import { Avatar, AvatarFallback } from '@ui/components/ui/avatar';
import { Typography } from '../atoms/Typography/Typography';
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
    <div className="mt-4 flex w-full shrink-0 items-center justify-between border-t border-border pt-4">
      {/* User Info */}
      <div className="flex flex-1 items-center gap-3 overflow-hidden">
        <Avatar className="h-10 w-10 shrink-0 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
        {/* User Details */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Typography variant="subtitle1" className="truncate block">
            {displayName}
          </Typography>
          <Typography variant="caption" color="secondary" className="truncate block">
            {user.email}
          </Typography>
        </div>
      </div>
    </div>
  );
};
