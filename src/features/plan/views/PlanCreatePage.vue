<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/shared/composables/useToast'
import type { Place } from '@/features/place/types/place'
import { VueDraggable } from 'vue-draggable-plus'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { usePlace } from '@/features/place/composables/usePlace'
const router = useRouter()
const { showToast } = useToast()
const { places } = usePlace()

const searchQuery = ref('')
const filteredPlaces = ref<Place[]>([])

// 각 일차별 계획 데이터 (초기값 빈 배열)
const dailyPlans = ref<Place[][]>([
  [], // 1일차
  [], // 2일차
])

onMounted(async () => {
    // await getPlaces()
    filteredPlaces.value = places.value
})

const addToItinerary = (place: Place) => {
  // 기본적으로 1일차에 추가
  dailyPlans.value[0].push(place)
  showToast(`${place.placeName}이(가) 1일차에 추가되었습니다.`)
}

const handleSave = () => {
  // 지금은 실제 저장되는 것은 아니고 무조건 성공이라고 보여주기만함.
  showToast('계획이 저장되었습니다!')
  setTimeout(() => {
    router.push({ name: 'plan' })
  }, 500)
}

const onClone = (element: Place) => {
  // 복사될 객체 반환 (필요하다면 새로운 ID 부여 등)
  return { ...element }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-64px)]">
    <!-- Top Bar -->
    <div class="h-14 border-b bg-white px-4 flex items-center justify-between shrink-0">
      <span class="font-bold text-lg">나의 설악산 여행 (작성중)</span>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="text-xs font-bold">
          임시저장
        </Button>
        <Button 
          @click="handleSave" 
          size="sm"
          class="text-xs font-bold bg-primary hover:bg-indigo-600"
        >
          저장 완료
        </Button>
      </div>
    </div>
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar: Place List -->
      <div class="w-80 border-r bg-white flex flex-col">
        <div class="p-4 border-b">
          <div class="relative">
            <Input 
              v-model="searchQuery"
              type="text" 
              placeholder="여행지 검색" 
              class="pl-3 bg-slate-100 border-none focus-visible:ring-primary/50"
            />
            <i class="fa-solid fa-search absolute right-3 top-2.5 text-slate-400 text-xs"></i>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
          <div class="text-xs font-bold text-slate-500 mb-2">추천 여행지 (드래그 가능)</div>
          
          <VueDraggable
            :model-value="places"
            :group="{ name: 'places', pull: 'clone', put: false }"
            :clone="onClone"
            class="space-y-3"
          >
            <div 
              v-for="place in places" 
              :key="place.placeId" 
              class="flex gap-3 p-2 border rounded-lg hover:shadow-sm cursor-grab active:cursor-grabbing bg-white"
            >
              <img 
                :src="place.placeImageUrl" 
                :alt="place.placeName"
                class="w-12 h-12 rounded bg-slate-200 object-cover"
              >
              <div class="flex-1">
                <div class="text-sm font-bold">{{ place.placeName }}</div>
                <div class="text-xs text-slate-400">{{ place.placeAddress }}</div>
              </div>
              <button 
                @click="addToItinerary(place)" 
                class="ml-auto text-primary hover:text-indigo-700"
              >
                <i class="fa-solid fa-plus-circle"></i>
              </button>
            </div>
          </VueDraggable>
        </div>
      </div>
      
      <!-- Main: Itinerary Builder -->
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
            >
              <div 
                v-for="(item, index) in items" 
                :key="index" 
                class="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex items-center gap-3 cursor-grab active:cursor-grabbing"
              >
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ item.placeName }}</div>
                  <div class="text-xs text-slate-400 truncate">{{ item.placeAddress }}</div>
                </div>
                <button class="text-slate-300 hover:text-red-500" @click="items.splice(index, 1)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div v-if="items.length === 0" class="h-full flex items-center justify-center text-slate-400 text-xs border-dashed border-2 border-slate-200 rounded-lg">
                여행지를 이곳으로 드래그하세요
              </div>
            </VueDraggable>
          </div>
          
          <!-- Add Day Button -->
          <div class="min-w-[50px] flex items-center justify-center">
             <Button 
              @click="dailyPlans.push([])" 
              variant="outline"
              class="w-10 h-10 rounded-full p-0 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition"
            >
               <i class="fa-solid fa-plus"></i>
             </Button>
          </div>
        </div>
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