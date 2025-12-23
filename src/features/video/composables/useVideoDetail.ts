import { ref } from 'vue'
import { video } from '@/features/video/api/video'
import type { VideoResponse } from '@/features/video/types/video'
import { useToast } from '@/shared/composables/useToast'

export function useVideoDetail() {
  const { showToast } = useToast()

  const videos = ref<VideoResponse | null>(null)
  const loading = ref(true)
  const error = ref(false)

  const videoError = (msg: string) => {
    error.value = true
    showToast(msg, 'error')
  }

  const fetchDetail = async (id: string) => {
    if (!id) {
      videoError("Invalid video ID")
      return
    }

    try {
      loading.value = true
      error.value = false
      const data = await video.getVideoDetail(id)
      videos.value = data
    } catch (err) {
      console.error(err)
      videoError("Failed to load video. It might have been deleted or the link expired.")
    } finally {
      loading.value = false
    }
  }

  return {
    video,
    loading,
    error,
    fetchDetail,
    videoError
  }
}
