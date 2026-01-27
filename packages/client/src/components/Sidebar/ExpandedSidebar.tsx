import { useState } from 'react';
import { Menu, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { IconButton } from '../atoms/IconButton';
import { Typography } from '../atoms/Typography/Typography';
import { SidebarHeader } from './SidebarHeader';
import { ResumeList } from './ResumeList';
import { SidebarActions } from './SidebarActions';
import { ChatPanel } from './ChatPanel';
import { useUser } from '../../contexts';

type ExpandedSidebarProps = {
  onCollapse: () => void;
};

type SidebarTab = 'resumes' | 'chat';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors',
      active
        ? 'border-b-2 border-primary text-primary'
        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
    )}
  >
    {icon}
    {label}
  </button>
);

export const ExpandedSidebar = ({ onCollapse }: ExpandedSidebarProps) => {
  const { user } = useUser();
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('resumes');

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header with tabs */}
      <div
        className="flex items-center justify-between pb-2"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onCollapse}
            title="Collapse sidebar"
            size="sm"
            className={cn(
              'transition-opacity',
              isHeaderHovered ? 'visible opacity-100' : 'invisible opacity-0'
            )}
          >
            <Menu />
          </IconButton>
          <Typography variant="h5" className="font-medium">
            CVAI
          </Typography>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        <TabButton
          active={activeTab === 'resumes'}
          onClick={() => setActiveTab('resumes')}
          icon={<FileText className="h-4 w-4" />}
          label="Resumes"
        />
        <TabButton
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
          icon={<MessageSquare className="h-4 w-4" />}
          label="AI Chat"
        />
      </div>

      {/* Tab Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {activeTab === 'resumes' ? (
          <>
            <SidebarActions />
            <div className="flex flex-1 flex-col overflow-hidden">
              <ResumeList />
            </div>
            <SidebarHeader user={user} />
          </>
        ) : (
          <ChatPanel />
        )}
      </div>
    </div>
  );
};
