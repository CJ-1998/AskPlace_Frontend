import { ref } from 'vue'
import { planApi } from '@/features/plan/api/plan'
import type { TravelPlan } from '@/features/plan/types/plan'
import { getDayColor } from '@/shared/constants/colors'

export const usePlanDetail = (planId: string) => {
  const currentPlan = ref<TravelPlan | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const fetchPlanDetail = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      // 1. Fetch Basic Info
      const planDto = await planApi.getPlanById(planId)
      
      // 2. Fetch Places for each day (Parallel)
      const dayPromises = planDto.dailyPlanResponseDtoList.map(async (day) => {
         const detail = await planApi.getDailyPlanDetail(day.dailyPlanId)
         return {
           ...day,
           places: detail.placePlanResponseDtoList || []
         }
      })
  
      const daysWithPlaces = await Promise.all(dayPromises)
  
      // 3. Transform to Domain Model with Colors
      currentPlan.value = {
        planId: planDto.travelPlanId,
        title: planDto.travelPlanTitle,
        startDate: planDto.travelPlanStartDate,
        endDate: planDto.travelPlanEndDate,
        dailyPlans: daysWithPlaces.map((d, index) => ({
          dailyPlanId: d.dailyPlanId,
          dayNumber: index + 1,
          date: d.dailyPlanDate,
          color: getDayColor(index + 1), // Pass 1-based dayNumber or 0-based index? 
                                         // The util expects dayNumber (1-based) to do (n-1)%31. 
                                         // Let's pass index+1 (Day 1, Day 2...)
          placeDetails: d.places
            .sort((a, b) => a.placePlanOrder - b.placePlanOrder)
            .map(p => ({
              placeDetailId: p.placeId,
              order: p.placePlanOrder,
              placeName: p.placeName,
              latitude: p.placeLatitude,
              longitude: p.placeLongitude,
              contentTypeId: p.placeContentId
          }))
        }))
      }
  
    } catch (err: any) {
      console.error('Failed to load plan:', err)
      error.value = err.message || '여행 계획을 불러오는데 실패했습니다.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentPlan,
    isLoading,
    error,
    fetchPlanDetail
  }
}
