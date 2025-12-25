<script setup lang="ts">
import type { Place } from '@/features/place/types/place'
import { MapPin } from 'lucide-vue-next'
import { Card, CardContent } from '@ui/card'
import { Badge } from '@ui/badge'
import placeHolderImage from '@/assets/placeholder.png'
import { getContentTypeLabel, getContentTypeColor } from '@/features/place/utils/contentTypeMapper'

interface Props {
  place: Place
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()

const handleClick = () => {
  emit('click', props.place.placeId)
}
</script>

<template>
  <Card 
    class="overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative p-0 gap-0"
    @click="handleClick"
  >
    <div class="aspect-[16/9] w-full overflow-hidden relative">
      <img 
        :src="place.placeThumbnailImageUrl || place.placeImageUrl || placeHolderImage" 
        :alt="place.placeName" 
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    
    <CardContent class="p-3">
      <div class="mb-1">
        <h3 class="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{{ place.placeName }}</h3>
      </div>

      <div class="flex items-start gap-1 text-xs text-gray-500 mb-2">
        <MapPin class="w-3 h-3 mt-0.5 shrink-0" />
        <span class="line-clamp-1">{{ place.placeAddress }}</span>
      </div>

      <div class="flex flex-wrap gap-1">
        <Badge 
            variant="outline" 
            class="rounded text-[10px] px-1.5 py-0.5 border"
            :class="getContentTypeColor(place.contentTypeId)"
        >
          {{ getContentTypeLabel(place.contentTypeId) }}
        </Badge>
        <Badge variant="secondary" class="bg-slate-100 text-slate-600 rounded text-[10px] px-1.5 py-0.5 font-normal">
          {{ place.region }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
