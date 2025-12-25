import type { ApiResponse } from '@/shared/types/api'
import { apiClient } from '@/shared/api/client'
import type { Video, VideoPageResponse } from '@/features/video/types/video'

export const video = {
  async getVideos(params?: any): Promise<VideoPageResponse> {
    // Backend returns ApiResponse<Page<VideoResponse>>
    const response = await apiClient.get<ApiResponse<VideoPageResponse>>('/videos', { params })
    return response.data.data
  },

  async getVideoDetail(id: string) {
    // Backend returns ApiResponse<VideoDetailResponseDto>
    // Assuming VideoDetailResponseDto matches Video type for now or close enough
    const response = await apiClient.get<ApiResponse<Video>>(`/videos/${id}`)
    return response.data.data
  },

  async saveVideo(videoData: { title: string; description: string; objectKey: string; thumbnailObjectKey?: string; placeId?: string; duration?: number }) {
    const response = await apiClient.post<ApiResponse<string>>('/videos', videoData)
    return response.data.data
  },

  async deleteVideo(id: string) {
    const response = await apiClient.delete<ApiResponse<void>>(`/videos/${id}`)
    return response.data.data
  },

  async initUpload(fileName: string, fileType: string) {
    // Call /storage/presigned-url
    interface PresignedUrlResponse {
      uploadUrl: string;
      fileName: string; // key
    }
    const response = await apiClient.post<ApiResponse<PresignedUrlResponse>>('/storage/presigned-url', {
      fileName,
      fileType
    })
    return response.data.data
  }
}

export const getLatestVideoByPlace = async (placeId: string): Promise<Video | null> => {
  try {
      const response = await apiClient.get<ApiResponse<Video>>(`/videos/place/${placeId}/latest`)
      return response.data.data
  } catch (error) {
      return null
  }
}

export type { VideoResponse } from '@/features/video/types/video'
