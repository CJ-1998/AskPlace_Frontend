<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVideoStore } from '@/features/video/stores/video'
import NavigationBar from '@ui/navigation-bar/NavigationBar.vue'

const router = useRouter()
const route = useRoute()
const videoStore = useVideoStore()

const video = computed(() => videoStore.currentVideo)

onMounted(() => {
    if (route.params.id) {
        videoStore.fetchVideoById(route.params.id as string)
    }
})
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

<template>
  <NavigationBar :title="video?.title" />
  <div class="bg-black min-h-screen text-white flex flex-col">
    <div v-if="video" class="container mx-auto px-4 py-4 flex-1 flex flex-col">
      <!-- Video Player -->
      <div class="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl mb-6">
        <!-- Use a placeholder or generated thumbnail. Since we don't have thumbnail field, use preSignedUrl if it's an image or just a poster -->
        <!-- Ideally we should have a thumbnail URL. For now, we will just use a colored div or similar if no thumbnail -->
        <video 
           controls
           class="w-full h-full object-cover"
           :src="video.preSignedUrl"
        >
        </video>
        <!-- Removed overlay to allow native controls -->
        
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none">
          <h1 class="text-2xl font-bold mb-1">{{ video.title }}</h1>
          <p class="text-gray-300 text-sm">
             <i class="fa-solid fa-location-dot"></i> {{ video.placeId ? 'Place ID: ' + video.placeId : 'Unknown Location' }} • 조회수 {{ video.viewCount }}
          </p>
        </div>
      </div>

      <!-- Video Description -->
      <div class="mt-4 p-4 bg-slate-900/50 rounded-xl">
          <p>{{ video.description }}</p>
      </div>

    </div>

    <div v-else class="container mx-auto px-4 py-12 text-center">
      <p class="text-gray-400">영상을 찾을 수 없습니다.</p>
    </div>
  </div>
</template>