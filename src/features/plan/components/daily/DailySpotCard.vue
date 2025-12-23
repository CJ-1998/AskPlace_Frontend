<script setup lang="ts">
import { computed } from 'vue'
import type { DailySpot } from '@/features/plan/types/dailyPlan'
import { Clock, CheckCircle2, ParkingSquare, MonitorPlay, Wallet } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'

interface Props {
  spot: DailySpot
}

const props = defineProps<Props>()

// 썸네일 방어 코드
const thumbnail = computed(() => props.spot.thumbnailUrl || '/placeholder-place.png')

// 비용 포맷팅
const formattedFee = computed(() => {
  if (props.spot.admissionFee === undefined) return '-'
  return props.spot.admissionFee === 0 ? '무료' : `₩${props.spot.admissionFee.toLocaleString()}`
})
</script>

<template>
  <div class="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div class="flex h-full flex-col sm:flex-row">
      <!-- Left: Image Area (Fixed width on desktop, full on mobile) -->
      <div class="w-full sm:w-40 shrink-0 relative bg-slate-100 h-32 sm:h-auto">
        <img 
          :src="thumbnail" 
          :alt="spot.name" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <!-- Live Badge if available -->
        <div v-if="spot.isLiveVideoAvailable" class="absolute top-2 left-2 z-10">
           <span class="flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm animate-pulse">
             <span class="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
           </span>
        </div>
      </div>

      <!-- Right: Content Area -->
      <div class="flex-1 p-4 flex flex-col justify-between min-h-[160px]">
        <!-- Top Info -->
        <div>
          <div class="flex justify-between items-start gap-2">
            <div>
              <span class="text-xs font-semibold text-blue-600 mb-1 block">{{ spot.category }}</span>
              <h3 class="text-lg font-bold text-slate-900 leading-tight">{{ spot.name }}</h3>
            </div>
            <!-- Action Slot (For Menu, Delete, etc) -->
            <div class="shrink-0">
                <slot name="action"></slot>
            </div>
          </div>
          
          <p class="text-sm text-slate-600 mt-2 line-clamp-2">
            {{ spot.description || '설명이 없습니다.' }}
          </p>
        </div>

        <!-- Metadata Grid / Footer -->
        <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-xs text-slate-500">
          <!-- Duration -->
          <div class="flex items-center gap-1.5">
             <Clock class="w-3.5 h-3.5 text-slate-400" />
             <span>{{ spot.stayDurationMinutes }}분 소요</span>
          </div>

          <!-- Admission -->
          <div class="flex items-center gap-1.5">
             <CheckCircle2 class="w-3.5 h-3.5 text-slate-400" />
             <span>입장료 {{ formattedFee }}</span>
          </div>

          <!-- Budget (Planned) -->
          <div class="flex items-center gap-1.5" v-if="spot.budget !== undefined">
             <Wallet class="w-3.5 h-3.5 text-slate-400" />
             <span>예산 ₩{{ spot.budget.toLocaleString() }}</span>
          </div>

          <!-- Parking -->
          <div v-if="spot.hasParking !== undefined" class="flex items-center gap-1.5">
             <ParkingSquare class="w-3.5 h-3.5 text-slate-400" />
             <span>{{ spot.hasParking ? '주차 가능' : '주차 불가' }}</span>
          </div>
        </div>

        <!-- Optional: Live Video Button -->
        <div v-if="spot.isLiveVideoAvailable" class="mt-4">
            <Button variant="secondary" size="sm" class="w-full text-xs h-9 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-semibold shadow-sm">
                <MonitorPlay class="w-3.5 h-3.5 mr-1.5" />
                실시간 영상 보기 (234명 시청중)
            </Button>
        </div>
      </div>
    </div>
  </div>
</template>
