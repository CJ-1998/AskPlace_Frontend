<script setup lang="ts">
import { computed } from 'vue'
import type { DailySpot } from '@/features/plan/types/dailyPlan'
import DailySpotCard from './DailySpotCard.vue'
import { MoreHorizontal, Footprints, Car, Bus } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'

interface Props {
  spot: DailySpot
  isLastItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLastItem: false
})

const transportIcon = computed(() => {
    switch (props.spot.nextTransport?.mode) {
        case 'CAR': return Car
        case 'PUBLIC': return Bus
        default: return Footprints
    }
})
</script>

<template>
  <div class="relative">
    <!-- ROW 1: Spot Card & Solid Line -->
    <div class="flex gap-4 md:gap-6">
       <!-- Left Axis -->
       <div class="flex flex-col items-center shrink-0 w-14 lg:w-16 pt-0">
          <!-- Time Badge -->
          <div class="bg-slate-100 text-slate-600 font-bold text-[10px] md:text-sm px-2.5 py-1 rounded-full border border-slate-200 z-10 whitespace-nowrap shadow-sm">
             {{ spot.arrivalTime || '00:00' }}
          </div>
          <!-- Solid Line (Spans the card height) -->
          <div v-if="!isLastItem || spot.nextTransport" class="w-0.5 bg-slate-200 grow mt-2 rounded-full"></div>
          <!-- End Dot (Only for absolute last item) -->
          <div v-else class="w-3 h-3 rounded-full bg-red-500 mt-2 ring-4 ring-red-100"></div>
       </div>

       <!-- Right Content -->
       <div class="flex-1">
          <DailySpotCard :spot="spot">
            <template #action>
                <Button variant="ghost" size="icon" class="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full">
                    <MoreHorizontal class="w-5 h-5" />
                </Button>
            </template>
          </DailySpotCard>
       </div>
    </div>

    <!-- ROW 2: Transport Info & Dotted Line (Rendered if nextTransport exists) -->
    <div v-if="spot.nextTransport && !isLastItem" class="flex gap-4 md:gap-6 min-h-[60px]">
       <!-- Left Axis (Dotted) -->
       <div class="flex flex-col items-center shrink-0 w-14 lg:w-16">
          <div class="w-0.5 border-l-2 border-dashed border-slate-300 grow h-full opacity-60"></div>
       </div>

       <!-- Right Content (Transport Details) -->
       <div class="flex-1 flex items-center py-4 pl-2">
           <div class="flex items-center gap-3 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100/50">
               <component :is="transportIcon" class="w-4 h-4 text-slate-400" />
               <div class="text-xs text-slate-500 font-medium">
                   <span class="text-slate-700 font-bold mr-1">{{ spot.nextTransport.mode === 'WALK' ? '도보' : '차량' }} 이동</span>
                   <span>약 {{ spot.nextTransport.durationMinutes }}분 ({{ spot.nextTransport.distanceKm }}km)</span>
               </div>
           </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
/* No usage of external CSS needed, handled by Tailwind */
</style>
