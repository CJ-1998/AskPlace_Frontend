import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { userApi } from '@/features/user/api/user'
import { useToast } from '@/shared/composables/useToast'
import type { UserProfile, UserActivity } from '@/features/user/types/user'

export function useMyPage() {
  const store = useAuthStore()
  const router = useRouter()
  const { showToast } = useToast()
  
  const { user, isLoggedIn } = storeToRefs(store)

  const isLoading = ref(true)
  const isEditing = ref(false)
  const activeTab = ref<'plans' | 'places' | 'videos'>('plans')

  const profile = ref<UserProfile>({
    userUuid: user.value?.uuid || '',
    name: user.value?.name || '',
    email: user.value?.email || '',
    profileImage: '',
    introduction: '',
  })

  const editForm = ref<Partial<UserProfile>>({})

  const activity = ref<UserActivity>({
    myPlans: [],
    likedPlaces: [],
    myVideos: []
  })

  // 프로필 데이터를 pinia에서 관리하면 동기화에서 장점이 있음
  // 단, 여기서는 초기에 프로필 데이터를 가져오고
  // 수동 업데이트를 통해 유저 프로필을 관리
  if (user.value) {
    profile.value.name = user.value.name
    profile.value.email = user.value.email
    profile.value.userUuid = user.value.uuid
  }

  // Actions
  const fetchUserData = async () => {
    isLoading.value = true
    try {
      // Parallel fetch for better performance
      const [profileData, activityData] = await Promise.allSettled([
        userApi.getMyProfile(),
        userApi.getUserActivity()
      ])

      if (profileData.status === 'fulfilled') {
        // TODO : 콘솔 로그는 배포시에 무조건 제외해야함.
        console.log('Fetched Profile Data:', profileData.value)
        profile.value = { ...profile.value, ...profileData.value }
        store.updateUserState(profileData.value)
      } else {
        // TODO : 콘솔 로그는 배포시에 무조건 제외해야함.
        console.error('Failed to fetch profile:', profileData.reason)
      }

      if (activityData.status === 'fulfilled') {
        activity.value = activityData.value
      } else {
        // TODO : 콘솔 로그는 배포시에 무조건 제외해야함.
        console.error('Failed to fetch activity:', activityData.reason)
      }
    } finally {
      isLoading.value = false
    }
  }

  const startEdit = () => {
    editForm.value = { ...profile.value }
    isEditing.value = true
  }

  const cancelEdit = () => {
    isEditing.value = false
    editForm.value = {}
  }

  const saveProfile = async () => {
    if (!profile.value.userUuid) return

    try {
      const updatedProfile = await userApi.updateProfile(profile.value.userUuid, {
        introduction: editForm.value.introduction || ''
      })
      
      profile.value = updatedProfile
      store.updateUserState(updatedProfile)
      showToast('프로필이 수정되었습니다.', 'success')
      isEditing.value = false
    } catch (error) {
      showToast('프로필 수정에 실패했습니다.', 'error')
    }
  }

  const withdrawUser = async () => {
    if (!profile.value.userUuid) return

    try {
      await userApi.withdrawUser(profile.value.userUuid)
      showToast('회원 탈퇴가 완료되었습니다.', 'success')
      await store.logout()
      router.push('/')
    } catch (error) {
      showToast('회원 탈퇴에 실패했습니다.', 'error')
    }
  }

  const logout = async () => {
    await store.logout()
    router.push('/')
  }

  return {
    // State
    isLoading,
    isEditing,
    activeTab,
    profile,
    editForm,
    activity,
    isLoggedIn,
    
    // Actions
    fetchUserData,
    startEdit,
    cancelEdit,
    saveProfile,
    withdrawUser,
    logout
  }
}
