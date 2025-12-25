<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SinglePlaceMap from '@/shared/components/map/SinglePlaceMap.vue'
import type { PlaceDetail } from '@/features/place/types/place'
import placeHolderImage from '@/assets/placeholder.png'
import { Heart } from 'lucide-vue-next'
import { useWishlist } from '@/shared/composables/useWishlist'
import { getContentTypeLabel } from '@/features/place/utils/contentTypeMapper'

const router = useRouter()

const props = defineProps<{
  place: PlaceDetail
  nearbyPlaces?: PlaceDetail[]
}>()

const emit = defineEmits<{
  (e: 'request-live'): void
  (e: 'add-plan'): void
}>()

const { isInWishlist, toggleWishlist } = useWishlist()

const handleWishlistClick = () => {
  toggleWishlist({
    placeId: props.place.placeId,
    placeName: props.place.placeName,
    category: getContentTypeLabel(props.place.contentTypeId),
    address: props.place.placeAddress,
    thumbnailUrl: props.place.placeThumbnailImageUrl || props.place.placeImageUrl || placeHolderImage
  })
}

const mapMarkers = computed(() => {
    if (!props.nearbyPlaces) return []
    return props.nearbyPlaces.map(p => ({
        lat: p.latitude,
        lng: p.longitude,
        title: p.placeName,
        id: p.placeId
    }))
})

const handleMarkerClick = (id: string) => {
    router.push({ name: 'place-detail', params: { id } })
}
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden border shadow-sm">
    <!-- Header Image -->
    <div class="h-64 md:h-80 relative group">
      <img 
        :src="place.placeImageUrl || placeHolderImage" 
        :alt="place.placeName"
        class="w-full h-full object-cover"
      >
      <!-- Wishlist Toggle -->
      <button 
        @click="handleWishlistClick"
        class="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-all shadow-sm group-hover:opacity-100"
      >
        <Heart 
          class="w-6 h-6 transition-colors drop-shadow-md"
          :class="isInWishlist(place.placeId) ? 'fill-red-500 text-red-500' : 'text-white hover:text-red-500'"
        />
      </button>

      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
        <div class="text-white">
          <h1 class="text-3xl font-bold mb-1">{{ place.placeName }}</h1>
          <p class="opacity-90">
            <i class="fa-solid fa-location-dot"></i> {{ place.placeAddress }}
          </p>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="p-6 md:p-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">지역</div>
          <div class="font-bold">{{ place.region || '-' }}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">시/군/구</div>
          <div class="font-bold">{{ place.siGunGu|| '-' }}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">전화번호</div>
          <div class="font-bold">{{place.placePhoneNumber || '-'}}</div>
        </div>
      
      </div>

      <!-- Map Section -->
      <div class="mb-8 h-64 md:h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
        <SinglePlaceMap 
          :lat="place.latitude || 37.5665" 
          :lng="place.longitude || 126.9780" 
          :place-name="place.placeName"
          :markers="mapMarkers"
          @marker-click="handleMarkerClick"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-8">
        <button 
          @click="$emit('request-live')" 
          class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-indigo-600 shadow-sm transition-colors"
        >
          <i class="fa-solid fa-video mr-2"></i> 실시간 영상 요청
        </button>
        <button 
          @click="$emit('add-plan')" 
          class="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 shadow-sm transition-colors"
        >
          <i class="fa-solid fa-plus mr-2"></i> 계획에 추가
        </button>
      </div>

      <!-- Description -->
      <div class="mb-12">
          <h3 class="text-lg font-bold mb-2 text-slate-800">상세 설명</h3>
          <p class="text-slate-600 leading-relaxed">{{ place.placeDescription }}</p>
      </div>

      <!-- Nearby Places Slot or Component -->
      <div>
        <h3 class="text-xl font-bold mb-4 text-slate-800">근처 여행지</h3>
        <slot name="nearby"></slot>
      </div>
    </div>
  </div>
</template>
