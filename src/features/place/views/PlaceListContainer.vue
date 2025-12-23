<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlaceStore } from '@/features/place/stores/place'
import { storeToRefs } from 'pinia'
import { Loader2, Search } from 'lucide-vue-next'
import { Input } from '@ui/input'
import { Button } from '@ui/button'

const placeStore = usePlaceStore()
const { places, isLoading, error } = storeToRefs(placeStore)

const searchKeyword = ref('')

const handleSearch = () => {
    if (!searchKeyword.value.trim()) {
        // If empty, fetch default recommendations
        placeStore.fetchPlaces()
        return
    }
    placeStore.searchPlaces({ keyword: searchKeyword.value })
}

// Initial fetch
onMounted(() => {
    placeStore.fetchPlaces()
})
</script>

<template>
    <div class="flex flex-col h-full bg-slate-50">
        <!-- Search Bar Header -->
        <div class="p-4 bg-white border-b sticky top-0 z-10">
            <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    v-model="searchKeyword"
                    placeholder="여행지를 검색해보세요 (예: 강남, 카페)"
                    class="pl-9 bg-slate-50 border-none focus-visible:ring-0 focus-visible:bg-white transition-colors"
                    @keyup.enter="handleSearch"
                />
            </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
            
            <div v-if="isLoading && places.length === 0" class="flex justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-primary" />
            </div>

            <div v-else-if="error" class="p-4 bg-red-50 text-red-500 rounded-md text-center text-sm">
                {{ error }}
            </div>

            <div v-else-if="places.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <i class="fa-solid fa-map-location-dot text-4xl mb-3 opacity-20"></i>
                <p>검색 결과가 없습니다.</p>
            </div>

            <template v-else>
                <div v-for="place in places" :key="place.placeId" class="bg-white p-3 rounded-lg border shadow-sm flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                    <!-- Thumbnail -->
                    <div class="w-20 h-20 shrink-0 bg-slate-100 rounded-md overflow-hidden">
                        <img 
                            v-if="place.placeThumbnailImageUrl" 
                            :src="place.placeThumbnailImageUrl" 
                            alt="place" 
                            class="w-full h-full object-cover"
                        />
                         <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                            <i class="fa-regular fa-image text-xl"></i>
                        </div>
                    </div>
                    
                    <!-- Text Info -->
                    <div class="flex flex-col justify-center min-w-0 flex-1">
                        <h3 class="font-bold text-base truncate">{{ place.placeName }}</h3>
                        <p class="text-xs text-muted-foreground line-clamp-2 mt-1">{{ place.placeAddress }}</p>
                        
                        <div class="flex items-center gap-2 mt-2 text-xs text-slate-400">
                            <!-- Tags or Type -->
                            <span v-if="place.contentTypeId" class="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                                {{ place.contentTypeId === '12' ? '관광지' : '여행지' }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
