<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoList } from '@/features/video/composables/useVideoList'
import VideoCard from '@/features/video/components/VideoCard.vue'
import { usePlaceStore } from '@/features/place/stores/place'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import type { PlaceSummary } from '@/features/place/types/place'
import placeholderImg from '@/assets/placeholder.png'

const { videos, loading, init, currentPlaceId } = useVideoList()
const router = useRouter()
const placeStore = usePlaceStore()

const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = computed(() => placeStore.places)
const showResults = ref(false)
const selectedPlaceName = ref('')

// Initialize video list logic
init()

// Fetch place name if refreshing/loading with placeId query
watch(currentPlaceId, async (newId) => {
    if (newId && !selectedPlaceName.value) {
        try {
            await placeStore.getPlaceDetail(newId)
            const detail = placeStore.place
            if (detail) {
                selectedPlaceName.value = detail.placeName
            }
        } catch (e) {
            console.error('Failed to resolve place name', e)
        }
    } else if (!newId) {
        selectedPlaceName.value = ''
    }
}, { immediate: true })

const handleSearch = async () => {
    if (!searchQuery.value.trim()) return
    
    isSearching.value = true
    try {
        await placeStore.fetchPlaces(searchQuery.value, undefined, 0, false)
        showResults.value = true
    } finally {
        isSearching.value = false
    }
}

const selectPlace = (place: PlaceSummary) => {
    selectedPlaceName.value = place.placeName
    // Update URL query param to filter videos
    router.push({ query: { ...router.currentRoute.value.query, placeId: place.placeId } })
    // Clear search states
    showResults.value = false
    searchQuery.value = ''
}

const clearFilter = () => {
    const query = { ...router.currentRoute.value.query }
    delete query.placeId
    router.push({ query })
    selectedPlaceName.value = ''
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 class="text-2xl font-bold flex items-center gap-2 shrink-0">
            실시간 여행지 
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </h2>

        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
            <div class="relative flex gap-2">
                 <div class="relative flex-1">
                    <Input 
                        v-model="searchQuery"
                        type="text" 
                        placeholder="여행지 검색..." 
                        class="bg-white"
                        @keyup.enter="handleSearch"
                    />
                    <button 
                         v-if="searchQuery"
                         @click="searchQuery = ''"
                         class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                 </div>
                 <Button @click="handleSearch" variant="secondary">
                     <i class="fa-solid fa-magnifying-glass"></i>
                 </Button>
            </div>

            <!-- Search Results Dropdown -->
            <div v-if="showResults && searchResults.length > 0" class="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                 <div class="p-2 text-xs text-slate-500 font-bold border-b bg-slate-50">
                     검색 결과 ({{ searchResults.length }})
                 </div>
                 <div 
                    v-for="place in searchResults" 
                    :key="place.placeId"
                    @click="selectPlace(place)"
                    class="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-none flex items-center gap-3"
                >
                    <img 
                        :src="place.placeThumbnailImageUrl || place.placeImageUrl || placeholderImg" 
                        class="w-10 h-10 rounded object-cover bg-slate-200"
                    />
                    <div class="overflow-hidden">
                        <div class="font-bold text-sm truncate">{{ place.placeName }}</div>
                        <div class="text-xs text-slate-500 truncate">{{ place.placeAddress }}</div>
                    </div>
                 </div>
            </div>
            <div v-else-if="showResults && !isSearching" class="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 p-4 text-center text-slate-500 text-sm">
                검색 결과가 없습니다.
            </div>
        </div>
    </div>
    
    <!-- Filter Status -->
    <div v-if="currentPlaceId" class="mb-6 flex items-center gap-2">
        <div class="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-100">
            <i class="fa-solid fa-location-dot"></i>
            {{ selectedPlaceName || '선택된 장소' }}
            <button @click="clearFilter" class="ml-1 hover:bg-blue-100 rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                <i class="fa-solid fa-xmark text-xs"></i>
            </button>
        </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-slate-300 mb-3"></i>
      <p class="text-gray-400">영상을 불러오는 중...</p>
    </div>

    <div v-else-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <VideoCard 
        v-for="video in videos" 
        :key="video.id" 
        :video="video"
      />
    </div>
    
    <div v-else class="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
      <i class="fa-solid fa-video-slash text-4xl text-slate-300 mb-3"></i>
      <p class="text-slate-500 font-medium">등록된 영상이 없습니다.</p>
      <p v-if="currentPlaceId" class="text-sm text-slate-400 mt-1">다른 장소를 검색해보세요.</p>
    </div>
  </div>
</template>