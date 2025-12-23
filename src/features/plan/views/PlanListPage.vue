<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlanStore } from '@/features/plan/stores/plan'
import PlanCard from '@/features/plan/components/PlanCard.vue'
import CreatePlanDialog from '@/features/plan/components/CreatePlanDialog.vue'
import { Button } from '@ui/button'
import { Input } from '@ui/input'

const store = usePlanStore()
// Removed unused onSearch and keyword ref

onMounted(async () => {
  await store.fetchPlans()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold mb-2">여행 계획 🎒</h2>
        <div class="flex gap-2 w-full md:w-96">
          <Input 
            v-model="store.searchParams.keyword" 
            placeholder="여행 제목 또는 작성자로 검색" 
            @keyup.enter="store.searchPlans"
          />
          <Button @click="store.searchPlans" variant="outline">검색</Button>
        </div>
      </div>
      
      <CreatePlanDialog>
        <Button 
          class="bg-primary text-white font-bold shadow-md hover:bg-indigo-600"
        >
          + 새 여행 계획 만들기
        </Button>
      </CreatePlanDialog>
    </div>
    
    <div v-if="store.isLoading" class="text-center py-20">
      로딩중...
    </div>
    <div v-else-if="store.plans.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard 
        v-for="plan in store.plans" 
        :key="plan.id" 
        :plan="plan"
      />
    </div>
    <div v-else class="text-center py-20 text-slate-400">
      <p>등록된 여행 계획이 없습니다.</p>
    </div>
  </div>
</template>