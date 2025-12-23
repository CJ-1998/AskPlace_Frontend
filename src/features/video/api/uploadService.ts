import { apiClient } from '@/shared/api/client'
import axios from 'axios'

export interface UploadResult {
    method: 'PRESIGNED' | 'MULTIPART' | 'STREAM'
    duration: number
    fileUrl: string
}

export const uploadService = {
    // 1. Pre-signed URL Upload
    async uploadByPresignedUrl(file: File): Promise<UploadResult> {
        const start = performance.now()

        // Pre-signed URL 요청
        const presignedResponse = await apiClient.post('/storage/presigned-url', {
            fileName: file.name,
            contentType: file.type
        })
        const { uploadUrl, fileUrl } = presignedResponse.data.data

        // S3에 직접 업로드 (axios나 fetch 사용)
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type
            }
        })

        const end = performance.now()
        return {
            method: 'PRESIGNED',
            duration: end - start,
            fileUrl
        }
    },

    // 2. Server Multipart Upload
    async uploadByMultipart(file: File): Promise<UploadResult> {
        const start = performance.now()

        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post('/storage/multipart', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const end = performance.now()
        return {
            method: 'MULTIPART',
            duration: end - start,
            fileUrl: response.data.data
        }
    },

    //3. Server Stream Upload

    async uploadByStream(file: File): Promise<UploadResult> {
        const start = performance.now()

        // raw 파일 바디 전송
        const response = await apiClient.post('/storage/stream', file, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': file.size.toString()
            },
            params: {
                filename: file.name
            }
        })

        const end = performance.now()
        return {
            method: 'STREAM',
            duration: end - start,
            fileUrl: response.data.data
        }
    }
}
