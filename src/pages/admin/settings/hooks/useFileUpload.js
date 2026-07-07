import { useState, useCallback } from 'react';
import { FILE_UPLOAD_LIMITS } from '../constants/settingsConfig';

/**
 * Custom hook for handling file uploads with validation
 */
export const useFileUpload = (fileType = 'logo') => {
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file) => {
    setErrorMessage('');
    
    const limits = FILE_UPLOAD_LIMITS[fileType];
    
    // Validate file size
    if (file.size > limits.maxSize) {
      const maxSizeMB = limits.maxSize / (1024 * 1024);
      setErrorMessage(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    // Validate file type
    if (!limits.allowedTypes.includes(file.type)) {
      const formats = limits.allowedTypes
        .map(type => type.split('/')[1].toUpperCase())
        .join(', ');
      setErrorMessage(`File must be in ${formats} format`);
      return false;
    }

    return true;
  }, [fileType]);

  /**
   * Process file upload
   */
  const processFile = useCallback((file, onSuccess) => {
    if (!validateFile(file)) {
      return null;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      onSuccess({
        file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);

    return file;
  }, [validateFile]);

  return {
    processFile,
    errorMessage,
    clearError: () => setErrorMessage('')
  };
};
