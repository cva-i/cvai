import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { Typography } from './atoms/Typography';

interface FileUploaderProps {
  onFileUploaded: (file: File) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
}

export const FileUploader = ({
  onFileUploaded,
  acceptedFileTypes = 'application/pdf',
  maxFiles = 1,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      onFileUploaded(uploadedFile);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes ? { [acceptedFileTypes]: [] } : undefined,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer transition-colors duration-200',
        isDragActive && 'bg-muted'
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
      <Typography variant="body1" className="mt-4">
        {file ? file.name : 'Drag & drop file here, or click to select'}
      </Typography>
      <Typography variant="caption" color="secondary">
        Supported formats: PDF
      </Typography>
    </div>
  );
};
