import { apiClient } from './client'
import axios from 'axios'

const PART_SIZE = 5 * 1024 * 1024; // 5MB

interface InitiateResponse {
  uploadId: string;
  fileKey: string;
}

interface PresignedUrlResponse {
  url: string;
}

interface CompletedPart {
  partNumber: number;
  eTag: string;
}

export const uploadFileMultiparts = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
  try {
    // 1. Initiate
    const initRes = await apiClient.post<InitiateResponse>('/storage/initiate', null, {
      params: { filename: file.name, contentType: file.type }
    });
    const { uploadId, fileKey } = initRes.data;

    const parts: CompletedPart[] = [];
    const totalParts = Math.ceil(file.size / PART_SIZE);

    for (let i = 0; i < totalParts; i++) {
      const start = i * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      const chunk = file.slice(start, end);
      const partNumber = i + 1;

      // 2. Get Presigned URL
      const urlRes = await apiClient.get<PresignedUrlResponse>('/storage/presigned-url', {
        params: { fileKey, uploadId, partNumber }
      });
      const { url } = urlRes.data;

      // 3. Upload to S3 (Directly)
      const uploadRes = await axios.put(url, chunk, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream'
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                // Approximate progress
                const partProgress = progressEvent.loaded / progressEvent.total;
                const totalProgress = ((i + partProgress) / totalParts) * 100;
                onProgress(totalProgress);
            }
        }
      });

      // ETag is needed for completion
      const eTag = uploadRes.headers['etag'] as string;
      
      parts.push({ partNumber, eTag });
    }

    // 4. Complete
    await apiClient.post('/storage/complete', {
      uploadId,
      fileKey,
      parts
    });

    return fileKey;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}
