<script setup lang="ts">
import type { PlaceSummary } from '@/features/place/types/place'
import { MapPin, Star, Heart } from 'lucide-vue-next'
import { Card, CardContent } from '@ui/card'
import { Badge } from '@ui/badge'
import placeHolderImage from '@/assets/placeholder.png'
import { getContentTypeLabel, getContentTypeColor } from '@/features/place/utils/contentTypeMapper'
import { useWishlist } from '@/shared/composables/useWishlist'

interface Props {
  place: PlaceSummary
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()

const { isInWishlist, toggleWishlist } = useWishlist()

const handleWishlistClick = (e: Event) => {
  e.stopPropagation()
  toggleWishlist({
    placeId: props.place.placeId,
    placeName: props.place.placeName,
    category: getContentTypeLabel(props.place.contentTypeId),
    address: props.place.placeAddress,
    thumbnailUrl: props.place.placeThumbnailImageUrl || props.place.placeImageUrl || placeHolderImage
  })
}
</script>

<template>
  <Card 
    class="overflow-hidden bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative p-0 gap-0"
    @click="emit('click', place.placeId)"
  >
    <!-- Wishlist Button -->
    <button 
      @click="handleWishlistClick"
      class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
    >
      <Heart 
        class="w-5 h-5 transition-colors"
        :class="isInWishlist(place.placeId) ? 'fill-red-500 text-red-500' : 'text-slate-500 hover:text-red-500'"
      />
    </button>
    
    <div class="aspect-[4/3] w-full overflow-hidden relative">
      <img 
        :src=" place.placeThumbnailImageUrl || place.placeImageUrl || placeHolderImage" 
        :alt="place.placeName" 
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    
    <CardContent class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-bold text-gray-900 line-clamp-1 flex-1 mr-2">{{ place.placeName }}</h3>
        
        <!-- TODO : 레이팅, 점수를 띄우는 구간 
        <div class="flex items-center gap-1 text-yellow-500 text-sm shrink-0">
          <Star class="w-4 h-4 fill-current" />
          <span>{{ 4.5 }}</span>
        </div> -->
      </div>

      <div class="flex items-start gap-1 text-sm text-gray-500 mb-3">
        <MapPin class="w-3 h-3 mt-1 shrink-0" />
        <span class="line-clamp-2 break-keep">{{ place.placeAddress }}</span>
      </div>

      <div class="flex flex-wrap gap-2">
        <Badge 
            variant="outline" 
            class="rounded-md font-bold px-2 py-1 border"
            :class="getContentTypeColor(place.contentTypeId)"
        >
          {{ getContentTypeLabel(place.contentTypeId) }}
        </Badge>
        <Badge variant="secondary" class="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md font-normal px-2 py-1">
          {{ place.placeRegion }}
        </Badge>
        <Badge variant="secondary" class="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md font-normal px-2 py-1">
          {{ place.placeSiGunGu}}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
