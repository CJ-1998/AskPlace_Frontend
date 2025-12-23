<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useVideoList } from '@/features/video/composables/useVideoList'
import { formatDate } from '@/lib/date-utils'
import { formatDuration } from '@/lib/time-utils'
import { Button } from '@ui/button'
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@ui/card'
import { Skeleton } from '@ui/skeleton'
import { Eye, User } from 'lucide-vue-next'

const router = useRouter()
const { 
  videos, 
  loading, 
  page, 
  totalPages, 
  currentRegion, 
  changePage, 
  selectRegion,
  init 
} = useVideoList()

// Initialize logic (watcher)
init()

// Navigation
const goToDetail = (id: string) => {
  router.push(`/videos/${id}`)
}

// Region Data
const regions = [
  { label: '전체', value: 'all' },
  { label: '서울', value: 'seoul' },
  { label: '경기', value: 'gyeonggi' },
  { label: '부산', value: 'busan' },
  { label: '제주', value: 'jeju' },
  { label: '강원', value: 'gangwon' },
]
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h1 class="text-3xl font-bold">Trending Videos</h1>
      
      <!-- Region Filter -->
      <div class="flex flex-wrap gap-2">
        <Button 
          v-for="region in regions" 
          :key="region.value"
          variant="outline"
          size="sm"
          :class="{ 'bg-slate-900 text-white hover:bg-slate-800 hover:text-white': currentRegion === region.value }"
          @click="selectRegion(region.value)"
        >
          {{ region.label }}
        </Button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="space-y-4">
        <Skeleton class="h-48 w-full rounded-lg" />
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
      </div>
    </div>

    <!-- Video Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card 
        v-for="video in videos" 
        :key="video.id" 
        class="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
        @click="goToDetail(video.id)"
      >
        <!-- Thumbnail / Video Preview -->
        <div class="relative aspect-video bg-gray-100">
          <video 
            :src="video.preSignedUrl" 
            class="w-full h-full object-cover"
            preload="metadata"
            muted
            crossorigin="anonymous"
            loading="lazy"
            @mouseenter="(e) => (e.target as HTMLVideoElement).play()" 
            @mouseleave="(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }"
          ></video>
          <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {{ formatDuration(video.duration) }}
          </div>
        </div>

        <CardHeader class="p-4 pb-2">
          <CardTitle class="text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {{ video.title }}
          </CardTitle>
          <CardDescription class="flex items-center gap-1 text-sm pt-1">
            <User class="w-3 h-3" /> {{ video.author }}
          </CardDescription>
        </CardHeader>

        <CardFooter class="p-4 pt-0 text-xs text-slate-500 flex justify-between items-center">
          <div class="flex items-center gap-1">
            <Eye class="w-3 h-3" /> {{ video.viewCount }} views
          </div>
          <div>{{ formatDate(video.createdAt) }}</div>
        </CardFooter>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && videos.length === 0" class="text-center py-20 text-slate-500">
      <p class="text-lg">No videos found.</p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="flex justify-center items-center gap-2 mt-10">
      <Button variant="outline" :disabled="page === 0" @click="changePage(page - 1)">
        Previous
      </Button>
      
      <!-- Simple Page Indicator -->
      <span class="text-sm font-medium mx-2">
        Page {{ page + 1 }} of {{ totalPages }}
      </span>

      <Button variant="outline" :disabled="page >= totalPages - 1" @click="changePage(page + 1)">
        Next
      </Button>
    </div>
  </div>
</template>
