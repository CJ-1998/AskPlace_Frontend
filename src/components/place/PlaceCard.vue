<template>
  <Card class="cursor-pointer group border-0 shadow-none bg-transparent" @click="handleClick">
    <CardContent class="p-0">
      <div class="rounded-xl overflow-hidden mb-3 h-48 relative">
        <img 
          :src="place.image" 
          :alt="place.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform"
        >
        <span 
          v-if="place.live" 
          class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold"
        >
          LIVE
        </span>
      </div>
      <h3 class="font-bold text-lg">{{ place.title }}</h3>
      <p class="text-slate-500 text-sm">{{ place.location }}</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import type { Place } from '@/types/place'

const props = defineProps<{
  place: Place
}>()

const router = useRouter()

const handleClick = () => {
  router.push({ name: 'place-detail', params: { id: props.place.id } })
}
</script>
