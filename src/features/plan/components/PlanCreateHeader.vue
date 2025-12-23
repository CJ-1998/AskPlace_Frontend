<script setup lang="ts">
import { ref } from 'vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ui/popover'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { ChevronDownIcon } from 'lucide-vue-next'
import { RangeCalendar } from '@ui/range-calendar'
import {
  getLocalTimeZone,
  DateFormatter,
  type DateValue
} from '@internationalized/date'
import { Switch } from '@ui/switch'
import { Label } from '@ui/label'

// --- Props (v-model) ---
const title = defineModel<string>('title', { required: true })
// Relaxing type to avoid strict mismatch between DateValue and CalendarDate/ZonedDateTime
const dateRange = defineModel<any>('dateRange', { required: true })
const isPublic = defineModel<boolean>('isPublic', { default: true })

const props = defineProps<{
  readOnly?: boolean
}>()

const emit = defineEmits<{
  save: []
}>()

const isCalendarOpen = ref(false)
const placeholder = ref<DateValue | undefined>(undefined)

const dateFormatter = new DateFormatter('ko-KR', {
  month: 'short',
  day: 'numeric'
})

if (dateRange.value.start) {
  placeholder.value = dateRange.value.start
}

const handleSave = () => {
  if (props.readOnly) return
  emit('save')
}
</script>

<template>
  <div class="h-16 border-b bg-white px-4 flex items-center justify-between shrink-0 gap-4">
    <!-- Title Input -->
    <div class="flex-1 max-w-md">
      <Input 
        v-model="title" 
        :readonly="readOnly"
        class="font-bold text-lg border-transparent hover:border-slate-200 focus-visible:ring-0 px-2 disabled:opacity-100 disabled:cursor-default"
        placeholder="여행 제목을 입력하세요"
      />
    </div>

    <!-- Date Picker -->
    <Popover v-if="!readOnly" v-model:open="isCalendarOpen">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          class="w-[280px] justify-between text-left font-normal"
          :class="!dateRange.start && 'text-muted-foreground'"
        >
          <div class="flex items-center">
            <i class="fa-regular fa-calendar mr-2"></i>
            <template v-if="dateRange.start">
              <template v-if="dateRange.end">
                {{ dateFormatter.format(dateRange.start.toDate(getLocalTimeZone())) }} - {{ dateFormatter.format(dateRange.end.toDate(getLocalTimeZone())) }}
              </template>
              <template v-else>
                {{ dateFormatter.format(dateRange.start.toDate(getLocalTimeZone())) }}
              </template>
            </template>
            <template v-else>
              <span>날짜 선택</span>
            </template>
          </div>
          <ChevronDownIcon class="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 flex items-center" align="start">
        <RangeCalendar
          v-model="dateRange"
          v-model:placeholder="placeholder"
          :number-of-months="2"
          class="rounded-md border bg-white"
        />
      </PopoverContent>
    </Popover>
    
    <!-- ReadOnly Date Display -->
    <div v-else class="w-[280px] px-3 py-2 text-sm border rounded-md bg-slate-50 text-slate-600 flex items-center">
        <i class="fa-regular fa-calendar mr-2"></i>
        <template v-if="dateRange.start">
            {{ dateFormatter.format(dateRange.start.toDate(getLocalTimeZone())) }}
            <template v-if="dateRange.end">
             - {{ dateFormatter.format(dateRange.end.toDate(getLocalTimeZone())) }}
            </template>
        </template>
    </div>

    <!-- Public Toggle -->
    <div class="flex items-center space-x-2 ml-auto mr-4" v-if="!readOnly">
      <Switch 
        id="public-mode" 
        v-model:checked="isPublic"
      />
      <Label for="public-mode" class="text-xs font-medium cursor-pointer">
        {{ isPublic ? '공개' : '비공개' }}
      </Label>
    </div>

    <!-- Save Buttons -->
    <div class="flex gap-2" v-if="!readOnly">
      <Button 
        @click="handleSave" 
        size="sm"
        class="text-xs font-bold bg-primary hover:bg-indigo-600"
      >
        저장
      </Button>
    </div>
  </div>
</template>
