<script setup lang="ts">
import type { DailyPlan, PlaceDetail } from '@/features/plan/types/plan'
import { getDailyColor } from '@/shared/constants/colors'
import TimelinePlaceItem from './TimelinePlaceItem.vue'

defineProps<{
  day: DailyPlan
}>()

const emit = defineEmits<{
  (e: 'click-place', place: PlaceDetail): void
}>()

</script>

<template>
  <div class="mb-10 relative px-1">
    <div 
      class="flex items-center gap-3 mb-6 sticky top-0 bg-white/95 backdrop-blur z-30 py-3 -mx-2 px-2 border-b border-slate-100"
      :style="{ borderColor: getDailyColor(day.dayNumber) }"
    >
      <div 
        class="flex-shrink-0 w-10 h-10 rounded-xl text-white flex flex-col items-center justify-center shadow-md"
        :style="{ backgroundColor: getDailyColor(day.dayNumber) }"
      >
          <span class="text-[9px] font-bold opacity-80 uppercase">Day</span>
          <span class="text-base font-bold leading-none">{{ day.dayNumber }}</span>
      </div>
      <div class="flex-1">
          <h3 class="font-bold text-lg text-slate-800 leading-tight">
              {{ day.dayNumber }}일차
              <span class="text-slate-400 font-normal text-sm ml-2">{{ day.placeDetails.length }} spots</span>
          </h3>
          <p class="text-xs text-slate-500">{{ day.date }}</p>
      </div>
    </div>

    <div class="space-y-4 ml-2 border-l-2 border-slate-100 pl-6 relative">
      <TimelinePlaceItem
        v-for="(place, index) in day.placeDetails"
        :key="place.placeDetailId"
        :place="place"
        :index="index"
        :day-color="getDailyColor(day.dayNumber)"
        @click-place="emit('click-place', place)"
      />
    </div>
  </div>
</template>
