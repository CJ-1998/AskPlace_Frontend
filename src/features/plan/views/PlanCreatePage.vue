<script setup lang="ts">
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
  handleSave
} = usePlanCreate()

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

      @save="handleSave"
    />
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <PlaceSidebar @add-place="handleAddPlace" />
      
      <!-- Board -->
      <ItineraryBoard 
        v-model:dailyPlans="dailyPlans"
        @add-day="addDay"
        @remove-place="handleRemovePlace"
      />
    </div>
  </div>
</template>