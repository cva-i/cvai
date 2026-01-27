import { useCallback, useState } from 'react';
import { cn } from '@ui/lib/utils';
import { usePreviewMode } from '../contexts';

export function useEditableSection() {
  const { isPreviewing } = usePreviewMode();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!isPreviewing) {
      setIsHovered(true);
    }
  }, [isPreviewing]);

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.isContentEditable ||
      target.closest('[contenteditable="true"]')
    ) {
      return;
    }
    if (isHovered && !isActive && !isPreviewing) {
      setIsActive(true);
    }
  };

  const deactivate = () => {
    setIsActive(false);
  };

  const contextValue = { isEntryActive: isActive, deactivate };

  const getContainerClassName = () =>
    cn(
      'rounded p-1 transition-all duration-200 relative',
      isHovered ? 'bg-primary/5' : 'bg-transparent',
      isHovered && !isActive ? 'cursor-pointer' : 'cursor-default',
      isActive ? 'z-[1301] bg-background shadow-sm' : 'z-auto'
    );

  return {
    isHovered,
    isActive,
    isPreviewing,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    deactivate,
    contextValue,
    getContainerClassName,
  };
}
