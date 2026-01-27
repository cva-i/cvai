import { Eye } from 'lucide-react';
import { usePreviewMode } from '../../contexts';
import { IconButton } from '../atoms';

export const PreviewModeButton = () => {
  const { togglePreviewMode, isPreviewing } = usePreviewMode();

  if (isPreviewing) {
    return null;
  }
  return (
    <IconButton onClick={togglePreviewMode} title={'Preview'}>
      <Eye className="h-5 w-5" />
    </IconButton>
  );
};
