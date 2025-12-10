<script setup lang="ts">
import { onMounted, ref } from 'vue'

declare global {
  interface Window {
    naver: any;
  }
}



const mapContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!window.naver || !window.naver.maps) {
    console.error('Naver Maps script not loaded')
    return
  }

  const mapOptions = {
    center: new window.naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 10
  }

  if (mapContainer.value) {
    new window.naver.maps.Map(mapContainer.value, mapOptions)
  }
})
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" id="map" class="map-content"></div>
  </div>
</template>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 400px;
}

.map-content {
  width: 100%;
  height: 100%;
}
</style>