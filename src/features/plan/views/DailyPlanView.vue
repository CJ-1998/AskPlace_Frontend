<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanStore } from '@/features/plan/stores/plan'
import { mapToDailyPlanDetail } from '@/features/plan/utils/dailyPlanMapper'
import type { DailyPlanDetail } from '@/features/plan/types/dailyPlan'
import DailyPlanHeader from '@/features/plan/components/daily/DailyPlanHeader.vue'
import DailyTimelineItem from '@/features/plan/components/daily/DailyTimelineItem.vue'
import ItineraryMap from '@/features/plan/components/ItineraryMap.vue'
import { Button } from '@/shared/components/ui/button'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()

const isLoading = ref(false)
const currentDay = ref(1)
const dailyPlan = ref<DailyPlanDetail | null>(null)
const totalDays = ref<number[]>([])

const fetchDailyPlan = async () => {
    const planId = route.params.planId as string
    const day = currentDay.value

    isLoading.value = true
    
    // 1. Ensure Plan Data is loaded
    if (!planStore.currentPlan || planStore.currentPlan.id !== planId) {
        await planStore.fetchPlanById(planId)
    }

    const currentTravelPlan = planStore.currentPlan

    if (!currentTravelPlan) {
        // Handle Error: Plan not found
        isLoading.value = false
        return
    }

    // 2. Set Total Days for Pagination
    if (currentTravelPlan.dailyPlans) {
        totalDays.value = currentTravelPlan.dailyPlans.map(d => d.dayNumber)
        
        // 3. Find the specific day's plan
        const targetDailyPlan = currentTravelPlan.dailyPlans.find(d => d.dayNumber === day)
        
        if (targetDailyPlan) {
            // 4. Map to View Model
            dailyPlan.value = mapToDailyPlanDetail(targetDailyPlan, currentTravelPlan)
        } else {
            console.error(`Day ${day} not found in plan`)
            dailyPlan.value = null
        }
    }

    isLoading.value = false
}

// Route Watcher for Day Navigation
watch(
  () => [route.params.day, route.params.planId],
  ([newDay, newPlanId]) => {
    if (newDay && newPlanId) {
      currentDay.value = parseInt(newDay as string, 10)
      fetchDailyPlan()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  { immediate: true }
)

const handleDayChange = (day: number) => {
  router.push({ 
    name: 'daily-plan', 
    params: { 
      planId: route.params.planId, 
      day: day 
    } 
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <div class="max-w-3xl mx-auto px-4 py-8">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="dailyPlan" class="fade-in">
         <!-- 0. Map Section -->
         <div class="h-[300px] mb-6 rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <ItineraryMap :day-plan="dailyPlan" />
         </div>

         <!-- 1. Header -->
         <DailyPlanHeader :planDetail="dailyPlan" />

         <!-- 2. Timeline List -->
         <div class="space-y-0">
             <DailyTimelineItem 
               v-for="(spot, index) in dailyPlan.spots" 
               :key="spot.uid"
               :spot="spot"
               :is-last-item="index === dailyPlan.spots.length - 1"
             />
         </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 text-slate-500">
        데이터를 불러올 수 없습니다.
      </div>

      <!-- 3. Footer Navigation (Day Pagination) -->
      <div class="bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40">
        <div class="max-w-3xl mx-auto flex items-center justify-between">
            <Button
                variant="outline"
                size="sm"
                @click="router.push({ name: 'plan-detail', params: { id: route.params.planId } })"
            >
                <i class="fa-solid fa-arrow-left mr-2"></i> 전체 일정
            </Button>
           
           <div class="flex gap-2 overflow-x-auto">
              <Button 
                v-for="day in totalDays" 
                :key="day"
                :variant="currentDay === day ? 'default' : 'outline'"
                size="sm"
                @click="handleDayChange(day)"
              >
                 {{ day }}일차 {{ currentDay === day ? '(현재)' : '' }}
              </Button>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
