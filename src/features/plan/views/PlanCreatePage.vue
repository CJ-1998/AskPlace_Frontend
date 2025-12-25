<script setup lang="ts">
import { computed } from 'vue'
import { usePlanCreate } from '@/features/plan/composables/usePlanCreate'
import PlanCreateHeader from '@/features/plan/components/PlanCreateHeader.vue'
import PlaceSidebar from '@/features/plan/components/PlaceSidebar.vue'
import ItineraryBoard from '@/features/plan/components/ItineraryBoard.vue'
import type { PlaceSummary } from '@/features/place/types/place'

const {
  title,
  dateRange,
  dailyPlans,
  addDay,
  addToItinerary,
  removePlace,
  handleSave,
  planStats
} = usePlanCreate()

const addedPlaceIds = computed(() => {
  const ids = new Set<string>()
  dailyPlans.value.forEach(day => {
    day.forEach(place => ids.add(String(place.placeId)))
  })
  return ids
})

const handleAddPlace = (place: PlaceSummary) => {
  addToItinerary(place)
}

const handleRemovePlace = (dayIndex: number, placeIndex: number) => {
  removePlace(dayIndex, placeIndex)
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-64px)]">
    <!-- Header -->
    <PlanCreateHeader 
      v-model:title="title"
      v-model:dateRange="dateRange"
      :stats="planStats"
      @save="handleSave"
    />
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <PlaceSidebar 
        :added-place-ids="addedPlaceIds"
        @add-place="handleAddPlace" 
      />
      
      <!-- Board -->
      <ItineraryBoard 
        v-model:dailyPlans="dailyPlans"
        :start-date="dateRange.start"
        @add-day="addDay"
        @remove-place="handleRemovePlace"
      />
    </div>
  </div>
</template>