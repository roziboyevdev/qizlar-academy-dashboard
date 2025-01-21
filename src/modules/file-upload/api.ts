import http from 'services/api';

export const FileUpload = async (file: FormData) => {
  return await http.post(`/file/`, file);
};
