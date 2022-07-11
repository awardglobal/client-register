import requestAPI from '@/utils/request';
import { User } from './user';

export interface MinIOFile {
  id: string;
  createdAt: string;
  updatedAt: string;
  objectName: string;
  bucket: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  user: User;
}

export interface UploadFileRequest {
  file: File;
}

export interface UploadFileResponse {
  file: MinIOFile;
}

export async function uploadFileService(data: UploadFileRequest) {
  const formData = new FormData();
  formData.append('file', data.file);
  const res = await requestAPI<UploadFileResponse>({
    url: '/file/uploadFile',
    method: 'post',
    data: formData,
  });
  return res.data;
}
