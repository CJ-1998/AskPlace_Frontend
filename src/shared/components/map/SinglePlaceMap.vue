<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useNaverMap } from '@/shared/composables/useNaverMap'

interface MarkerItem {
    lat: number
    lng: number
    title: string
    id: string
}

interface Props {
  lat: number
  lng: number
  placeName?: string
  markers?: MarkerItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'marker-click', id: string): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const { initMap, addMarker, createLatLng, mapInstance, addListener } = useNaverMap()
const markerInstances = ref<any[]>([])
const mainMarker = ref<any>(null)

const clearMarkers = () => {
    markerInstances.value.forEach(m => m.setMap(null))
    markerInstances.value = []
}

const updateUi = () => {
    if (!mapInstance.value || !window.naver) return

    // 1. Center Map
    const center = createLatLng(props.lat, props.lng)
    
    // 2. Main Marker
    if (mainMarker.value) {
        mainMarker.value.setMap(null)
    }
    if (props.placeName) {
        mainMarker.value = addMarker({
            position: center,
            title: props.placeName,
            zIndex: 100,
            icon: {
                content: `<div style="color: #3b82f6; font-size: 42px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));"><i class="fa-solid fa-location-dot"></i></div>`,
                anchor: new window.naver.maps.Point(21, 39)
            }
        })
    }

    // 3. Additional Markers
    clearMarkers()
    if (props.markers) {
        props.markers.forEach(m => {
            const marker = addMarker({
                position: createLatLng(m.lat, m.lng),
                title: m.title,
                icon: {
                    content: `<div style="color: #22c55e; font-size: 32px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3)); cursor: pointer;"><i class="fa-solid fa-location-dot"></i></div>`,
                    anchor: new window.naver.maps.Point(16, 30) 
                }
            })
            
            if (marker) {
                addListener(marker, 'click', () => {
                   emit('marker-click', m.id)
                })
                markerInstances.value.push(marker)
            }
        })
    }
    
    // Pan to center
    mapInstance.value.setCenter(center)
}

onMounted(() => {
  if (mapContainer.value) {
    initMap(mapContainer.value, {
      center: createLatLng(props.lat, props.lng),
      zoom: 17,
      draggable: false,
      scrollWheel: false,
      scaleControl: false,
      logoControl: false,
      mapDataControl: false,
    })
    
    updateUi()
  }
})

watch(() => [props.lat, props.lng, props.markers], () => {
    updateUi()
}, { deep: true })

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full min-h-[200px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200"></div>
</template>
