<template>
  <div class="flex gap-3 p-3 border rounded-lg hover:shadow-sm cursor-pointer transition-shadow bg-white">
    <div class="w-20 h-20 rounded-md overflow-hidden shrink-0 bg-slate-100">
      <img :src="image" :alt="title" class="w-full h-full object-cover">
    </div>
    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <h4 class="font-bold truncate text-slate-800">{{ title }}</h4>
      <p class="text-xs text-slate-500 mt-1 truncate"><i class="fa-solid fa-location-dot text-slate-300 mr-1"></i>{{ address }}</p>
      <div class="flex items-center gap-1 mt-2 text-xs text-amber-500 font-bold">
        <i class="fa-solid fa-star"></i> {{ rating }} <span class="text-slate-300 font-normal">(120)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  image: string
  address: string
  rating: number
}>()
</script>
