import { defineStore } from 'pinia'
import { ref } from 'vue'
import { planApi } from '@/features/plan/api/plan'
import type {
  TravelPlan,
  DailyPlan,
  PlaceDetail,
  TravelPlanDetailResponseDto,
  DailyPlanDetailResponseDto
} from '@/features/plan/types/plan'

import { getDailyColor } from '@/shared/constants/colors'

export const usePlanStore = defineStore('plan', () => {
  const plans = ref<TravelPlan[]>([])
  const currentPlan = ref<TravelPlan | null>(null)
  const draftPlan = ref<any>(null) // Temporary storage for creation flow
  const isLoading = ref(false)

  // --- Mapper Logic ---
  const transformToDomain = (
    tripDto: TravelPlanDetailResponseDto,
    dailyDetailDtos: DailyPlanDetailResponseDto[]
  ): TravelPlan => {
    // 1. Map Daily Plans
    const dailyPlans: DailyPlan[] = dailyDetailDtos.map((dto, index) => {
      const { dailyPlan, placePlanResponseDtoList } = dto

      // Map Place Details
      const places: PlaceDetail[] = placePlanResponseDtoList.map(p => ({
        placeDetailId: p.placeId,
        order: p.placePlanOrder,
        placeName: p.placeName,
        latitude: p.placeLatitude,
        longitude: p.placeLongitude,
        placeAddress: p.placeAddress,
        placeImageUrl: p.placeThumbnailImageUrl || p.placeImageUrl,
        contentTypeId: p.contentTypeId,
        region: p.region,
        siGunGu: p.siGunGu,
        // Map Planning Fields
        startTime: p.placePlanStartTime,
        endTime: p.placePlanEndTime,
        budget: p.placePlanBudget,
        durationMinutes: (() => {
          if (!p.placePlanStartTime || !p.placePlanEndTime) return 60
          const [startH, startM] = p.placePlanStartTime.split(':').map(Number)
          const [endH, endM] = p.placePlanEndTime.split(':').map(Number)
          const diff = (endH * 60 + endM) - (startH * 60 + startM)
          return diff > 0 ? diff : 60
        })(),
      })).sort((a, b) => a.order - b.order)

      return {
        dailyPlanId: dailyPlan.dailyPlanId,
        dayNumber: index + 1,
        date: dailyPlan.dailyPlanDate,
        color: getDailyColor(index + 1),
        placeDetails: places
      }
    })

    // 2. Map Travel Plan
    return {
      id: tripDto.travelPlanId,
      user: {
        uuid: tripDto.user.uuid,
        name: tripDto.user.name
      },
      title: tripDto.travelPlanTitle,
      description: tripDto.travelPlanDescription,
      startDate: tripDto.travelPlanStartDate,
      endDate: tripDto.travelPlanEndDate,
      duration: `${tripDto.travelPlanTotalDays - 1}박 ${tripDto.travelPlanTotalDays}일` || '1박 2일',
      totalTimeMinutes: tripDto.travelPlanTotalMinutes,
      totalDistance: tripDto.travelPlanTotalDistance,
      budget: tripDto.travelPlanBudget,
      dailyPlans: dailyPlans
    }
  }

  const fetchPlans = async (params?: any) => {
    isLoading.value = true
    try {
      const response = await planApi.getPlans(params)
      // Map DTO to Domain
      plans.value = response.travelPlans.map(dto => ({

        id: dto.travelPlanId,
        user: {
          uuid: dto.travelPlanUserId,
          name: dto.travelPlanAuthor
        },
        title: dto.travelPlanTitle,
        description: dto.travelPlanDescription,
        duration: `${dto.travelTotalDays - 1}박 ${dto.travelTotalDays}일`, // e.g. 1박 2일
        coverImage: `https://source.unsplash.com/random/800x600?travel&sig=${dto.travelPlanId.substring(0, 5)}`,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.travelPlanAuthor}`
      }))
    } catch (error) {
      console.error('Failed to fetch plans', error)
      plans.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyPlans = async () => {
    isLoading.value = true
    try {
      const response = await planApi.getMyPlans()
      // Map DTO to Domain (Same mapping logic as fetchPlans)
      plans.value = response.travelPlans.map(dto => ({
        id: dto.travelPlanId,
        user: {
          uuid: dto.travelPlanUserId,
          name: dto.travelPlanAuthor
        },
        title: dto.travelPlanTitle,
        description: dto.travelPlanDescription,
        duration: `${dto.travelTotalDays - 1}박 ${dto.travelTotalDays}일`,
        coverImage: `https://source.unsplash.com/random/800x600?travel&sig=${dto.travelPlanId.substring(0, 5)}`,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dto.travelPlanAuthor}`
      }))
    } catch (error) {
      console.error('Failed to fetch my plans', error)
      plans.value = []
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlanById = async (id: string) => {
    isLoading.value = true
    currentPlan.value = null
    try {
      // 1. Fetch Basic Plan Info
      const tripDto = await planApi.getPlanById(id)

      // 2. Fetch All Daily Details (Parallel)
      const dailyPromises = tripDto.dailyPlanResponseDtoList.map(d =>
        planApi.getDailyPlanDetail(d.dailyPlanId)
      )
      const dailyDetailDtos = await Promise.all(dailyPromises)

      // 3. Transform & Update State
      currentPlan.value = transformToDomain(tripDto, dailyDetailDtos)

      return currentPlan.value
    } catch (error) {
      console.error('Failed to fetch plan full details', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // --- Search Logic ---
  const searchParams = ref({
    keyword: '',
    region: ''
  })

  // Use fetchPlans for search as well, leveraging params
  const searchPlans = async () => {
    await fetchPlans(searchParams.value)
  }

  const createPlan = async (planData: any) => {
    return await planApi.createPlan(planData)
  }

  const clonePlan = async (id: string) => {
    return await planApi.clonePlan(id)
  }

  return {
    plans,
    currentPlan,
    isLoading,
    searchParams,
    fetchPlans,
    fetchMyPlans,
    fetchPlanById,
    createPlan,
    searchPlans,
    clonePlan,
    updatePlan: async (id: string, planData: any) => {
      return await planApi.updatePlan(id, planData)
    },
    deletePlan: async (id: string) => {
      return await planApi.deletePlan(id)
    },
    draftPlan,
    setDraftPlan: (data: any) => { draftPlan.value = data },
    clearDraftPlan: () => { draftPlan.value = null }
  }
})

