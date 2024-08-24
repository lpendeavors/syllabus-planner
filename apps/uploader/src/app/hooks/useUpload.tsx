import { useState } from 'react';
import { uploadSyllabi } from '../services/uploadService';

export const useUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const result = await uploadSyllabi(files);
      setIsSuccess(true);
      return result;
    } catch (err) {
      console.log(err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    error,
    handleUpload,
  };
};
