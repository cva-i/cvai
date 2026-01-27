import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { usePreviewMode } from '../../contexts';
import { IconButton } from '../atoms';

export function ClosePreviewButton() {
  const { isPreviewing, togglePreviewMode } = usePreviewMode();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(function handleBeforePrint() {
    const beforePrintHandler = () => {
      setIsHidden(true);
      setTimeout(() => {
        setIsHidden(false);
      }, 2000);
    };

    window.addEventListener('beforeprint', beforePrintHandler);

    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
    };
  }, []);

  const handleKeyDown = useCallback(
    function handleMetaPPress(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        setIsHidden(true);
        setTimeout(() => {
          setIsHidden(false);
        }, 2000);
      }
    },
    [setIsHidden]
  );

  useEffect(
    function addKeyboardListener() {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [handleKeyDown]
  );

  if (!isPreviewing || isHidden) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-[10000] print:hidden">
      <IconButton
        onClick={togglePreviewMode}
        title="Exit preview mode (ESC)"
        className="bg-background-paper shadow-lg hover:bg-background-paper hover:shadow-xl"
      >
        <X />
      </IconButton>
    </div>
  );
}
