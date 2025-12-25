<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanCreate } from '@/features/plan/composables/usePlanCreate'
import PlaceSidebar from '@/features/plan/components/PlaceSidebar.vue'
import ItineraryBoard from '@/features/plan/components/ItineraryBoard.vue'
import EditPlanDialog from '@/features/plan/components/EditPlanDialog.vue'
import { Button } from '@ui/button'
import { Settings2 } from 'lucide-vue-next'
import type { PlaceSummary } from '@/features/place/types/place'

const route = useRoute()
const router = useRouter()

const {
  title,
  description,
  dateRange,
  dailyPlans,
  addDay,
  addToItinerary,
  removePlace,
  loadPlanData,
  isEditMode,
  isReadOnly,
} = usePlanCreate()

const addedPlaceIds = computed(() => {
  const ids = new Set<string>()
  dailyPlans.value.forEach(day => {
    day.forEach(place => ids.add(String(place.placeId)))
  })
  return ids
})

const planId = route.params.id as string

const handleAddPlace = (place: PlaceSummary) => {
  addToItinerary(place)
}

const handleRemovePlace = (dayIndex: number, placeIndex: number) => {
  removePlace(dayIndex, placeIndex)
}

const handlePlanUpdated = () => {
  if (planId) {
    router.push({ name: 'plan-detail', params: { id: planId } })
  }
}

onMounted(() => {
  if (planId) {
    loadPlanData(planId)
  }
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-64px)]">
    <!-- Header: Read-only display with Edit Button -->
    <div class="h-16 border-b bg-white px-4 flex items-center justify-between shrink-0 gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold">{{ title }}</h1>
        <div class="text-sm text-slate-500" v-if="dateRange.start">
          {{ dateRange.start }} 
          <span v-if="dateRange.end"> - {{ dateRange.end }}</span>
        </div>
      </div>

      <div class="flex gap-2">
         <!-- Edit Info Trigger -->
         <EditPlanDialog 
           v-if="!isReadOnly && isEditMode"
           :plan-id="planId"
           :initial-data="{ 
              title, 
              description: description || '', 
              startDate: dateRange.start?.toString() || '', 
              endDate: dateRange.end?.toString() || '' 
           }"
           :current-daily-plans="dailyPlans"
           @updated="handlePlanUpdated"
         >
           <Button variant="outline" size="sm" class="gap-2">
             <Settings2 class="w-4 h-4" />
             정보 수정
           </Button>
         </EditPlanDialog>
      </div>
    </div>
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar (Hidden in Read-only for View Mode) -->
      <PlaceSidebar 
        v-if="!isReadOnly"
        :added-place-ids="addedPlaceIds"
        @add-place="handleAddPlace" 
      />
      
      <!-- Board -->
      <ItineraryBoard 
        v-model:dailyPlans="dailyPlans"
        :read-only="isReadOnly"
        @add-day="addDay"
        @remove-place="handleRemovePlace"
      />
    </div>
  </div>
</template>
