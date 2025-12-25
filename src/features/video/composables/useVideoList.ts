import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { video } from '@/features/video/api/video'
import type { VideoResponse, VideoPageResponse } from '@/features/video/types/video'

export function useVideoList() {
  const router = useRouter()
  const route = useRoute()

  // State
  const videos = ref<VideoResponse[]>([])
  const loading = ref(true)
  const page = ref(0)
  const size = ref(12)
  const totalPages = ref(0)
  const currentRegion = ref('all')
  const currentPlaceId = ref<string | undefined>(undefined)

  // Fetch Query
  const fetchVideos = async (pageNumber: number) => {
    try {
      loading.value = true
      const regionParam = currentRegion.value === 'all' ? undefined : currentRegion.value
      const placeIdParam = currentPlaceId.value

      const params = {
        page: pageNumber,
        size: size.value,
        region: regionParam,
        placeId: placeIdParam
      };
      
      const response: VideoPageResponse = await video.getVideos(params)
      
      videos.value = response.content
      totalPages.value = response.totalPages
      page.value = response.number
    } catch (error) {
      console.error('Failed to fetch videos', error)
    } finally {
      loading.value = false
    }
  }

  // Navigation & Actions
  const changePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages.value) {
      fetchVideos(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const selectRegion = (region: string) => {
    if (currentRegion.value === region) return
    router.push({ query: { ...route.query, region } })
  }

  // Initialize & Watch
  const init = () => {
    watch(() => route.query, (newQuery) => {
      const region = newQuery.region as string || 'all'
      const placeId = newQuery.placeId as string || undefined
      
      currentRegion.value = region
      currentPlaceId.value = placeId
      
      fetchVideos(0) 
    }, { immediate: true, deep: true })
  }

  return {
    videos,
    loading,
    page,
    totalPages,
    currentRegion,
    currentPlaceId,
    fetchVideos,
    changePage,
    selectRegion,
    init
  }
}
