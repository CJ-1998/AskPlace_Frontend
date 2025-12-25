<script setup lang="ts">
import { ref, computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import { usePlaceStore } from '@/features/place/stores/place'
import { useWishlist } from '@/shared/composables/useWishlist'
import { placeApi } from '@/features/place/api/place'
import type { PlaceSummary, PlaceDetailResponseDto } from '@/features/place/types/place'
import type { WishPlace } from '@/shared/composables/useWishlist'
import placeholderImg from '@/assets/placeholder.png'
import { getContentTypeLabel, getContentTypeColor } from '@/features/place/utils/contentTypeMapper'
import { useToast } from '@/shared/composables/useToast'

const emit = defineEmits<{
  (e: 'add-place', place: PlaceSummary): void
}>()

const props = defineProps<{
  addedPlaceIds?: Set<string>
}>()

const { showToast } = useToast()

const placeStore = usePlaceStore()
const { savedPlaces } = useWishlist()

const placeList = computed(() => placeStore.places)
const placeListWritable = computed({
  get: () => placeList.value,
  set: (val) => {
    // Intentionally empty: dropping an item here effectively deletes it from the source list without adding it to the store.
  }
})
const loading = computed(() => placeStore.isLoading)
const currentPage = computed(() => placeStore.currentPage)
const totalPages = computed(() => placeStore.totalPages)

const searchQuery = ref('')
const activeTab = ref<'search' | 'wishlist'>('search')
const wishlistLoadingId = ref<string | number | null>(null)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  await placeStore.fetchPlaces(searchQuery.value, undefined, 0, false)
}

const handleLoadMore = async () => {
  const nextPage = currentPage.value + 1
  if (nextPage < totalPages.value) {
    await placeStore.fetchPlaces(searchQuery.value, undefined, nextPage, true)
  }
}

const onClone = (element: PlaceSummary) => {
  return { ...element }
}

const onCloneWishlist = (element: WishPlace): PlaceSummary & { isWishlistPlaceholder?: boolean } => {
    // Create a temporary placeholder compatible with PlaceSummary
    return {
        placeId: element.placeId,
        placeName: element.placeName,
        placeAddress: element.address,
        latitude: 0, // Placeholder
        longitude: 0, // Placeholder
        placeRegion: '',
        placeSiGunGu: '',
        placeThumbnailImageUrl: element.thumbnailUrl,
        contentTypeId: undefined, // Or map from category string if possible, but optional
        contentId: '',
        isWishlistPlaceholder: true // Flag to trigger background fetch
    }
}

const addToPlanFromWishlist = async (wishPlace: WishPlace) => {
  if (wishlistLoadingId.value) return
  wishlistLoadingId.value = wishPlace.placeId

  try {
    const detail = await placeApi.getPlaceDetail(String(wishPlace.placeId))
    
    // Map PlaceDetail to PlaceSummary
    const placeSummary: PlaceSummary = {
        placeId: detail.placeId,
        placeName: detail.placeName,
        placeAddress: detail.placeAddress,
        latitude: detail.latitude,
        longitude: detail.longitude,
        placeImageUrl: detail.placeImageUrl,
        placeThumbnailImageUrl: detail.placeThumbnailImageUrl,
        contentId: detail.contentId,
        contentTypeId: detail.contentTypeId,
        placeRegion: detail.region,
        placeSiGunGu: detail.siGunGu,
        placeDetailAddress: detail.placeDetailAddress,
        placeDescription: detail.placeDescription
    }
    
    emit('add-place', placeSummary)
    showToast(`${wishPlace.placeName}을(를) 일정에 추가했습니다.`, 'success')
  } catch (error) {
    console.error('Failed to fetch place details:', error)
    showToast('장소 정보를 불러오는데 실패했습니다.', 'error')
  } finally {
    wishlistLoadingId.value = null
  }
}
</script>

<template>
  <div class="w-[450px] border-r bg-white flex flex-col">
    <!-- Tabs -->
    <div class="flex border-b">
        <button 
            @click="activeTab = 'search'"
            class="flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]"
            :class="activeTab === 'search' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
            <i class="fa-solid fa-magnifying-glass mr-1"></i> 검색
        </button>
        <button 
            @click="activeTab = 'wishlist'"
            class="flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]"
            :class="activeTab === 'wishlist' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
            <i class="fa-solid fa-heart mr-1"></i> 찜 목록
        </button>
    </div>

    <!-- Search Tab Content -->
    <div v-if="activeTab === 'search'" class="flex flex-col flex-1 overflow-hidden">
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
                v-model="placeListWritable"
                :group="{ name: 'places', pull: 'clone', put: true }"
                :clone="onClone"
                class="space-y-3 min-h-[50%]"
            >
                <div 
                v-for="place in placeList" 
                :key="place.placeId" 
                class="flex gap-3 p-2 border rounded-lg hover:shadow-sm cursor-grab active:cursor-grabbing bg-white group"
                >
                <img 
                    :src="place.placeThumbnailImageUrl || place.placeImageUrl || placeholderImg" 
                    :alt="place.placeName"
                    class="w-12 h-12 rounded bg-slate-200 object-cover shrink-0"
                >
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span 
                            class="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                            :class="getContentTypeColor(place.contentTypeId)"
                        >
                            {{ getContentTypeLabel(place.contentTypeId) }}
                        </span>
                    </div>
                    <div class="text-sm font-bold truncate">{{ place.placeName }}</div>
                    <div class="text-xs text-slate-400 truncate">{{ place.placeAddress }}</div>
                </div>
                <button 
                    @click="emit('add-place', place)" 
                    class="ml-auto flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                    :class="props.addedPlaceIds?.has(String(place.placeId)) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:bg-slate-50'"
                    :disabled="props.addedPlaceIds?.has(String(place.placeId))"
                >
                    <i v-if="props.addedPlaceIds?.has(String(place.placeId))" class="fa-solid fa-check"></i>
                    <i v-else class="fa-solid fa-plus-circle text-xl"></i>
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

    <!-- Wishlist Tab Content -->
    <div v-else class="flex flex-col flex-1 overflow-hidden p-4">
        <div class="text-xs font-bold text-slate-500 mb-2">
            내 찜 목록 <span v-if="savedPlaces.length > 0">({{ savedPlaces.length }})</span>
        </div>

        <div v-if="savedPlaces.length === 0" class="py-10 text-center text-slate-400">
             <i class="fa-regular fa-heart text-2xl mb-2"></i>
            <p class="text-xs">찜한 여행지가 없습니다.</p>
            <p class="text-[10px] mt-1 text-slate-300">마음에 드는 여행지를 찜해보세요.</p>
        </div>

        <VueDraggable
            v-else
            v-model="savedPlaces"
            :group="{ name: 'places', pull: 'clone', put: false }"
            :clone="onCloneWishlist"
            class="space-y-3 overflow-y-auto custom-scroll flex-1 p-1"
        >
             <div 
                v-for="item in savedPlaces" 
                :key="item.placeId" 
                class="flex gap-3 p-2 border rounded-lg hover:shadow-sm bg-white group items-center cursor-grab active:cursor-grabbing"
            >
                <img 
                    :src="item.thumbnailUrl || placeholderImg" 
                    :alt="item.placeName"
                    class="w-12 h-12 rounded bg-slate-200 object-cover shrink-0"
                >
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200 bg-slate-50 text-slate-500">
                             {{ item.category || '여행지' }}
                        </span>
                    </div>
                    <div class="text-sm font-bold truncate">{{ item.placeName }}</div>
                    <div class="text-xs text-slate-400 truncate">{{ item.address }}</div>
                </div>
                 <button 
                    @click="addToPlanFromWishlist(item)" 
                    class="ml-auto flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors"
                    :class="props.addedPlaceIds?.has(String(item.placeId)) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'"
                    :disabled="wishlistLoadingId === item.placeId || props.addedPlaceIds?.has(String(item.placeId))"
                >
                    <i v-if="wishlistLoadingId === item.placeId" class="fa-solid fa-circle-notch fa-spin text-blue-600"></i>
                    <i v-else-if="props.addedPlaceIds?.has(String(item.placeId))" class="fa-solid fa-check"></i>
                    <i v-else class="fa-solid fa-plus-circle text-xl text-blue-600 hover:text-blue-800"></i>
                </button>
            </div>
        </VueDraggable>
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
