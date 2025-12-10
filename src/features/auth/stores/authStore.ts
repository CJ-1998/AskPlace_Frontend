import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlaceStore } from '@/features/place/stores/place'
import { usePlanStore } from '@/features/plan/stores/plan'
import { useVideoStore } from '@/features/video/stores/video'
import { authApi } from '@/features/auth/api/auth'
import { setAccessToken as clientSetAccessToken } from '@/shared/api/client'
import router from '@/app/router'
import { jwtDecode } from 'jwt-decode'
import type { AccessTokenPayload, UserData } from '@/features/auth/types/auth'
import type { Place } from '@/features/place/types/place'
import type { Plan } from '@/features/plan/types/plan'
import type { Video } from '@/features/video/types/video'

export const useAuthStore = defineStore('auth', () => {
  const placeStore = usePlaceStore()
  const planStore = usePlanStore()
  const videoStore = useVideoStore()

  // State
  const accessToken = ref<string | null>(null)
  const user = ref<UserData | null>(null)
  
  // Derived state (compatibility)
  const isLoggedIn = computed(() => !!user.value)
  const currentUser = computed(() => user.value?.name || null)
  const userUuid = computed(() => user.value?.uuid || null)
  const userEmail = computed(() => user.value?.email || null)
  const userRole = computed(() => user.value?.role || null)

  const isAuthInitialized = ref(false)
  let authInitPromise: Promise<void> | null = null

  // Computed Properties (Delegating to specific stores)
  const places = computed(() => placeStore.places)
  const plans = computed(() => planStore.plans)
  const videos = computed(() => videoStore.videos)

  const placesCount = computed(() => places.value.length)
  const plansCount = computed(() => plans.value.length)
  const videosCount = computed(() => videos.value.length)

  // Core Action: Set Access Token & Decode
  const setAccessToken = (token: string | null) => {
    accessToken.value = token
    clientSetAccessToken(token)

    if (token) {
      try {
        const decoded = jwtDecode<AccessTokenPayload>(token)
        user.value = {
          uuid: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role
        }
      } catch (error) {
        console.error('Invalid token:', error)
        user.value = null
        accessToken.value = null
        clientSetAccessToken(null)
      }
    } else {
      user.value = null
    }
  }

  // Actions
  const updateUserState = (data: Partial<UserData>) => {
    if (user.value) {
      user.value = { ...user.value, ...data }
    }
  }

  const login = (token: string) => {
    setAccessToken(token)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout API failed:', error)
    } finally {
      setAccessToken(null)
      router.push('/')
    }
  }

  // 세션 복구 (새로고침 시 호출)
  const restoreSession = async () => {
    if (isAuthInitialized.value) return

    try {
      const response = await authApi.refreshToken()
      // API response might contain other fields, but we only use accessToken
      const { accessToken: newToken } = response.data
      
      setAccessToken(newToken)
      console.log('Session restored successfully')
    } catch (error) {
      console.log('Session restore failed (not logged in or expired)')
      setAccessToken(null)
    } finally {
      isAuthInitialized.value = true
    }
  }

  // 초기화 함수 (라우터 가드에서 호출)
  const initAuth = () => {
    if (!authInitPromise) {
      authInitPromise = restoreSession()
    }
    return authInitPromise
  }

  // Synchronous getters from loaded state
  // Note: Data must be fetched first for these to work
  const getPlaceById = (id: number | string) => places.value.find((p: Place) => p.id == Number(id))
  const getPlanById = (id: number | string) => plans.value.find((p: Plan) => p.id == Number(id))
  const getVideoById = (id: number | string) => videos.value.find((v: Video) => v.id == Number(id))

  const fetchAllData = async () => {
    await Promise.all([
      placeStore.fetchPlaces(),
      planStore.fetchPlans(),
      videoStore.fetchVideos()
    ])
  }

  return {
    // State
    accessToken,
    user,
    isLoggedIn,
    isAuthInitialized,
    
    // Getters
    currentUser,
    userUuid,
    userEmail,
    userRole,
    
    // Data Getters
    places,
    plans,
    videos,
    placesCount,
    plansCount,
    videosCount,
    
    // Actions
    setAccessToken,
    updateUserState,
    login,
    logout,
    restoreSession,
    initAuth,
    fetchAllData,
    
    getPlaceById,
    getPlanById,
    getVideoById
  }
})
