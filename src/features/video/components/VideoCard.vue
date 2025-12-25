<!-- src/components/video/VideoCard.vue -->
<template>
  <div class="group cursor-pointer" @click="handleClick">
    <div class="aspect-video bg-slate-900 rounded-xl overflow-hidden relative mb-3">
      <img 
        :src="video.thumbnailUrl || placeholderImg" 
        :alt="video.title"
        class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        @error="handleImageError"
      >
      <div class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
        ACTIVE
      </div>
      <div class="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
        <i class="fa-solid fa-user"></i> {{ video.viewCount }}
      </div>
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
          <i class="fa-solid fa-play text-white"></i>
        </div>
      </div>
    </div>
    <h3 class="font-bold text-sm truncate">{{ video.title }}</h3>
    <p class="text-xs text-slate-500">{{ video.author }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Video } from '@/features/video/types/video'
import placeholderImg from '@/assets/placeholder.png'

const props = defineProps<{
  video: Video
}>()

const router = useRouter()

const handleClick = () => {
  router.push({ name: 'video-detail', params: { id: props.video.id } })
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = placeholderImg
}
</script>