import { useState, useRef, ChangeEvent } from 'react';
import Button from './Button';

interface FileUploadProps {
  label?: string;
  accept?: string;
  required?: boolean;
  onChange: (file: File | null) => void;
}

export default function FileUpload({
  label,
  accept,
  required = false,
  onChange,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file?.name || null);
    onChange(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
          required={required}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
        >
          Choose File
        </Button>
        <span className="text-sm text-gray-500 truncate max-w-xs">
          {fileName || 'No file chosen'}
        </span>
      </div>
    </div>
  );
}