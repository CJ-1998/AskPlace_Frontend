<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@ui/dialog'
import { usePlanStore } from '@/features/plan/stores/plan'
import { useToast } from '@/shared/composables/useToast'
import PlanForm from '@/features/plan/components/PlanForm.vue'
import type { PlanFormData } from '@/features/plan/composables/usePlanForm'
import type { TravelPlanRequestDto } from '@/features/plan/types/plan'
import type { Place } from '@/features/place/types/place'
import { resizeDailyPlans } from '@/features/plan/utils/planResizer'

const props = defineProps<{
  planId: string
  initialData: PlanFormData
  currentDailyPlans?: Place[][]
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

const open = ref(false)
const loading = ref(false)
const planStore = usePlanStore()
const { showToast } = useToast()

const handleSubmit = async (data: PlanFormData) => {
  loading.value = true
  try {
    const currentPlan = planStore.currentPlan || await planStore.fetchPlanById(props.planId)
    
    if (!currentPlan) {
        throw new Error('Plan not found')
    }

    // Smart Resizing Logic
    let planToResize = currentPlan

    if (props.currentDailyPlans) {
      // Map Place[][] to domain DailyPlan[] structure strictly for resizing logic
      planToResize = {
        ...currentPlan,
        dailyPlans: props.currentDailyPlans.map((places, idx) => ({
           dailyPlanId: `temp-${idx}`,
           dayNumber: idx + 1,
           date: '', // Resizer calculates this
           placeDetails: places.map(p => ({
             placeDetailId: p.placeId,
             order: 0,
             placeName: p.placeName,
             latitude: p.latitude,
             longitude: p.longitude,
             startTime: p.startTime,
             endTime: p.endTime,
             budget: p.budget
           }))
        }))
      }
    }

    const newDailyPlans = resizeDailyPlans(planToResize, data.startDate, data.endDate)

    const requestDto: TravelPlanRequestDto = {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        dailyPlanRequestDtoList: newDailyPlans
    }
    
    console.log('[EditPlanDialog] Updating Plan:', props.planId, 'Payload:', JSON.stringify(requestDto, null, 2))
    
    await planStore.updatePlan(props.planId, requestDto)
    
    showToast('여행 정보가 수정되었습니다.')
    emit('updated')
    open.value = false
    
    // Refresh
    await planStore.fetchPlanById(props.planId)
    
  } catch (e: any) {
    console.error('[EditPlanDialog] Update Failed:', e)
    if (e.response) {
        console.error('Response Data:', e.response.data)
    }
    showToast('수정에 실패했습니다 (서버 오류).')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[800px] bg-white overflow-visible">
      <DialogHeader>
        <DialogTitle>여행 정보 수정</DialogTitle>
        <DialogDescription>
          여행 제목, 설명, 기간을 수정할 수 있습니다. 기간 변경 시 일정이 자동으로 조정됩니다.
        </DialogDescription>
      </DialogHeader>
      
      <PlanForm 
        :initial-data="initialData"
        :loading="loading" 
        submit-label="수정완료"
        @submit="handleSubmit"
        @cancel="open = false"
      />
    </DialogContent>
  </Dialog>
</template>
