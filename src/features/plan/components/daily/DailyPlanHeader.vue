<script setup lang="ts">
import { computed } from 'vue'
import type { DailyPlanDetail } from '@/features/plan/types/dailyPlan'
import { MapPin, Clock, Car, Wallet } from 'lucide-vue-next'

interface Props {
  planDetail: DailyPlanDetail
}

const props = defineProps<Props>()

// 통계 포맷팅을 위한 Helper
const formattedDistance = computed(() => {
  return `${props.planDetail.stats.totalDistanceKm.toFixed(1)}km`
})

const formattedDuration = computed(() => {
  const hours = Math.floor(props.planDetail.stats.totalDurationMinutes / 60)
  const minutes = props.planDetail.stats.totalDurationMinutes % 60
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`
})

const formattedCost = computed(() => {
  return `₩${props.planDetail.stats.totalCost.toLocaleString()}`
})
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
    <!-- Header Title Area -->
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-xs font-bold">
          {{ planDetail.dayNumber }}일차
        </span>
        <span class="text-slate-400 text-sm">{{ planDetail.date }}</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-800">
        {{ planDetail.themeTitle || `${planDetail.dayNumber}일차 여행` }}
      </h2>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
      <!-- 1. Total Spots -->
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white rounded-full text-red-500 shadow-sm">
          <MapPin class="w-4 h-4" />
        </div>
        <div>
          <div class="text-xs text-slate-400">총 장소</div>
          <div class="font-bold text-slate-700">{{ planDetail.stats.totalSpots }}개</div>
        </div>
      </div>

      <!-- 2. Total Duration -->
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white rounded-full text-purple-500 shadow-sm">
          <Clock class="w-4 h-4" />
        </div>
        <div>
          <div class="text-xs text-slate-400">총 소요</div>
          <div class="font-bold text-slate-700">{{ formattedDuration }}</div>
        </div>
      </div>

      <!-- 3. Total Distance -->
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white rounded-full text-blue-500 shadow-sm">
          <Car class="w-4 h-4" />
        </div>
        <div>
          <div class="text-xs text-slate-400">총 이동</div>
          <div class="font-bold text-slate-700">{{ formattedDistance }} 이동</div>
        </div>
      </div>

      <!-- 4. Total Cost -->
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white rounded-full text-yellow-500 shadow-sm">
          <Wallet class="w-4 h-4" />
        </div>
        <div>
          <div class="text-xs text-slate-400">예산</div>
          <div class="font-bold text-slate-700">{{ formattedCost }} 예상</div>
        </div>
      </div>
    </div>
  </div>
</template>
