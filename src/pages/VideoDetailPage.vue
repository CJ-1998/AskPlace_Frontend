<!-- src/views/VideoDetailPage.vue -->
<template>
  <div class="bg-black min-h-screen text-white flex flex-col">
    <div v-if="video" class="container mx-auto px-4 py-4 flex-1 flex flex-col">
      <!-- Navigation -->
      <div class="flex justify-between items-center mb-4">
        <button 
          @click="router.back()" 
          class="text-sm text-gray-400 hover:text-white"
        >
          <i class="fa-solid fa-arrow-left"></i> 목록으로
        </button>
        <span class="text-red-500 font-bold text-sm animate-pulse">● LIVE</span>
      </div>
      
      <!-- Video Player -->
      <div class="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl mb-6">
        <img 
          :src="video.thumbnail" 
          :alt="video.title"
          class="w-full h-full object-cover opacity-60"
        >
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="fa-solid fa-circle-play text-6xl text-white/80 hover:text-white cursor-pointer"></i>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent">
          <h1 class="text-2xl font-bold mb-1">{{ video.title }}</h1>
          <p class="text-gray-300 text-sm">
            <i class="fa-solid fa-location-dot"></i> {{ video.location }} • 현재 날씨 맑음 ☀️
          </p>
        </div>
      </div>

      <!-- Related Videos -->
      <div class="mt-4">
        <h3 class="font-bold text-lg mb-4 text-gray-200">이 지역의 지난 영상</h3>
        <div class="flex gap-4 overflow-x-auto pb-4 custom-scroll">
          <div 
            v-for="i in 5" 
            :key="i" 
            class="w-40 shrink-0 cursor-pointer hover:opacity-80"
          >
            <div class="h-24 bg-slate-800 rounded-lg mb-2 relative">
              <span class="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded">
                12:30
              </span>
            </div>
            <div class="text-xs text-gray-400">2024.11.{{ 10 + i }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="container mx-auto px-4 py-12 text-center">
      <p class="text-gray-400">영상을 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const store = useAppStore()

const video = computed(() => store.getVideoById(route.params.id as string))
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #1e293b;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}
</style>