```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { useAuthStore } from '@/features/auth/stores/auth'
import { useVideoDetail } from '@/features/video/composables/useVideoDetail'
import { formatDate } from '@/lib/date-utils'
import { Button } from '@ui/button'
import { Skeleton } from '@ui/skeleton'
import { ArrowLeft, User, Eye, MapPin, Calendar, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const { video, loading, error, fetchDetail, videoError } = useVideoDetail()
const videoPlayer = ref<HTMLVideoElement | null>(null)

const goBack = () => {
  router.back()
}

// Lifecycle Hooks
onMounted(() => {
  fetchDetail(route.params.id as string)
})

onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.src = ""
    videoPlayer.value.load()
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-5xl">
    
    <!-- Top Bar -->
    <Button variant="ghost" class="mb-4 pl-0 gap-2 hover:bg-transparent hover:text-blue-600" @click="goBack">
      <ArrowLeft class="w-5 h-5" /> Back to Videos
    </Button>

    <!-- Content Area -->
    <div v-if="loading" class="space-y-6">
      <!-- Skeleton Player -->
      <Skeleton class="w-full aspect-video rounded-xl" />
      <!-- Skeleton Meta -->
      <div class="space-y-3">
        <Skeleton class="h-8 w-3/4" />
        <Skeleton class="h-4 w-1/4" />
        <Skeleton class="h-24 w-full" />
      </div>
    </div>

    <div v-else-if="error" class="text-center py-20 bg-slate-50 rounded-xl">
      <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-xl font-bold text-slate-800">Cannot Load Video</h2>
      <p class="text-slate-500 mb-6">Something went wrong while fetching the video.</p>
      <Button @click="fetchDetail">Retry</Button>
    </div>

    <div v-else-if="video" class="space-y-6 animate-in fade-in duration-500">
      
      <!-- Video Player Section -->
      <div class="rounded-xl overflow-hidden shadow-2xl bg-black">
        <video 
          ref="videoPlayer"
          controls 
          autoplay 
          crossorigin="anonymous"
          class="w-full h-full max-h-[70vh] object-contain mx-auto"
          :src="video.preSignedUrl"
          @error="videoError('Video playback error (URL might be expired)')"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <!-- Metadata Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Main Info -->
        <div class="md:col-span-2 space-y-4">
          <h1 class="text-3xl font-bold text-slate-900 leading-tight">{{ video.title }}</h1>
          
          <div class="flex items-center gap-4 text-sm text-slate-500 border-b pb-4">
            <span class="flex items-center gap-1">
              <Eye class="w-4 h-4" /> {{ video.viewCount?.toLocaleString() }} views
            </span>
            <span class="flex items-center gap-1">
              <Calendar class="w-4 h-4" /> {{ formatDate(video.createdAt) }}
            </span>
          </div>

          <div class="prose prose-slate max-w-none">
            <h3 class="text-lg font-semibold mb-2">Description</h3>
            <p class="whitespace-pre-wrap text-slate-700 leading-relaxed">{{ video.description || 'No description provided.' }}</p>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Uploader Card -->
          <div class="bg-slate-50 p-4 rounded-lg border">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User class="w-6 h-6" />
              </div>
              <div>
                <div class="font-semibold text-slate-900">{{ video.author }}</div>
                <div class="text-xs text-slate-500">Uploader</div>
              </div>
            </div>
            <Button class="w-full" variant="outline" size="sm">View Profile</Button>
          </div>

          <!-- Location Badge (Required) -->
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800">
            <div class="flex items-center gap-2 font-medium mb-1">
              <MapPin class="w-4 h-4" /> Related Place
            </div>
            <p class="text-sm">Place ID: {{ video.placeId }}</p>
            <Button variant="link" class="p-0 h-auto text-blue-600 text-xs mt-2">View Map &rarr;</Button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
