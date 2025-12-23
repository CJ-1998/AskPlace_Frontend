<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@ui/card'
import type { TravelPlan } from '@/features/plan/types/plan'

const props = defineProps<{
  plan: TravelPlan
}>()

// Computed Stats
const totalPlaces = computed(() => {
  return props.plan.dailyPlans.reduce((sum, day) => sum + day.placeDetails.length, 0)
})

// Mock Data for now as per requirements
const totalTime = computed(() => '12시간 30분')
const totalDistance = computed(() => '45.2km')
const totalCost = computed(() => '₩350,000')

</script>

<template>
  <div class="grid grid-cols-2 gap-3 mb-6">
    <!-- Places -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
            <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">총 장소</div>
        <div class="text-lg font-bold text-slate-900">{{ totalPlaces }}곳</div>
      </CardContent>
    </Card>

    <!-- Time -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <div class="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-1">
            <i class="fa-regular fa-clock"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">총 시간</div>
        <div class="text-lg font-bold text-slate-900">{{ totalTime }}</div>
      </CardContent>
    </Card>

    <!-- Distance -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1">
            <i class="fa-solid fa-car"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">이동 거리</div>
        <div class="text-lg font-bold text-slate-900">{{ totalDistance }}</div>
      </CardContent>
    </Card>

    <!-- Cost -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
         <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-1">
            <i class="fa-solid fa-coins"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">총 예산</div>
        <div class="text-lg font-bold text-slate-900">{{ totalCost }}</div>
      </CardContent>
    </Card>
  </div>
</template>
