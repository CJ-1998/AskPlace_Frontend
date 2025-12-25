<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { Button } from '@ui/button'
import type { Place } from '@/features/place/types/place'
import {
  getLocalTimeZone,
  DateFormatter,
  type DateValue
} from '@internationalized/date'
import placeholderImg from '@/assets/placeholder.png'

// v-model for dailyPlans
const dailyPlans = defineModel<Place[][]>('dailyPlans', { required: true })

const props = defineProps<{
  readOnly?: boolean
  startDate?: DateValue
}>()

const emit = defineEmits<{
  (e: 'add-day'): void
  (e: 'remove-place', dayIndex: number, placeIndex: number): void
}>()

const dateFormatter = new DateFormatter('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  weekday: 'short'
})

const getFormattedDate = (dayIndex: number) => {
  if (!props.startDate) return ''
  try {
    const date = props.startDate.toDate(getLocalTimeZone())
    date.setDate(date.getDate() + dayIndex)
    return dateFormatter.format(date)
  } catch (e) {
    return ''
  }
}

const getDayStats = (places: Place[]) => {
  let budget = 0
  let duration = 0
  places.forEach(p => {
    budget += p.budget || 0
    duration += p.durationMinutes || 0
  })
  return { budget, duration }
}
</script>

<template>
  <div class="flex-1 bg-slate-100 p-6 overflow-y-auto custom-scroll">
    <div class="flex gap-4 h-full overflow-x-auto">
      <div 
        v-for="(items, dayIndex) in dailyPlans" 
        :key="dayIndex" 
        class="flex-1 bg-slate-50 rounded-xl border border-slate-300 p-5 flex flex-col gap-4 min-w-[320px] shadow-sm"
      >
        <div class="font-bold text-center pb-3 border-b text-slate-800 flex flex-col gap-3">
          <!-- Title Row -->
          <div class="flex justify-between items-end w-full px-1">
            <div class="flex items-baseline gap-2">
              <span class="text-xl">{{ dayIndex + 1 }}일차</span>
              <span class="text-xs text-slate-500 font-normal">{{ getFormattedDate(dayIndex) }}</span>
            </div>
            
          </div>
          
          <!-- Stats Row -->
          <div class="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-slate-100 text-sm text-slate-600 font-medium shadow-sm">
             <span class="flex items-center gap-1.5">
               <i class="fa-solid fa-coins text-xs text-slate-400"></i> 
               <strong class="font-bold text-slate-700">{{ getDayStats(items).budget.toLocaleString() }} 원</strong>
             </span>
             <span class="flex items-center gap-1.5">
               <i class="fa-regular fa-clock text-xs text-slate-400"></i>
               <strong class="font-bold text-slate-700">{{ items.length }}곳</strong>
             </span>
          </div>
        </div>
        
        <!-- Drop Zone -->
        <VueDraggable
          v-model="dailyPlans[dayIndex]"
          group="places"
          class="flex-1 flex flex-col gap-3 min-h-[100px]"
          ghost-class="ghost"
          :disabled="readOnly"
        >
          <div 
            v-for="(item, index) in items" 
            :key="index" 
            class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md flex flex-col gap-3 cursor-grab group relative transition-all"
            :class="readOnly ? 'cursor-default' : 'active:cursor-grabbing'"
          >
            <!-- Delete Button (Top-Right) -->
             <button 
                v-if="!readOnly" 
                class="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                @click.stop="emit('remove-place', dayIndex, index)"
            >
              <i class="fa-solid fa-circle-minus text-xlg"></i>
            </button>

            <!-- Top Row: Order, Title -->
            <div class="flex items-center gap-3 w-full">
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {{ index + 1 }}
                </div>
                
                <img 
                   :src="item.placeThumbnailImageUrl || item.placeImageUrl || placeholderImg" 
                   class="w-12 h-12 rounded-lg object-cover bg-slate-200 border border-slate-100 shrink-0"
                   alt="thumbnail"
                />

                <div class="flex-1 min-w-0">
                  <div class="text-base font-bold truncate text-slate-800">{{ item.placeName }}</div>
                  <div class="text-sm text-slate-500 truncate">{{ item.placeAddress }}</div>
                </div>
            </div>

            <!-- Bottom Row: Planning Inputs (Only show if not readonly) -->
            <div v-if="!readOnly" class="grid grid-cols-2 gap-3 w-full pt-3 border-t border-slate-100 border-dashed mt-1">
                <!-- Start Time -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-slate-600 font-bold">시작 시간</label>
                    <input 
                        v-model="item.startTime" 
                        type="time" 
                        class="border rounded-md px-2 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition-all font-medium"
                    />
                </div>
                
                <!-- End Time -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-slate-600 font-bold">종료 시간</label>
                    <input 
                        v-model="item.endTime" 
                        type="time" 
                         class="border rounded-md px-2 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 transition-all font-medium"
                    />
                </div>

                <!-- Budget -->
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-xs text-slate-600 font-bold">예산 (원)</label>
                     <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₩</span>
                        <input 
                            v-model.number="item.budget" 
                            type="number" 
                            placeholder="0"
                            class="w-full border rounded-md pl-6 pr-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 text-right font-mono transition-all font-medium"
                        />
                     </div>
                </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="items.length === 0" class="h-40 flex flex-col gap-2 items-center justify-center text-slate-400 text-sm border-dashed border-2 border-slate-200 rounded-xl bg-slate-50/50">
            <i class="fa-solid fa-map-location-dot text-2xl opacity-20"></i>
            <span>{{ readOnly ? '일정 없음' : '여행지를 이곳으로 드래그하세요' }}</span>
          </div>
        </VueDraggable>
      </div>
      
      <!-- Add Day Button -->
      <div class="min-w-[60px] flex items-center justify-center" v-if="!readOnly">
         <Button 
          @click="emit('add-day')" 
          variant="outline"
          class="w-12 h-12 rounded-full border-2 border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
        >
           <i class="fa-solid fa-plus text-lg"></i>
         </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
</style>
