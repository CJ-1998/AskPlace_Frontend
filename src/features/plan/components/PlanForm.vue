<script setup lang="ts">
import { computed, watch } from 'vue'
import { usePlanForm, type PlanFormData } from '@/features/plan/composables/usePlanForm'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { Label } from '@ui/label'
import { Textarea } from '@ui/textarea'
import { RangeCalendar } from '@ui/range-calendar'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'

const props = defineProps<{
  initialData?: Partial<PlanFormData>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  (e: 'submit', payload: PlanFormData): void
  (e: 'cancel'): void
}>()

const { title, description, dateRange, isValid, getSubmitPayload } = usePlanForm({
  initialData: props.initialData
})

// Reactivity for async data loading
watch(() => props.initialData, (newData) => {
  if (newData) {
    if (newData.title !== undefined) title.value = newData.title
    if (newData.description !== undefined) description.value = newData.description
    // Parse dates if they are strings
    if (newData.startDate) {
        try { dateRange.value.start = parseDate(newData.startDate) } catch(e) {}
    }
    if (newData.endDate) {
        try { dateRange.value.end = parseDate(newData.endDate) } catch(e) {}
    }
  }
}, { deep: true, immediate: true })

const dateFormatter = new DateFormatter('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const dateDisplay = computed(() => {
  if (!dateRange.value.start) return '날짜를 선택해주세요'
  const start = dateFormatter.format(dateRange.value.start.toDate(getLocalTimeZone()))
  if (!dateRange.value.end) return start
  const end = dateFormatter.format(dateRange.value.end.toDate(getLocalTimeZone()))
  return `${start} - ${end}`
})

const handleSubmit = () => {
  try {
    const payload = getSubmitPayload()
    emit('submit', payload)
  } catch (e) {
    // validation error handled by disabled button or UI feedback
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Title Input -->
    <div class="space-y-2">
      <Label for="title">여행 제목</Label>
      <Input 
        id="title" 
        v-model="title" 
        placeholder="즐거운 여행" 
      />
    </div>

    <!-- Description Input -->
    <div class="space-y-2">
      <Label for="description">설명</Label>
      <Textarea 
        id="description" 
        v-model="description" 
        placeholder="여행에 대한 간단한 설명을 입력하세요." 
        rows="3"
      />
    </div>

    <!-- Date Range Picker (Inline) -->
    <div class="space-y-2">
      <Label>여행 기간</Label>
      <div class="border rounded-md p-4 px-12 bg-slate-50 flex flex-col items-center gap-4">
        <!-- Date Display Header inside the box -->
        <div class="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-full shadow-sm border">
            <CalendarIcon class="w-4 h-4 text-slate-500" />
            <span>{{ dateDisplay }}</span>
        </div>
        
        <!-- Inline Calendar -->
        <RangeCalendar 
          v-model="dateRange" 
          :number-of-months="2"
          class="rounded-md border bg-white shadow-sm" 
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-2 pt-4">
      <Button variant="outline" @click="$emit('cancel')">
        취소
      </Button>
      <Button 
        class="bg-primary text-white" 
        :disabled="!isValid || loading"
        @click="handleSubmit"
      >
        {{ submitLabel || '저장' }}
      </Button>
    </div>
  </div>
</template>
