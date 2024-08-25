import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api-app-oe2nj3sqxq-uc.a.run.app/api';

export const uploadSyllabi = async (files: FileList) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => formData.append('file', file));

  try {
    const response = await axios.post(`${API_URL}/syllabus`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};
