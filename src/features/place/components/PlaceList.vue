<script setup lang="ts">
import type { Place } from '@/features/place/types/place'

interface Props {
  places: Place[]
}

defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <PlaceListItem 
      v-for="place in places"
      :key="place.placeId"
      :place="place"
      @click="emit('click', place.placeId)"
    />
  </div>
</template>
