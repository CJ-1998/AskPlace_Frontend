<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import { usePlaceStore } from '@/features/place/stores/place'
import type { PlaceSummary } from '@/features/place/types/place'

const emit = defineEmits<{
  (e: 'add-place', place: PlaceSummary): void
}>()

const placeStore = usePlaceStore()
// Use computed for reactivity
import { computed } from 'vue'
const placeList = computed(() => placeStore.places)
const loading = computed(() => placeStore.isLoading)
const currentPage = computed(() => placeStore.currentPage)
const totalPages = computed(() => placeStore.totalPages)

const searchQuery = ref('')

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  // Search resets page to 0 inside the store
  await placeStore.fetchPlaces(searchQuery.value, undefined, 0, false)
}

const handleLoadMore = async () => {
  const nextPage = currentPage.value + 1
  if (nextPage < totalPages.value) {
    await placeStore.fetchPlaces(searchQuery.value, undefined, nextPage, true)
  }
}

// Logic reused from original
const onClone = (element: PlaceSummary) => {
  return { ...element }
}
</script>

<template>
  <div class="w-80 border-r bg-white flex flex-col">
    <!-- Search Bar -->
    <div class="p-4 border-b space-y-2">
      <div class="relative flex gap-2">
        <div class="relative flex-1">
            <Input 
            v-model="searchQuery"
            type="text" 
            placeholder="여행지 검색" 
            class="pl-3 bg-slate-100 border-none focus-visible:ring-primary/50"
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
        <Button size="icon" variant="ghost" @click="handleSearch" class="text-slate-600 hover:text-slate-900">
            <i class="fa-solid fa-magnifying-glass"></i>
        </Button>
      </div>
    </div>
    
    <!-- Place List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
      <div class="text-xs font-bold text-slate-500 mb-2">
          검색 결과 <span v-if="placeList.length > 0">({{ placeList.length }})</span>
      </div>
      
      <div v-if="loading" class="py-10 text-center text-slate-400">
          <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
          <p class="text-xs">검색 중...</p>
      </div>

      <div v-else-if="placeList.length === 0" class="py-10 text-center text-slate-400">
          <p class="text-xs">검색 결과가 없습니다.</p>
          <p class="text-[10px] mt-1 text-slate-300">키워드를 입력하고 검색해보세요.</p>
      </div>

      <VueDraggable
        v-else
        :model-value="placeList"
        :group="{ name: 'places', pull: 'clone', put: false }"
        :clone="onClone"
        class="space-y-3"
      >
        <div 
          v-for="place in placeList" 
          :key="place.placeId" 
          class="flex gap-3 p-2 border rounded-lg hover:shadow-sm cursor-grab active:cursor-grabbing bg-white group"
        >
          <img 
            :src="place.placeThumbnailImageUrl || place.placeImageUrl || '/placeholder.png'" 
            :alt="place.placeName"
            class="w-12 h-12 rounded bg-slate-200 object-cover shrink-0"
          >
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold truncate">{{ place.placeName }}</div>
            <div class="text-xs text-slate-400 truncate">{{ place.placeAddress }}</div>
          </div>
          <button 
            @click="emit('add-place', place)" 
            class="ml-auto text-blue-600 hover:text-blue-800 transition-colors p-2"
          >
            <i class="fa-solid fa-plus-circle text-xl"></i>
          </button>
        </div>
      </VueDraggable>

      <!-- Load More Button -->
      <div v-if="placeList.length > 0 && currentPage + 1 < totalPages" class="pt-2 pb-4 text-center">
        <Button 
          variant="outline" 
          size="sm" 
          class="w-full text-xs text-slate-500 hover:text-slate-700" 
          @click="handleLoadMore"
          :disabled="loading"
        >
          <span v-if="loading">
            <i class="fa-solid fa-circle-notch fa-spin mr-1"></i> 로딩 중
          </span>
          <span v-else>
            더 보기 <i class="fa-solid fa-chevron-down ml-1"></i>
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>
