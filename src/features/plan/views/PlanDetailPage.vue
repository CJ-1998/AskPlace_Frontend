<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlanStore } from '@/features/plan/stores/plan'
import type { PlaceDetail } from '@/features/plan/types/plan'
import ItineraryTimeline from '@/features/plan/components/ItineraryTimeline.vue'
import ItineraryMap from '@/features/plan/components/ItineraryMap.vue'
import { ScrollArea } from '@ui/scroll-area'
import { useAuthStore } from '@/features/auth/stores/auth'
import { Button } from '@ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const route = useRoute()
const planId = route.params.id as string
const router = useRouter()

const planStore = usePlanStore()
const authStore = useAuthStore()
const { currentPlan, isLoading } = storeToRefs(planStore)

const isOwner = computed(() => {
  return String(currentPlan.value?.user.uuid) === String(authStore.user?.uuid)
})

import { usePlanInteraction } from '@/features/plan/composables/usePlanInteraction'

const { handleDelete, handleClone, handleEdit } = usePlanInteraction()

const mapRef = ref<InstanceType<typeof ItineraryMap> | null>(null)

const fetchPlanDetail = async () => {
    await planStore.fetchPlanById(planId)
}

const handlePlaceClick = (place: PlaceDetail) => {
  if (mapRef.value) {
    mapRef.value.focusPlace(place.latitude, place.longitude)
  }
}

onMounted(() => {
  if (planId) {
    fetchPlanDetail()
  }
})
</script>

<template>
  <div class="h-screen flex flex-col bg-slate-50 overflow-hidden">
    <!-- Header with Buttons -->
    <header class="bg-white border-b px-4 py-3 flex justify-between items-center shrink-0 z-30">
        <div class="flex items-center gap-3">
             <Button variant="ghost" size="icon" @click="router.back()">
                <ArrowLeft class="w-5 h-5" />
            </Button>
            <h1 class="font-bold text-lg truncate max-w-[200px] md:max-w-md">{{ currentPlan?.title }}</h1>
        </div>
        
        <div class="flex gap-2">
            <template v-if="!isLoading && isOwner">
                <Button variant="outline" size="sm" @click="handleEdit(planId)">수정</Button>
                <Button variant="destructive" size="sm" @click="handleDelete(planId)">삭제</Button>
            </template>
            <template v-if="!isLoading && !isOwner && authStore.user">
                <Button variant="default" size="sm" @click="handleClone(planId)">
                    가져오기 (Clone)
                </Button>
            </template>
        </div>
    </header>
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-50 backdrop-blur-sm">
        <div class="flex flex-col items-center gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
            <p class="text-sm text-slate-500 font-medium">여행 계획을 불러오는 중...</p>
        </div>
      </div>
      <main class="w-full h-[35vh] md:h-full md:flex-1 relative bg-slate-100 order-1 md:order-2 shrink-0 md:shrink">
        <ItineraryMap 
          ref="mapRef"
          :plan="currentPlan" 
        />
        
        <div class="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-[10px] md:text-xs z-10 border border-slate-200 hidden md:block">
            <div class="font-bold mb-1 border-b pb-1 text-slate-600">Legend</div>
            <div class="grid grid-cols-2 gap-x-3 gap-y-1">
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-brand"></div> 관광지</div>
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-brand opacity-80"></div> 식당</div>
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-brand opacity-60"></div> 숙소</div>
            </div>
        </div>
      </main>

      <aside class="w-full h-full md:w-[400px] md:h-full bg-white border-t md:border-t-0 md:border-r border-slate-200 z-20 order-2 md:order-1 flex flex-col overflow-hidden shadow-xl md:shadow-none rounded-t-2xl md:rounded-none -mt-4 md:mt-0">
         <ScrollArea class="h-full w-full">
            <div class="p-6 md:p-6 pb-20 md:pb-6">
               <ItineraryTimeline 
                :plan="currentPlan" 
                @click-place="handlePlaceClick"
              />
            </div>
         </ScrollArea>
      </aside>
    </div>
  </div>
</template>

<style scoped>
</style>