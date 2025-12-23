<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNaverMap } from '@/shared/composables/useNaverMap'

interface Props {
  lat: number
  lng: number
  placeName?: string
}

const props = defineProps<Props>()

const mapContainer = ref<HTMLElement | null>(null)
const { initMap, addMarker, createLatLng, mapInstance } = useNaverMap()

onMounted(() => {
  if (mapContainer.value) {
    // Static-like map: No interactions
    initMap(mapContainer.value, {
      center: createLatLng(props.lat, props.lng),
      zoom: 16,
      draggable: false,
      scrollWheel: false,
      keyboardShortcuts: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
    })

    if (props.placeName) {
        addMarker({
            position: createLatLng(props.lat, props.lng),
            title: props.placeName
        })
    }
  }
})

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full min-h-[200px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200"></div>
</template>
