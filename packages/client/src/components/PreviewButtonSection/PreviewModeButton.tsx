import Preview from '@mui/icons-material/Preview';
import { usePreviewMode } from '../../contexts';
import { IconButton } from '../atoms';

export const PreviewModeButton = ({}) => {
  const { togglePreviewMode, isPreviewing } = usePreviewMode();

  if (isPreviewing) {
    return null;
  }
  return (
    <IconButton onClick={togglePreviewMode} title={'Preview'}>
      <Preview />
    </IconButton>
  );
};
