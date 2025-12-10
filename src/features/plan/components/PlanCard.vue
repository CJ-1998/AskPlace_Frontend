<template>
  <Card 
    class="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    @click="handleClick"
  >
    <div class="h-40 relative overflow-hidden">
      <img 
        :src="plan.coverImage" 
        :alt="plan.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform"
      >
      <span class="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur">
        {{ plan.duration }}
      </span>
    </div>
    <CardHeader class="p-4">
      <CardTitle class="text-lg mb-1 group-hover:text-primary">{{ plan.title }}</CardTitle>
      <CardDescription class="text-sm text-slate-500">{{ plan.author }}님의 여행</CardDescription>
    </CardHeader>
    <CardFooter class="p-4 pt-0 flex gap-2 text-xs text-slate-400">
      <span><i class="fa-solid fa-eye"></i> {{ plan.views }}</span>
      <span><i class="fa-solid fa-heart"></i> {{ plan.likes }}</span>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card'
import type { Plan } from '@/features/plan/types/plan'

const props = defineProps<{
  plan: Plan
}>()

const router = useRouter()

const handleClick = () => {
  router.push({ name: 'plan-detail', params: { id: props.plan.id } })
}
</script>
