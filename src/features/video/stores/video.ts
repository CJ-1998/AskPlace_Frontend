import { defineStore } from 'pinia'
import { ref } from 'vue'
import { video } from '@/features/video/api/video'
import type { Video } from '@/features/video/types/video'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([])
  const currentVideo = ref<Video | null>(null)
  const isLoading = ref(false)

  const fetchVideos = async (params?: any) => {
    isLoading.value = true
    try {
      const response = await video.getVideos(params)
      videos.value = response.content
    } catch (error) {
      console.error('Failed to fetch videos', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchVideoById = async (id: string) => {
    isLoading.value = true
    try {
      currentVideo.value = await video.getVideoDetail(id)
      return currentVideo.value
    } catch (error) {
      console.error('Failed to fetch video', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    videos,
    currentVideo,
    isLoading,
    fetchVideos,
    fetchVideoById
  }
})
