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
import { useRouter } from 'vue-router'
import PlanForm from '@/features/plan/components/PlanForm.vue'
import type { PlanFormData } from '@/features/plan/composables/usePlanForm'

const open = ref(false)
const loading = ref(false)
const planStore = usePlanStore()
const router = useRouter()
const { showToast } = useToast()

const handleSubmit = async (data: PlanFormData) => {
  loading.value = true
  try {
    // Store draft and redirect
    planStore.setDraftPlan({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate
    })
    
    showToast('여행 계획 구성을 시작합니다.')
    open.value = false
    
    // Redirect to create page
    router.push({ name: 'plan-create' })
    
  } catch (e) {
    console.error(e)
    showToast('생성에 실패했습니다.')
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
        <DialogTitle>새 여행 계획 만들기</DialogTitle>
        <DialogDescription>
          여행 제목과 기간을 입력하여 새로운 여행 계획을 시작하세요.
        </DialogDescription>
      </DialogHeader>
      
      <PlanForm 
        submit-label="여행 계획 생성"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="open = false"
      />
    </DialogContent>
  </Dialog>
</template>
