import { useCallback, useState } from 'react';
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

  const containerStyles = () => ({
    border: isHovered ? '2px solid' : '2px solid transparent',
    borderColor: isHovered ? 'primary.main' : 'transparent',
    borderRadius: (theme: any) => theme.shape.borderRadius,
    transition: 'border-color 0.2s',
    padding: 1,
    cursor: isHovered && !isActive ? 'pointer' : 'default',
    position: 'relative' as const,
    zIndex: isActive ? (theme: any) => theme.zIndex.modal + 1 : 'auto',
    backgroundColor: isActive ? 'background.paper' : 'transparent',
  });

  return {
    isHovered,
    isActive,
    isPreviewing,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    deactivate,
    contextValue,
    containerStyles,
  };
}
