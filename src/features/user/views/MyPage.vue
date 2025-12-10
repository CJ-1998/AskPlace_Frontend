<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { userApi } from '@/features/user/api/user'
import type { UserProfile, UserActivity } from '@/features/user/types/user'
import type { UserData } from '@/features/auth/types/auth'
import { useToast } from '@/shared/composables/useToast'
import { useRouter } from 'vue-router'

import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { Input } from '@/shared/components/ui/input'
// import { Label } from '@/shared/components/ui/label' 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/shared/components/ui/dialog'

import PlanCard from '@/features/plan/components/PlanCard.vue'
import PlaceCard from '@/features/place/components/PlaceCard.vue'
import VideoCard from '@/features/video/components/VideoCard.vue'

// Icons
import { Map, Heart, Video, Edit2, LogOut, Save, X, Trash2, Lock } from 'lucide-vue-next'

const store = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

// State
const { user, isLoggedIn } = storeToRefs(store)

// State
const activeTab = ref<'plans' | 'places' | 'videos'>('plans')
const isLoading = ref(true)
const isEditing = ref(false)

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

// Methods
const fetchUserData = async () => {
  isLoading.value = true
  
  // 1. 프로필 상세 정보 조회 (Introduction 등)
  try {
    const profileData = await userApi.getMyProfile()
    console.log('Fetched Profile Data:', profileData)
    profile.value = { ...profile.value, ...profileData }
    store.updateUserState(profileData) // Store 동기화
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    // 실패해도 store에 있는 기본 정보는 유지
  }

  // 2. 활동 내역 조회
  try {
    const activityData = await userApi.getUserActivity()
    activity.value = activityData
  } catch (error) {
    console.error('Failed to fetch activity:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for store updates (e.g. after refresh)
watch(() => user.value, (newUser: UserData | null) => {
  if (newUser) {
    profile.value = {
      ...profile.value,
      userUuid: newUser.uuid,
      name: newUser.name,
      email: newUser.email,
    }
  }
}, { deep: true })

const startEdit = () => {
  editForm.value = { ...profile.value }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {}
}

const saveProfile = async () => {
  if (!profile.value.userUuid) {
    showToast('사용자 식별자가 없습니다.', 'error')
    return
  }
  
  try {
    const updatedProfile = await userApi.updateProfile(profile.value.userUuid, {
      introduction: editForm.value.introduction || ''
    })
    console.log('Updated Profile:', updatedProfile)
    profile.value = updatedProfile
    store.updateUserState(updatedProfile) // Store 동기화
    showToast('프로필이 수정되었습니다.', 'success')
    isEditing.value = false
  } catch (error) {
    showToast('프로필 수정에 실패했습니다.', 'error')
  }
}

const handleLogout = async () => {
  await store.logout()
}

const handleWithdraw = async () => {
  if (!profile.value.userUuid) {
    showToast('사용자 식별자가 없습니다.', 'error')
    return
  }

  try {
    await userApi.withdrawUser(profile.value.userUuid)
    showToast('회원 탈퇴가 완료되었습니다.', 'success')
    await store.logout()
  } catch (error) {
    showToast('회원 탈퇴에 실패했습니다.', 'error')
  }
}

onMounted(() => {
  if (!isLoggedIn.value) {
    showToast('로그인이 필요한 페이지입니다.', 'error')
    router.push('/')
    return
  }
  fetchUserData()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">마이페이지</h1>
      <p class="text-slate-500">내 정보와 여행 기록을 관리하세요.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Sidebar: Profile -->
      <aside class="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader class="text-center pb-2">
            <div class="flex justify-center mb-4 relative">
              <Avatar class="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage v-if="profile.profileImage" :src="profile.profileImage" :alt="profile.name" />
                <AvatarFallback class="text-2xl">{{ profile.name ? profile.name.charAt(0).toUpperCase() : 'U' }}</AvatarFallback>
              </Avatar>
              <!-- Edit Image Button removed as it's not supported -->
            </div>
            
            <template v-if="!isEditing">
              <CardTitle class="text-xl mb-1">{{ profile.name }}</CardTitle>
              <CardDescription>{{ profile.email }}</CardDescription>
            </template>
            <template v-else>
               <div class="space-y-3 text-left">
                  <div>
                    <label class="text-xs font-medium text-slate-500 ml-1">이름</label>
                    <div class="relative">
                      <Input v-model="editForm.name" class="h-8 text-sm pr-8" disabled />
                      <Lock class="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>
               </div>
            </template>
          </CardHeader>
          
          <CardContent>
            <div class="space-y-4">
              <div v-if="!isEditing" class="text-sm text-slate-600 bg-slate-50 p-3 rounded-md min-h-[60px]">
                {{ profile.introduction || '자기소개를 입력해주세요.' }}
              </div>
               <div v-else>
                 <label class="text-xs font-medium text-slate-500 ml-1">자기소개 (255자 이내)</label>
                 <textarea 
                    v-model="editForm.introduction"
                    maxlength="255"
                    class="w-full flex min-h-[80px] rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  ></textarea>
               </div>

              <Separator />
              
              <div class="pt-2 flex flex-col gap-2">
                <template v-if="!isEditing">
                  <Button variant="outline" class="w-full" @click="startEdit">
                    <Edit2 class="w-4 h-4 mr-2" /> 프로필 수정
                  </Button>
                </template>
                <template v-else>
                  <div class="flex gap-2">
                    <Button class="flex-1" @click="saveProfile">
                      <Save class="w-4 h-4 mr-2" /> 저장
                    </Button>
                    <Button variant="ghost" class="px-3" @click="cancelEdit">
                      <X class="w-4 h-4" />
                    </Button>
                  </div>
                </template>

                <Button variant="ghost" class="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100" @click="handleLogout">
                  <LogOut class="w-4 h-4 mr-2" /> 로그아웃
                </Button>

                <Separator class="my-2" />

                <!-- Withdrawal Dialog -->
                <Dialog>
                  <DialogTrigger as-child>
                    <Button variant="ghost" class="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-xs">
                      <Trash2 class="w-3 h-3 mr-2" /> 회원 탈퇴
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
                      <DialogDescription>
                        탈퇴 시 계정은 즉시 영구 삭제됩니다.<br/>
                        이 작업은 되돌릴 수 없습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose as-child>
                        <Button variant="outline">취소</Button>
                      </DialogClose>
                      <Button variant="destructive" @click="handleWithdraw">탈퇴하기</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Stats -->
        <Card>
          <CardContent class="p-4 grid grid-cols-3 gap-2 text-center divide-x">
            <div>
              <div class="text-xl font-bold text-primary">{{ activity.myPlans.length }}</div>
              <div class="text-xs text-slate-500">Plans</div>
            </div>
             <div>
              <div class="text-xl font-bold text-primary">{{ activity.likedPlaces.length }}</div>
              <div class="text-xs text-slate-500">Places</div>
            </div>
             <div>
              <div class="text-xl font-bold text-primary">{{ activity.myVideos.length }}</div>
              <div class="text-xs text-slate-500">Videos</div>
            </div>
          </CardContent>
        </Card>
      </aside>

      <!-- Main Content: Tabs & Lists -->
      <main class="lg:col-span-3">
        <!-- Custom Tabs -->
        <div class="flex items-center border-b mb-6">
          <button 
            @click="activeTab = 'plans'"
            :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]', 
              activeTab === 'plans' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800']"
          >
            <div class="flex items-center gap-2">
              <Map class="w-4 h-4" />
              <span>내 여행 계획</span>
            </div>
          </button>
          <button 
            @click="activeTab = 'places'"
            :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]', 
              activeTab === 'places' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800']"
          >
             <div class="flex items-center gap-2">
              <Heart class="w-4 h-4" />
              <span>찜한 여행지</span>
            </div>
          </button>
          <button 
            @click="activeTab = 'videos'"
            :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]', 
              activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800']"
          >
             <div class="flex items-center gap-2">
              <Video class="w-4 h-4" />
              <span>업로드한 영상</span>
            </div>
          </button>
        </div>

        <!-- Content Area -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else>
          <!-- Plans Tab -->
          <div v-if="activeTab === 'plans'" class="space-y-6">
            <div v-if="activity.myPlans.length === 0" class="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
              <Map class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p class="text-slate-500">아직 작성한 여행 계획이 없습니다.</p>
              <Button class="mt-4" @click="$router.push('/plan/create')">새 계획 만들기</Button>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlanCard 
                v-for="plan in activity.myPlans" 
                :key="plan.id" 
                :plan="plan" 
              />
            </div>
          </div>

          <!-- Places Tab -->
          <div v-if="activeTab === 'places'" class="space-y-6">
            <div v-if="activity.likedPlaces.length === 0" class="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
              <Heart class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p class="text-slate-500">찜한 여행지가 없습니다.</p>
              <Button class="mt-4" @click="$router.push('/search')">여행지 둘러보기</Button>
            </div>
             <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PlaceCard 
                v-for="place in activity.likedPlaces" 
                :key="place.placeId" 
                :place="place"
              />
            </div>
          </div>

          <!-- Videos Tab -->
          <div v-if="activeTab === 'videos'" class="space-y-6">
             <div v-if="activity.myVideos.length === 0" class="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
              <Video class="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p class="text-slate-500">업로드한 영상이 없습니다.</p>
              <Button class="mt-4" @click="$router.push('/video/upload')">영상 업로드하기</Button>
            </div>
             <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoCard 
                v-for="video in activity.myVideos" 
                :key="video.id" 
                :video="video"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>