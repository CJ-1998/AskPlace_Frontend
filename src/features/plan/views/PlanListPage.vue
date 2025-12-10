<!-- src/views/PlanListPage.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-end mb-6">
      <h2 class="text-2xl font-bold">여행 계획 🎒</h2>
      <router-link 
        to="/plan/create"
        class="bg-primary text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-600 text-sm"
      >
        + 새 계획 만들기
      </router-link>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard 
        v-for="plan in store.plans" 
        :key="plan.id" 
        :plan="plan"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/stores/authStore'
import PlanCard from '@/features/plan/components/PlanCard.vue'

const store = useAuthStore()
</script>