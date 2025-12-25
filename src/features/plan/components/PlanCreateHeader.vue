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
  stats?: {
    totalBudget: number
    totalDuration: number
    totalSpots: number
  }
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
  <div class="h-20 border-b bg-white px-6 flex items-center justify-between shrink-0 gap-6">
    <!-- Title & Stats -->
    <div class="flex-1 max-w-2xl flex flex-col justify-center gap-1">
      <Input 
        v-model="title" 
        :readonly="readOnly"
        class="font-bold text-xl border-transparent hover:border-slate-200 focus-visible:ring-0 px-2 h-10 p-0 disabled:opacity-100 disabled:cursor-default"
        placeholder="여행 제목을 입력하세요"
      />
      
      <!-- Stats Summary -->
      <div v-if="stats" class="text-base text-slate-600 px-2 flex gap-5 font-medium items-center">
          <span class="flex items-center">
            <i class="fa-solid fa-coins mr-2 text-slate-400 text-sm"></i>
            <strong class="font-bold text-slate-800 mr-0.5">{{ stats.totalBudget.toLocaleString() }}</strong>원
          </span>
          <span class="w-[1.5px] h-3.5 bg-slate-300 my-auto"></span>
          <span class="flex items-center">
            <i class="fa-regular fa-clock mr-2 text-slate-400 text-sm"></i>
            <strong class="font-bold text-slate-800 mr-0.5">{{ Math.floor(stats.totalDuration / 60) }}</strong>시간 
            <strong class="font-bold text-slate-800 ml-1 mr-0.5">{{ stats.totalDuration % 60 }}</strong>분
          </span>
          <span class="w-[1.5px] h-3.5 bg-slate-300 my-auto"></span>
          <span class="flex items-center">
            <i class="fa-solid fa-location-dot mr-2 text-slate-400 text-sm"></i>
            <strong class="font-bold text-slate-800 mr-0.5">{{ stats.totalSpots }}</strong>곳
          </span>
       </div>
    </div>

    <!-- Date Picker -->
    <Popover v-if="!readOnly" v-model:open="isCalendarOpen">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          class="w-[300px] justify-between text-left font-normal text-base h-11"
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
    <div v-else class="w-[300px] px-4 py-2.5 text-base border rounded-md bg-slate-50 text-slate-600 flex items-center">
        <i class="fa-regular fa-calendar mr-2"></i>
        <template v-if="dateRange.start">
            {{ dateFormatter.format(dateRange.start.toDate(getLocalTimeZone())) }}
            <template v-if="dateRange.end">
             - {{ dateFormatter.format(dateRange.end.toDate(getLocalTimeZone())) }}
            </template>
        </template>
    </div>

    <!-- Save Buttons -->
    <div class="flex gap-3" v-if="!readOnly">
      <Button 
        @click="handleSave" 
        size="lg"
        class="font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-8 shadow-sm transition-all hover:scale-105"
      >
        저장
      </Button>
    </div>
  </div>
</template>
