<!-- src/views/VideoListPage.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
      실시간 여행지 
      <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <VideoCard 
        v-for="video in store.videos" 
        :key="video.id" 
        :video="video"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/stores/authStore'
import VideoCard from '@/features/video/components/VideoCard.vue'

const store = useAuthStore()
</script>