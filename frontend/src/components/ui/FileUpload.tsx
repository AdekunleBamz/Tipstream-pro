'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface FileInfo {
  file: File;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  onRemove?: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  showPreview?: boolean;
  variant?: 'dropzone' | 'button' | 'minimal';
  className?: string;
  children?: ReactNode;
}

interface FilePreviewProps {
  file: FileInfo;
  onRemove?: () => void;
  showProgress?: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  if (type.includes('text') || type.includes('document')) return '📝';
  if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
  return '📁';
}

// ============================================================================
// File Preview Component
// ============================================================================

export function FilePreview({
  file,
  onRemove,
  showProgress = true,
}: FilePreviewProps) {
  const isImage = file.file.type.startsWith('image/');

  return (
    <div className="relative flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {/* Preview or Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">{getFileIcon(file.file.type)}</span>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {file.file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(file.file.size)}
        </p>

        {/* Progress Bar */}
        {showProgress && file.status === 'uploading' && (
          <div className="mt-1 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${file.progress || 0}%` }}
            />
          </div>
        )}

        {/* Status */}
        {file.status === 'success' && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            ✓ Uploaded
          </p>
        )}
        {file.status === 'error' && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            ✕ {file.error || 'Upload failed'}
          </p>
        )}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove file"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// File Upload Component
// ============================================================================

export function FileUpload({
  onUpload,
  onRemove,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  showPreview = true,
  variant = 'dropzone',
  className = '',
  children,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`;
      }
      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'));
          }
          return file.type === type;
        });
        if (!isAccepted) {
          return 'File type not accepted';
        }
      }
      return null;
    },
    [accept, maxSize]
  );

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const totalFiles = files.length + fileArray.length;

      if (totalFiles > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setError(null);
      const validFiles: FileInfo[] = [];

      fileArray.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }

        const fileInfo: FileInfo = {
          file,
          status: 'pending',
        };

        // Generate preview for images
        if (file.type.startsWith('image/')) {
          fileInfo.preview = URL.createObjectURL(file);
        }

        validFiles.push(fileInfo);
      });

      if (validFiles.length > 0) {
        setFiles((prev) => (multiple ? [...prev, ...validFiles] : validFiles));
        onUpload?.(validFiles.map((f) => f.file));
      }
    },
    [files, maxFiles, multiple, onUpload, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
      e.target.value = '';
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const fileToRemove = files[index];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setFiles((prev) => prev.filter((_, i) => i !== index));
      onRemove?.(fileToRemove.file);
    },
    [files, onRemove]
  );

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  // Hidden input element
  const inputElement = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={handleInputChange}
      disabled={disabled}
      className="hidden"
    />
  );

  // Render different variants
  if (variant === 'button') {
    return (
      <div className={className}>
        {inputElement}
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium
            bg-blue-500 text-white hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {children || 'Upload File'}
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {showPreview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.file.name}-${index}`}
                file={file}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={className}>
        {inputElement}
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          className="text-blue-500 hover:text-blue-600 underline disabled:opacity-50"
        >
          {children || 'Choose file'}
        </button>
        {files.length > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </span>
        )}
      </div>
    );
  }

  // Default: dropzone variant
  return (
    <div className={className}>
      {inputElement}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFilePicker}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-colors
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium text-blue-500">Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {accept || 'Any file type'} • Max {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <FilePreview
              key={`${file.file.name}-${index}`}
              file={file}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Avatar Upload Component
// ============================================================================

interface AvatarUploadProps {
  value?: string;
  onChange?: (file: File) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
}

const avatarSizes = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

export function AvatarUpload({
  value,
  onChange,
  size = 'lg',
  disabled = false,
  className = '',
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange?.(file);
    }
  };

  return (
    <div className={`relative inline-block ${avatarSizes[size]} ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          ${avatarSizes[size]} rounded-full overflow-hidden
          bg-gray-200 dark:bg-gray-700
          flex items-center justify-center
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          border-2 border-gray-300 dark:border-gray-600
          hover:border-blue-500 transition-colors
        `}
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-1/3 h-1/3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>

      {/* Edit Button */}
      <button
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        disabled={disabled}
        className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}

export default FileUpload;
