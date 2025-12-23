<script setup lang="ts">
import { TravelPlan, PlaceDetail } from '@/features/plan/types/plan'
import TripSummary from '@/features/plan/components/TripSummary.vue'
import { Card, CardContent } from '@ui/card'
import { Badge } from '@ui/badge'
import { Separator } from '@ui/separator'
import { Button } from '@/shared/components/ui/button'
import { useRouter } from 'vue-router'

import { getPlaceIcon, getCategoryName } from '@/features/plan/utils/planMappers'

const props = defineProps<{
  plan: TravelPlan | null
}>()

const emit = defineEmits<{
  (e: 'click-place', place: PlaceDetail): void
}>()

const router = useRouter()
</script>

<template>
  <div v-if="plan" class="h-full pr-2">
    <!-- Travel Title Section -->
    <div class="mb-6 px-2 pt-2">
        <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ plan.title }}</h2>
        <div class="text-slate-500 text-sm flex items-center gap-2 mb-4">
            <Badge variant="outline" class="font-normal bg-slate-50">
                <i class="fa-regular fa-calendar mr-2" />
                {{ plan.startDate }} - {{ plan.endDate }}
            </Badge>
        </div>
        
        <!-- Dashboard Summary -->
        <TripSummary :plan="plan" />
    </div>

    <Separator class="mb-6" />

    <!-- Daily Loop -->
    <div v-for="(day, dIndex) in plan.dailyPlans" :key="day.dailyPlanId" class="mb-10 relative px-1">
      <!-- Day Header -->
      <div class="flex items-center gap-3 mb-6 sticky top-0 bg-white/95 backdrop-blur z-30 py-3 -mx-2 px-2 border-b border-slate-100">
        <div class="flex-shrink-0 w-10 h-10 bg-brand rounded-xl text-white flex flex-col items-center justify-center shadow-md ring-2 ring-brand/20">
            <span class="text-[9px] font-bold opacity-80 uppercase">Day</span>
            <span class="text-base font-bold leading-none">{{ day.dayNumber }}</span>
        </div>
        <div class="flex-1 flex justify-between items-center">
            <h3 class="font-bold text-lg text-slate-800 leading-tight">
                {{ day.date }}
                <span class="text-slate-400 font-normal text-sm ml-2">{{ day.placeDetails.length }} spots</span>
            </h3>
            
            <Button
                variant="ghost" 
                size="sm" 
                class="text-xs text-slate-500 hover:text-brand hover:bg-brand/5 h-8 px-2"
                @click="router.push({ name: 'daily-plan', params: { planId: plan?.id, day: day.dayNumber } })"
            >
                상세보기 <i class="fa-solid fa-chevron-right ml-1 text-[10px]"></i>
            </Button>
        </div>
      </div>

      <!-- Places Timeline -->
      <div class="space-y-4 ml-2 border-l-2 border-slate-100 pl-6 relative">
        <div 
            v-for="(place, pIndex) in day.placeDetails" 
            :key="place.placeDetailId"
            class="relative group"
            @click="emit('click-place', place)"
        >
            <!-- Timeline Connectors -->
             <div 
                class="absolute -left-[31px] top-6 w-4 h-4 rounded-full border-[3px] border-white shadow-sm transition-all z-10"
                :class="[pIndex === 0 ? 'bg-brand scale-110' : 'bg-slate-300 group-hover:bg-brand group-hover:scale-110']"
            ></div>

            <!-- Place Card -->
            <Card class="hover:border-brand cursor-pointer transition-all hover:shadow-md group-hover:-translate-y-0.5">
                <CardContent class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <Badge variant="secondary" class="text-xs font-medium text-slate-500 bg-slate-100 group-hover:text-brand group-hover:bg-brand/10 transition-colors">
                            <i :class="[getPlaceIcon(place.contentTypeId), 'mr-1.5']"></i>
                            {{ getCategoryName(place.contentTypeId) }}
                        </Badge>
                        <span class="text-[10px] text-slate-300 font-mono font-bold">#{{ place.order }}</span>
                    </div>
                    
                    <h4 class="font-bold text-slate-800 text-base mb-1 group-hover:text-brand transition-colors line-clamp-1">
                        {{ place.placeName }}
                    </h4>
                    
                    <div class="text-xs text-slate-400 flex items-center gap-1">
                       <i class="fa-solid fa-location-arrow text-[10px] opacity-50"></i> 
                       <span>지도에서 위치 확인</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20">
    <div class="text-slate-300 text-5xl mb-4"><i class="fa-regular fa-map"></i></div>
    <p class="text-slate-500">여행 일정이 비어있습니다.</p>
  </div>
</template>

<style scoped>
/* No specific styles needed as we use Tailwind + Shadcn */
</style>
