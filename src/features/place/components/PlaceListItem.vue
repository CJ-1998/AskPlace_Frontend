<script setup lang="ts">
import type { Place } from '@/features/place/types/place'
import { MapPin, Phone } from 'lucide-vue-next'

interface Props {
  place: Place
}

defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()
</script>

<template>
  <div 
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border border-gray-200"
    @click="emit('click', place.placeId)"
  >
    <div class="relative h-48 w-full">
        <img 
          :src="place.placeImageUrl || place.placeThumbnailImageUrl || '/placeholder.jpg'" 
          :alt="place.placeName" 
          class="w-full h-full object-cover transition-transform hover:scale-105"
        />
    </div>
    
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-900">{{ place.placeName }}</h3>
          <p v-if="place.placeDetailAddress" class="mt-1 text-sm text-gray-500">
            {{ place.region }} {{ place.siGunGu }}
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-2 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <MapPin class="w-4 h-4 text-gray-400" />
          <span class="truncate">{{ place.placeAddress }}</span>
        </div>
        <div v-if="place.placePhoneNumber" class="flex items-center gap-2">
          <Phone class="w-4 h-4 text-gray-400" />
          <span>{{ place.placePhoneNumber }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
