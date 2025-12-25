<script setup lang="ts">
import type { UserActivity } from '@/features/user/types/user'
import { Button } from '@ui/button'
import PlanCard from '@/features/plan/components/PlanCard.vue'
import VideoCard from '@/features/video/components/VideoCard.vue'
import WishlistCard from '@/features/user/components/WishlistCard.vue'
import { useWishlist } from '@/shared/composables/useWishlist'
import { Map, Heart, Video } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Props {
  activity: UserActivity
  isLoading: boolean
  activeTab: 'plans' | 'places' | 'videos'
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'plans' | 'places' | 'videos'): void
}>()

const router = useRouter()
const { savedPlaces } = useWishlist()
</script>

<template>
  <main class="lg:col-span-3">
    <!-- 상단 탭 -->
    <div class="flex items-center border-b mb-6">
      <button 
        @click="emit('update:activeTab', 'plans')"
        :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]', 
          activeTab === 'plans' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800']"
      >
        <div class="flex items-center gap-2">
          <Map class="w-4 h-4" />
          <span>내 여행 계획</span>
        </div>
      </button>
      <button 
        @click="emit('update:activeTab', 'places')"
        :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]', 
          activeTab === 'places' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800']"
      >
         <div class="flex items-center gap-2">
          <Heart class="w-4 h-4" />
          <span>찜한 여행지</span>
        </div>
      </button>
      <button 
        @click="emit('update:activeTab', 'videos')"
        :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]', 
          activeTab === 'videos' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800']"
      >
         <div class="flex items-center gap-2">
          <Video class="w-4 h-4" />
          <span>업로드한 영상</span>
        </div>
      </button>
    </div>

    <!-- 콘텐츠 영역 -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <!-- 계획 탭 내용 -->
      <div v-if="activeTab === 'plans'" class="space-y-6">
        <div v-if="activity.myPlans.length === 0" class="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
          <Map class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-slate-500">아직 작성한 여행 계획이 없습니다.</p>
          <Button class="mt-4" @click="router.push({ name: 'plan-create' })">새 계획 만들기</Button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlanCard 
            v-for="plan in activity.myPlans" 
            :key="plan.id" 
            :plan="plan" 
          />
        </div>
      </div>

      <!-- 찜한 여행지 탭 내용 (Local Wishlist) -->
      <div v-if="activeTab === 'places'" class="space-y-6">
        <div v-if="savedPlaces.length === 0" class="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
          <Heart class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-slate-500">아직 찜한 여행지가 없습니다.</p>
          <Button class="mt-4" @click="router.push({ name: 'place-search' })">여행지 둘러보기</Button>
        </div>
         <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WishlistCard 
            v-for="place in savedPlaces" 
            :key="place.placeId" 
            :place="place"
          />
        </div>
      </div>

      <!-- 업로드한 영상 탭 내용 -->
      <div v-if="activeTab === 'videos'" class="space-y-6">
         <div v-if="activity.myVideos.length === 0" class="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
          <Video class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-slate-500">업로드한 영상이 없습니다.</p>
          <Button class="mt-4" @click="router.push({ name: 'video-upload' })">영상 업로드하기</Button>
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
</template>
