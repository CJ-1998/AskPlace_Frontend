import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/shared/composables/useToast'
import { usePlanStore } from '@/features/plan/stores/plan'
import type { Place, PlaceSummary, PlaceDetail } from '@/features/place/types/place'
import type {
  TravelPlanRequestDto,
  DailyPlanRequestDto,
  PlacePlanRequestDto
} from '@/features/plan/types/plan'
import {
  getLocalTimeZone,
  today,
  type DateValue,
  parseDate
} from '@internationalized/date'
import { createPlanRequestDto, mapDomainToPlaces } from '@/features/plan/utils/planMappers'

import { useAuthStore } from '@/features/auth/stores/auth'

export function usePlanCreate() {
  const router = useRouter()
  const { showToast } = useToast()
  const planStore = usePlanStore()
  const authStore = useAuthStore()

  const title = ref('나의 즐거운 여행')
  const isReadOnly = ref(false)

  const now = today(getLocalTimeZone())
  const dateRange = ref<{
    start: DateValue | undefined
    end: DateValue | undefined
  }>({
    start: now,
    end: now.add({ days: 1 })
  })

  // dailyPlans stores Place (alias for PlaceDetail)
  const dailyPlans = ref<Place[][]>([
    [],
  ])

  // Check for Draft Plan from CreateDialog
  if (planStore.draftPlan) {
    const draft = planStore.draftPlan
    title.value = draft.title

    if (draft.startDate && draft.endDate) {
      try {
        const start = parseDate(draft.startDate)
        const end = parseDate(draft.endDate)
        dateRange.value = { start, end }

        // Initialize Daily Plans
        const startJS = start.toDate(getLocalTimeZone())
        const endJS = end.toDate(getLocalTimeZone())
        const diffTime = Math.abs(endJS.getTime() - startJS.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

        dailyPlans.value = Array.from({ length: diffDays }, () => [])
      } catch (e) {
        console.error('Failed to parse draft dates', e)
      }
    }
    // Clear draft so it doesn't persist
    planStore.clearDraftPlan()
  }

  const planId = ref<string | null>(null)

  const loadPlanData = async (id: string) => {
    const plan = await planStore.fetchPlanById(id)
    if (!plan) {
      showToast('여행 계획을 불러오는데 실패했습니다.')
      router.push({ name: 'plan-list' })
      return
    }

    // Ownership Check
    const currentUser = authStore.userUuid
    console.log('[Ownership Check] Plan Author:', plan.user?.uuid, 'Current User:', currentUser)

    if (String(plan.user?.uuid) !== String(currentUser)) {
      isReadOnly.value = true
      showToast('작성자만 수정할 수 있습니다. 읽기 전용 모드로 전환됩니다.')
    } else {
      isReadOnly.value = false
    }

    planId.value = id
    title.value = plan.title

    try {
      if (plan.startDate && plan.endDate) {
        dateRange.value = {
          start: parseDate(plan.startDate),
          end: parseDate(plan.endDate)
        }
      }
    } catch (e) {
      console.error('Date parsing failed', e)
    }

    if (plan.dailyPlans) {
      dailyPlans.value = mapDomainToPlaces(plan)
    }
  }

  const addDay = () => {
    if (isReadOnly.value) return
    dailyPlans.value.push([])
  }

  const addToItinerary = (place: PlaceSummary | PlaceDetail) => {
    if (isReadOnly.value) return
    if (dailyPlans.value.length === 0) {
      addDay()
    }

    // Normalize to PlaceDetail
    const normalizedPlace: PlaceDetail = {
      ...place,
      region: 'region' in place ? place.region : (place as PlaceSummary).placeRegion,
      siGunGu: 'siGunGu' in place ? place.siGunGu : (place as PlaceSummary).placeSiGunGu
    }

    dailyPlans.value[0].push(normalizedPlace)
    showToast(`${place.placeName}이(가) 1일차에 추가되었습니다.`)
  }

  const removePlace = (dayIndex: number, placeIndex: number) => {
    if (isReadOnly.value) return
    if (dailyPlans.value[dayIndex]) {
      dailyPlans.value[dayIndex].splice(placeIndex, 1)
    }
  }

  const handleSave = async () => {
    if (isReadOnly.value) {
      showToast('권한이 없습니다.')
      return
    }

    if (!dateRange.value.start) {
      showToast('여행 시작 날짜를 선택해주세요.')
      return
    }

    if (!title.value) {
      showToast('여행 제목을 입력해주세요.')
      return
    }

    const emptyDayIndex = dailyPlans.value.findIndex(day => day.length === 0)
    if (emptyDayIndex !== -1) {
      showToast(`${emptyDayIndex + 1}일차에 여행지를 추가해주세요. 모든 일차는 최소 1곳의 여행지가 필요합니다.`)
      return
    }

    const start = (dateRange.value.start as any).toDate(getLocalTimeZone())

    const durationDays = dailyPlans.value.length
    const end = new Date(start)
    end.setDate(start.getDate() + durationDays - 1)

    const requestDto = createPlanRequestDto(
      title.value,
      dateRange.value as { start: DateValue | undefined; end: DateValue | undefined },
      dailyPlans.value
    )

    if (!requestDto) {
      showToast('날짜 범위가 유효하지 않습니다.')
      return
    }

    try {
      console.log('Sending Plan DTO:', requestDto)

      if (planId.value) {
        // Update
        await planStore.updatePlan(planId.value, requestDto)
        showToast('계획이 성공적으로 수정되었습니다!')
      } else {
        // Create
        await planStore.createPlan(requestDto)
        showToast('계획이 성공적으로 저장되었습니다!')
      }

      setTimeout(() => {
        router.push({ name: 'plan-list' })
      }, 500)
    } catch (error: any) {
      console.error('Plan Save Error:', error)
      if (error.response && error.response.data) {
        console.error('Error Details:', error.response.data)
      }
      showToast('계획 저장 중 오류가 발생했습니다.')
    }
  }

  return {
    title,
    dateRange,
    dailyPlans,
    addDay,
    addToItinerary,
    removePlace,
    handleSave,
    loadPlanData,
    isEditMode: computed(() => !!planId.value),
    isReadOnly // Exported
  }
}
