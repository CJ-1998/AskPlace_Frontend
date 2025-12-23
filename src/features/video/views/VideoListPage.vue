<script setup lang="ts">
import { useVideoList } from '@/features/video/composables/useVideoList'
import VideoCard from '@/features/video/components/VideoCard.vue'

const { videos, loading, init } = useVideoList()
init()
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      실시간 여행지 
      <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
    </h2>
    
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">로딩중...</p>
    </div>

    <div v-else-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <VideoCard 
        v-for="video in videos" 
        :key="video.id" 
        :video="video"
      />
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-gray-400">등록된 영상이 없습니다.</p>
    </div>
  </div>
</template>