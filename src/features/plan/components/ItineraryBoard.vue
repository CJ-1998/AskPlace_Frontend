<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { Button } from '@ui/button'
import type { Place } from '@/features/place/types/place'

// v-model for dailyPlans
const dailyPlans = defineModel<Place[][]>('dailyPlans', { required: true })

const props = defineProps<{
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'add-day'): void
  (e: 'remove-place', dayIndex: number, placeIndex: number): void
}>()
</script>

<template>
  <div class="flex-1 bg-slate-100 p-6 overflow-y-auto custom-scroll">
    <div class="flex gap-4 h-full overflow-x-auto">
      <div 
        v-for="(items, dayIndex) in dailyPlans" 
        :key="dayIndex" 
        class="flex-1 bg-slate-50 rounded-xl border p-4 flex flex-col gap-3 min-w-[300px]"
      >
        <div class="font-bold text-center pb-2 border-b text-slate-700 flex justify-between items-center">
          <span>{{ dayIndex + 1 }}일차</span>
          <span class="text-xs text-slate-400">{{ items.length }}곳</span>
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
            class="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-3 cursor-grab group"
            :class="readOnly ? 'cursor-default' : 'active:cursor-grabbing'"
          >
            <!-- Top Row: Order, Title, Delete -->
            <div class="flex items-center gap-3 w-full">
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ item.placeName }}</div>
                  <div class="text-xs text-slate-400 truncate">{{ item.placeAddress }}</div>
                </div>
                <button 
                    v-if="!readOnly" 
                    class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                    @click.stop="emit('remove-place', dayIndex, index)"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Bottom Row: Planning Inputs (Only show if not readonly) -->
            <div v-if="!readOnly" class="grid grid-cols-2 gap-2 text-xs w-full pt-2 border-t border-slate-100 border-dashed">
                <!-- Start Time -->
                <div class="flex flex-col gap-0.5">
                    <label class="text-[10px] text-slate-400">시작 시간</label>
                    <input 
                        v-model="item.startTime" 
                        type="time" 
                        class="border rounded px-1.5 py-1 text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50"
                    />
                </div>
                
                <!-- Duration -->
                <div class="flex flex-col gap-0.5">
                    <label class="text-[10px] text-slate-400">소요 시간(분)</label>
                    <input 
                        v-model.number="item.durationMinutes" 
                        type="number" 
                        placeholder="60"
                        class="border rounded px-1.5 py-1 text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50"
                    />
                </div>

                <!-- Budget -->
                <div class="col-span-2 flex flex-col gap-0.5">
                    <label class="text-[10px] text-slate-400">예산 (원)</label>
                     <div class="relative">
                        <span class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">₩</span>
                        <input 
                            v-model.number="item.budget" 
                            type="number" 
                            placeholder="0"
                            class="w-full border rounded pl-5 pr-2 py-1 text-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none bg-slate-50 text-right font-mono"
                        />
                     </div>
                </div>
            </div>
          </div>
          
          <div v-if="items.length === 0" class="h-full flex items-center justify-center text-slate-400 text-xs border-dashed border-2 border-slate-200 rounded-lg">
            {{ readOnly ? '일정 없음' : '여행지를 이곳으로 드래그하세요' }}
          </div>
        </VueDraggable>
      </div>
      
      <!-- Add Day Button -->
      <div class="min-w-[50px] flex items-center justify-center" v-if="!readOnly">
         <Button 
          @click="emit('add-day')" 
          variant="outline"
          class="w-10 h-10 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition"
        >
           <i class="fa-solid fa-plus"></i>
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
