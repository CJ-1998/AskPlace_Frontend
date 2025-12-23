<script setup lang="ts">
import type { PlaceSummary } from '@/features/place/types/place'
import { MapPin, Star } from 'lucide-vue-next'
import { Card, CardContent } from '@ui/card'
import { Badge } from '@ui/badge'
import placeHolderImage from '@/assets/placeholder.png'

interface Props {
  place: PlaceSummary
}

defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()
</script>

<template>
  <Card 
    class="overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
    @click="emit('click', place.placeId)"
  >
    
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
        <h3 class="text-lg font-bold text-gray-900 line-clamp-1">{{ place.placeName }}</h3>
        
        <!-- TODO : 레이팅, 점수를 띄우는 구간  -->
        <div class="flex items-center gap-1 text-yellow-500 text-sm">
          <Star class="w-4 h-4 fill-current" />
          <span>{{ 4.5 }}</span>
        </div>
      </div>

      <div class="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <MapPin class="w-3 h-3" />
        <span class="truncate">{{ place.placeAddress }}</span>
      </div>

      <div class="flex flex-wrap gap-2">
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
