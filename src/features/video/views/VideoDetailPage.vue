<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVideoStore } from '@/features/video/stores/video'
import NavigationBar from '@ui/navigation-bar/NavigationBar.vue'
import { placeApi } from '@/features/place/api/place'
import { getLatestVideoByPlace } from '@/features/video/api/video'
import type { PlaceSummary } from '@/features/place/types/place'
import type { Video } from '@/features/video/types/video'
import placeholderImg from '@/assets/placeholder.png'

const router = useRouter()
const route = useRoute()
const videoStore = useVideoStore()

const video = computed(() => videoStore.currentVideo)
interface PlaceWithVideo extends PlaceSummary {
    latestVideo?: Video
}
const nearbyPlaces = ref<PlaceWithVideo[]>([])
const loadingNearby = ref(false)

const fetchNearbyPlaces = async () => {
    if (!video.value?.placeId) return
    loadingNearby.value = true
    nearbyPlaces.value = []

    try {
        const placeDetail = await placeApi.getPlaceDetail(video.value.placeId)
        if (placeDetail) {
            const result = await placeApi.getNearbyPlaces(placeDetail.latitude, placeDetail.longitude, 5.0)
            
            // Filter exclude current place
            const candidates = result.placeSearchResponseDtoList
                .filter(p => p.placeId !== video.value?.placeId)
            
            // Check for videos for each candidate
            const placesWithVideos: PlaceWithVideo[] = []
            
            // Limit to checking first 10 to avoid too many requests, we want top 3
            for (const place of candidates.slice(0, 10)) {
                if (placesWithVideos.length >= 3) break;
                
                try {
                    const latestVideo = await getLatestVideoByPlace(place.placeId)
                    if (latestVideo) {
                        placesWithVideos.push({ ...place, latestVideo })
                    }
                } catch (e) {
                    // Ignore error for individual checks
                }
            }
            
            nearbyPlaces.value = placesWithVideos
        }
    } catch (e) {
        console.error('Failed to fetch nearby places:', e)
    } finally {
        loadingNearby.value = false
    }
}

const handleGoToPlaceVideo = (placeId: string) => {
    router.push({ path: '/videos', query: { placeId } })
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = placeholderImg
}

onMounted(() => {
    if (route.params.id) {
        videoStore.fetchVideoById(route.params.id as string)
    }
})

watch(() => video.value, (newVideo) => {
    if (newVideo) {
        fetchNearbyPlaces()
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
        <video 
           controls
           controlsList="nodownload noplaybackrate"
           disablePictureInPicture
           class="w-full h-full object-cover"
           :src="video.preSignedUrl"
        >
        </video>
        
        <div class="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none">
          <h1 class="text-2xl font-bold mb-1">{{ video.title }}</h1>
          <p class="text-gray-300 text-sm">
             <i class="fa-solid fa-location-dot"></i> {{ video.placeName || 'Unknown Location' }} • {{ video.author }} • 조회수 {{ video.viewCount }}
          </p>
        </div>
      </div>

      <!-- Video Description -->
      <div class="mt-4 p-4 bg-slate-900/50 rounded-xl mb-8">
          <p>{{ video.description }}</p>
      </div>

      <!-- Nearby Live Videos -->
      <div class="mb-8">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
              <i class="fa-solid fa-map-location-dot text-emerald-400"></i>
              주변 여행지 실시간 영상
          </h2>

          <div v-if="loadingNearby" class="text-center py-8 text-gray-500">
             <i class="fa-solid fa-circle-notch fa-spin"></i> 로딩중...
          </div>
          
          <div v-else-if="nearbyPlaces.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                v-for="place in nearbyPlaces" 
                :key="place.placeId"
                class="bg-slate-900 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-emerald-500 transition-all border border-slate-800"
                @click="handleGoToPlaceVideo(place.placeId)"
              >
                  <div class="aspect-video relative overflow-hidden">
                      <!-- Use Video Thumbnail if available, fallback to place image -->
                      <img 
                        :src="place.latestVideo?.thumbnailUrl || place.placeThumbnailImageUrl || placeholderImg" 
                        class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        :alt="place.placeName"
                        @error="handleImageError"
                      />
                      <div class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                          <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div> ACTIVE
                      </div>
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div class="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                              <i class="fa-solid fa-play text-white ml-0.5"></i>
                          </div>
                      </div>
                  </div>
                  <div class="p-3">
                      <h3 class="font-bold text-sm truncate text-slate-100">{{ place.placeName }}</h3>
                      <p class="text-xs text-slate-400 truncate mt-1">{{ place.placeAddress }}</p>
                  </div>
              </div>
          </div>
          
          <div v-else class="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
             <p class="text-gray-500">영상을 찾을 수 없습니다.</p>
          </div>
      </div>

    </div>

    <div v-else class="container mx-auto px-4 py-12 text-center">
      <p class="text-gray-400">영상을 찾을 수 없습니다.</p>
    </div>
  </div>
</template>