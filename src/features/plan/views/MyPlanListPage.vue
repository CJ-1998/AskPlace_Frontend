<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanStore } from '@/features/plan/stores/plan'
import PlanCard from '@/features/plan/components/PlanCard.vue'
import { Button } from '@ui/button'

const router = useRouter()
const store = usePlanStore()

onMounted(async () => {
  await store.fetchMyPlans()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-end mb-6">
      <h2 class="text-2xl font-bold">내 여행 계획 ✈️</h2>
      <Button 
        @click="router.push({ name: 'plan-create' })"
        class="bg-primary text-white font-bold shadow-md hover:bg-indigo-600"
      >
        + 새 여행 계획 만들기
      </Button>
    </div>
    
    <div v-if="store.plans.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard 
        v-for="plan in store.plans" 
        :key="plan.id" 
        :plan="plan"
      />
    </div>
    <div v-else class="text-center py-20 text-slate-400">
      <p>아직 등록된 나만의 여행 계획이 없습니다.</p>
      <p class="text-sm mt-2">지금 바로 나만의 여행을 만들어보세요!</p>
    </div>
  </div>
</template>
