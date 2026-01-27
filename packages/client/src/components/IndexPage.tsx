import { useState } from 'react';
import { cn } from '@ui/lib/utils';
import { FloatingSidebar } from './Sidebar';
import { CurrentCvPreview } from './CvPreview';
import { usePreviewMode } from '../contexts';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  EXPANDED_SIDEBAR_WIDTH,
} from './Sidebar/FloatingSidebar';

export const IndexPage = () => {
  const { isPreviewing } = usePreviewMode();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const mainContentMarginLeft = isSidebarExpanded
    ? EXPANDED_SIDEBAR_WIDTH + 48
    : COLLAPSED_SIDEBAR_WIDTH + 48;

  return (
    <div className="flex w-screen h-screen overflow-hidden app-background">
      <FloatingSidebar
        isExpanded={isSidebarExpanded}
        onToggle={setIsSidebarExpanded}
      />
      <div
        className={cn(
          'flex-1 overflow-auto transition-[margin] duration-300 ease-in-out',
          isPreviewing && 'mx-auto p-0'
        )}
        style={{
          marginLeft: isPreviewing ? 'auto' : mainContentMarginLeft,
        }}
      >
        <CurrentCvPreview />
      </div>
    </div>
  );
};
