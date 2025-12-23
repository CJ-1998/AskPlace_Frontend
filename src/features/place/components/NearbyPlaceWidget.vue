<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePlaceStore } from '@/features/place/stores/place'
import { storeToRefs } from 'pinia'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@ui/button'

const placeStore = usePlaceStore()
const { nearbyPlaces, isLoading } = storeToRefs(placeStore)

const locationError = ref<string | null>(null)

const detectLocationAndFetch = () => {
    locationError.value = null
    if (!navigator.geolocation) {
        locationError.value = "Geolocation is not supported by your browser."
        return
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords
            placeStore.fetchNearbyPlaces(latitude, longitude)
        },
        (error) => {
            console.error('Geolocation error:', error)
            locationError.value = "위치 정보를 가져올 수 없습니다."
        }
    )
}

onMounted(() => {
    detectLocationAndFetch()
})
</script>

<template>
    <div class="space-y-4 py-4">
        <div class="flex items-center justify-between px-4">
            <h2 class="text-lg font-bold">내 주변 여행지</h2>
            <Button variant="ghost" size="sm" class="text-xs text-muted-foreground" @click="detectLocationAndFetch">
                <i class="fa-solid fa-location-crosshairs mr-1"></i> 위치 갱신
            </Button>
        </div>

        <div v-if="isLoading" class="flex justify-center py-8">
            <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>

        <div v-else-if="locationError" class="p-4 text-center text-sm text-red-500 bg-red-50 mx-4 rounded-md">
            {{ locationError }}
        </div>

        <div v-else-if="nearbyPlaces.length === 0" class="p-4 text-center text-sm text-muted-foreground bg-slate-50 mx-4 rounded-md">
            주변에 등록된 여행지가 없습니다.
        </div>

        <!-- Horizontal Scroll Container -->
        <div v-else class="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide snap-x">
            <div 
                v-for="place in nearbyPlaces" 
                :key="place.placeId" 
                class="min-w-[160px] w-[160px] flex-none bg-white rounded-lg shadow-sm border overflow-hidden snap-start cursor-pointer hover:shadow-md transition-shadow"
            >
                <!-- Image -->
                <div class="aspect-[4/3] bg-slate-100 relative">
                    <img 
                        v-if="place.placeThumbnailImageUrl" 
                        :src="place.placeThumbnailImageUrl" 
                        alt="thumbnail" 
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                        <i class="fa-regular fa-image text-2xl"></i>
                    </div>
                </div>
                <!-- Info -->
                <div class="p-2">
                    <h3 class="font-bold text-sm truncate">{{ place.placeName }}</h3>
                    <p class="text-xs text-muted-foreground truncate">{{ place.placeAddress }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
</style>
