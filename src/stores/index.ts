import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlaceStore } from './place'
import { usePlanStore } from './plan'
import { useVideoStore } from './video'
import { authApi } from '@/api/auth'
import { setAccessToken } from '@/api/client'
import router from '@/router'

export const useAppStore = defineStore('app', () => {
  const placeStore = usePlaceStore()
  const planStore = usePlanStore()
  const videoStore = useVideoStore()

  // State
  const isLoggedIn = ref(false)
  const currentUser = ref<string | null>(null)

  // Computed Properties (Delegating to specific stores)
  const places = computed(() => placeStore.places)
  const plans = computed(() => planStore.plans)
  const videos = computed(() => videoStore.videos)

  const placesCount = computed(() => places.value.length)
  const plansCount = computed(() => plans.value.length)
  const videosCount = computed(() => videos.value.length)

  // Actions
  const login = (username: string) => {
    isLoggedIn.value = true
    currentUser.value = username
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout API failed:', error)
    } finally {
      // API 실패 여부와 관계없이 클라이언트 로그아웃 처리
      isLoggedIn.value = false
      currentUser.value = null
      setAccessToken(null)
      router.push('/')
    }
  }

  // 세션 복구 (새로고침 시 호출)
  const restoreSession = async () => {
    try {
      const response = await authApi.refreshToken()
      const { accessToken, name } = response.data
      
      setAccessToken(accessToken)
      login(name)
      console.log('Session restored successfully')
    } catch (error) {
      console.log('Session restore failed (not logged in or expired)')
      logout()
    }
  }

  // Synchronous getters from loaded state
  // Note: Data must be fetched first for these to work
  const getPlaceById = (id: number | string) => places.value.find(p => p.id == Number(id))
  const getPlanById = (id: number | string) => plans.value.find(p => p.id == Number(id))
  const getVideoById = (id: number | string) => videos.value.find(v => v.id == Number(id))

  const fetchAllData = async () => {
    await Promise.all([
      placeStore.fetchPlaces(),
      planStore.fetchPlans(),
      videoStore.fetchVideos()
    ])
  }

  return {
    isLoggedIn,
    currentUser,
    places,
    plans,
    videos,
    placesCount,
    plansCount,
    videosCount,
    login,
    logout,
    getPlaceById,
    getPlanById,
    getVideoById,
    fetchAllData,
    restoreSession
  }
})
