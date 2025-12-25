<script setup lang="ts">
import type { WishPlace } from '@/shared/composables/useWishlist'
import { MapPin, Heart } from 'lucide-vue-next'
import { Card, CardContent } from '@ui/card'
import { Badge } from '@ui/badge'
import placeHolderImage from '@/assets/placeholder.png'
import { useWishlist } from '@/shared/composables/useWishlist'

interface Props {
  place: WishPlace
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [id: string | number]
}>()

const { removeFromWishlist } = useWishlist()

const handleHeartClick = (e: Event) => {
  e.stopPropagation()
  removeFromWishlist(props.place.placeId)
}

const handleCardClick = () => {
    emit('click', props.place.placeId)
}
</script>

<template>
  <Card 
    class="overflow-hidden bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative h-full flex flex-col p-0 gap-0"
    @click="handleCardClick"
  >
    <!-- Wishlist Button (Always Red/Active in Wishlist View) -->
    <button 
      @click="handleHeartClick"
      class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
    >
      <Heart 
        class="w-5 h-5 fill-red-500 text-red-500 transition-colors hover:scale-110"
      />
    </button>
    
    <div class="aspect-[4/3] w-full overflow-hidden relative shrink-0">
      <img 
        :src="place.thumbnailUrl || placeHolderImage" 
        :alt="place.placeName" 
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    
    <CardContent class="p-4 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-bold text-gray-900 line-clamp-1 flex-1 mr-2">{{ place.placeName }}</h3>
      </div>

      <div class="flex items-start gap-1 text-sm text-gray-500 mb-3 flex-1">
        <MapPin class="w-3 h-3 mt-1 shrink-0" />
        <span class="line-clamp-2 break-keep">{{ place.address }}</span>
      </div>

      <div class="flex flex-wrap gap-2 mt-auto">
        <Badge 
            variant="outline" 
            class="rounded-md font-bold px-2 py-1 border bg-slate-50 text-slate-700"
        >
          {{ place.category }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
