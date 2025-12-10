<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  lat?: number
  lng?: number
}

const props = withDefaults(defineProps<Props>(), {
  lat: 37.5665,
  lng: 126.9780
})

const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  // Placeholder for map initialization
  // if (window.kakao && window.kakao.maps) { ... }
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-xl border border-slate-200">
    <!-- Grid pattern to simulate map -->
    <div class="absolute inset-0 opacity-[0.03]" 
         style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;">
    </div>
    
    <div class="text-center z-10 p-4 flex flex-col items-center">
      <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
        <i class="fa-solid fa-map-location-dot text-2xl text-primary/50"></i>
      </div>
      <p class="text-slate-500 font-bold">지도 보기</p>
      <p class="text-xs text-slate-400 mt-1 font-mono">LAT: {{ props.lat }} / LNG: {{ props.lng }}</p>
      <p class="text-[10px] text-slate-300 mt-2">Map API Key Required</p>
    </div>
  </div>
</template>
