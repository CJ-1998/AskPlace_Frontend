import { apiClient } from './client'
import type { Video } from '@/types/video'

export const videoApi = {
  async getVideos(params?: any) {
    const response = await apiClient.get<Video[]>('/videos', { params })
    return response.data
  },

  async getVideoById(id: number) {
    const response = await apiClient.get<Video>(`/videos/${id}`)
    return response.data
  },

  async uploadVideo(videoData: FormData) {
    const response = await apiClient.post<Video>('/videos', videoData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async deleteVideo(id: number) {
    const response = await apiClient.delete(`/videos/${id}`)
    return response.data
  }
}
